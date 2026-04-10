# Product Document — Founder OS

## Problem Understanding

Early-stage founders operate in constant chaos. Ideas, risks, follow-ups, and personal goals live scattered across WhatsApp messages, notes apps, and mental load. There is no tool designed specifically for the founder's mental model — one that understands that "call investor Friday" and "confused about cap table" are fundamentally different types of problems requiring different workflows.

---

## Target User

**Primary**: Solo founders or co-founding teams at pre-seed to seed stage.

**Profile**:
- Wearing multiple hats (CEO + engineer + sales)
- Context-switching 10+ times a day
- Under-resourced, no dedicated project manager
- Thinking in fragments, not structured tickets

---

## User Pain Points

1. **Cognitive overload** — Too many things to track mentally
2. **Mixed priority types** — Tasks, risks, goals, and reminders all feel the same until they don't
3. **No founder-specific vocabulary** — Generic PM tools don't understand "ESOP confusion" is a legal risk, not a task
4. **Learning gap** — No curated resource to understand startup-specific concepts quickly

---

## Feature Decisions

### 1. Free-form Input Parser
Founders don't want to fill forms. They think in sentences. The parser accepts messy, comma-separated thoughts and classifies them automatically. This reduces friction to near zero.

### 2. Four Item Types
- **Task** — Something to do
- **Risk** — Something uncertain or concerning
- **Goal** — A habit or directional intention
- **Reminder** — Time-anchored follow-up

These four cover ~90% of a founder's daily mental output.

### 3. Priority + Category
Priority (High/Medium/Low) helps with Today's Focus. Category (Business/Personal/Legal) enables filtering later.

### 4. Learning Hub
Founders frequently encounter unfamiliar terms (ESOP, liquidation preference, ARR). A searchable dictionary and curated videos reduce the "Google spiral."

---

## Why Rule-Based Parsing?

- **Zero cost** — No API fees, no rate limits
- **Explainable** — Easy to debug: if "finalize" → task, that's readable logic
- **Fast** — Runs synchronously in milliseconds
- **Extensible** — New keywords can be added in a config list
- **Appropriate for MVP** — ML adds complexity before product-market fit

Trade-off: Lower accuracy on ambiguous phrases. Acceptable at this stage.

---

## UX Simplicity Principles

1. One input box for capture — no mode switching
2. Dashboard organized by how founders think, not by database schema
3. Status update in-place (dropdown per item, not a separate edit page)
4. Learning Hub separated — focus mode, not mixed with operational items
5. No login required for MVP — reduces onboarding friction
