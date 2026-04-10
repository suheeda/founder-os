import re
from typing import Dict, List

TASK_KEYWORDS = [
    "finalize",
    "send",
    "review",
    "complete",
    "prepare",
    "follow up",
    "follow-up",
    "call",
    "submit",
    "schedule",
]

REMINDER_KEYWORDS = [
    "tomorrow",
    "friday",
    "monday",
    "next week",
    "today",
    "deadline",
    "evening",
]

RISK_KEYWORDS = [
    "confused",
    "unsure",
    "issue",
    "concern",
    "unclear",
    "blocked",
    "problem",
]

GOAL_KEYWORDS = [
    "gym",
    "exercise",
    "improve",
    "learn",
    "start",
    "routine",
    "habit",
    "read",
]

CATEGORY_KEYWORDS = {
    "Business": ["investor", "vendor", "product", "customer"],
    "Legal": ["agreement", "contract", "esop", "liability"],
    "Personal": ["gym", "health", "sleep", "routine", "habit", "read", "exercise"],
}

HIGH_PRIORITY_KEYWORDS = ["urgent", "today", "deadline", "investor", "legal"]
LOW_PRIORITY_KEYWORDS = ["long-term", "long term", "habit", "routine", "improve", "learn"]


def split_input(raw_text: str) -> List[str]:
    chunks = re.split(r"\s*(?:,|\band\b|\.)\s*", raw_text, flags=re.IGNORECASE)
    return [chunk.strip() for chunk in chunks if chunk and chunk.strip()]


def normalize_text(text: str) -> str:
    return " ".join(text.lower().strip().split())


def clean_display_title(text: str) -> str:
    cleaned = re.sub(r"^\s*(need to|need|have to|must)\s+", "", text, flags=re.IGNORECASE)
    cleaned = " ".join(cleaned.strip().split())
    if not cleaned:
        return ""
    return cleaned[0].upper() + cleaned[1:]


def count_keyword_matches(text: str, keywords: List[str]) -> int:
    score = 0
    for keyword in keywords:
        if keyword in text:
            score += 1
    return score


def classify_type(normalized_text: str) -> str:
    scores = {
        "task": count_keyword_matches(normalized_text, TASK_KEYWORDS),
        "reminder": count_keyword_matches(normalized_text, REMINDER_KEYWORDS) * 2,
        "risk": count_keyword_matches(normalized_text, RISK_KEYWORDS) * 3,
        "goal": count_keyword_matches(normalized_text, GOAL_KEYWORDS) * 3,
    }

    best_type = "task"
    best_score = scores["task"]

    priority_order = ["risk", "goal", "reminder", "task"]

    for item_type in priority_order:
        current_score = scores[item_type]
        if current_score > best_score:
            best_score = current_score
            best_type = item_type

    return best_type if best_score > 0 else "task"


def classify_category(normalized_text: str) -> str:
    scores = {
        category: count_keyword_matches(normalized_text, keywords)
        for category, keywords in CATEGORY_KEYWORDS.items()
    }

    tie_break_order = ["Legal", "Personal", "Business"]
    best_category = "Business"
    best_score = -1

    for category in tie_break_order:
        score = scores.get(category, 0)
        if score > best_score:
            best_score = score
            best_category = category

    return best_category if best_score > 0 else "Business"


def classify_priority(normalized_text: str, item_type: str, category: str) -> str:
    if category == "Legal":
        return "High"

    if any(keyword in normalized_text for keyword in HIGH_PRIORITY_KEYWORDS):
        return "High"

    if item_type == "goal":
        return "Low"

    if any(keyword in normalized_text for keyword in LOW_PRIORITY_KEYWORDS):
        return "Low"

    return "Medium"


def build_item_payload(segment: str) -> Dict[str, str]:
    normalized = normalize_text(segment)
    item_type = classify_type(normalized)
    category = classify_category(normalized)
    priority = classify_priority(normalized, item_type, category)

    return {
        "title": clean_display_title(segment),
        "type": item_type,
        "status": "Pending",
        "priority": priority,
        "category": category,
    }


def parse_input(raw_text: str) -> List[Dict[str, str]]:
    segments = split_input(raw_text)
    parsed_items = []

    for segment in segments:
        payload = build_item_payload(segment)
        if payload["title"]:
            parsed_items.append(payload)

    return parsed_items