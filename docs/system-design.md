# System Design — Founder OS

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│                  Browser                     │
│           React + Tailwind (Vite)            │
│                                              │
│  CaptureInput → Dashboard → LearningHub     │
└──────────────────────┬──────────────────────┘
                       │ HTTP REST
                       ▼
┌─────────────────────────────────────────────┐
│              FastAPI Backend                 │
│                                             │
│  /parse-input  →  parser_logic.py           │
│  /items        →  CRUD via SQLAlchemy       │
│  /videos       →  Static seeded data        │
│  /dictionary   →  Static seeded data        │
└──────────────────────┬──────────────────────┘
                       │ SQLAlchemy ORM
                       ▼
┌─────────────────────────────────────────────┐
│            SQLite Database                   │
│                                             │
│  Tables: items, videos, dictionary_entries  │
└─────────────────────────────────────────────┘
```

---

## Data Flow

### Parse Input Flow
1. User pastes free-form text into `CaptureInput`
2. Frontend POSTs to `/parse-input`
3. Backend calls `parser_logic.parse_input(text)`
4. Parser splits text → classifies each chunk → returns list of item dicts
5. Backend saves each item to SQLite via SQLAlchemy
6. Returns saved items to frontend
7. Frontend re-fetches `/items` and updates dashboard

### Status Update Flow
1. User changes status dropdown on any item card
2. Frontend sends `PATCH /items/{id}` with `{ status: "Done" }`
3. Backend updates record in SQLite
4. Frontend reflects change immediately (optimistic update)

---

## Parser Logic (parser_logic.py)

### Step-by-step

```
Input: "finalize vendor agreement, gym tomorrow, confused about ESOP"

Step 1 — Split
  ["finalize vendor agreement", "gym tomorrow", "confused about ESOP"]

Step 2 — Normalize (lowercase + strip)
  ["finalize vendor agreement", "gym tomorrow", "confused about esop"]

Step 3 — Classify type
  Each chunk checked against keyword sets:
  - reminder_keywords: tomorrow, friday, today, deadline, ...
  - risk_keywords:     confused, unsure, blocked, concern, ...
  - goal_keywords:     gym, exercise, improve, learn, habit, ...
  - task_keywords:     finalize, send, review, call, submit, ...

  Priority: reminder > risk > goal > task (most specific first)

Step 4 — Classify category
  - legal_keywords:    agreement, contract, esop, liability, ...
  - business_keywords: investor, vendor, product, customer, ...
  - personal_keywords: gym, health, sleep, routine, ...

Step 5 — Assign priority
  - High: urgent, today, deadline, investor, legal terms
  - Low:  goal type (long-term by nature)
  - Medium: default

Step 6 — Build item dict
  { id, title, type, status: Pending, priority, category, created_at }
```

---

## Database Schema

### items
| Column     | Type     | Notes                          |
|------------|----------|--------------------------------|
| id         | Integer  | Primary key, auto-increment    |
| title      | String   | Parsed or manual title         |
| type       | String   | task / risk / goal / reminder  |
| status     | String   | Pending / Done / Ignored       |
| priority   | String   | High / Medium / Low            |
| category   | String   | Business / Personal / Legal    |
| created_at | DateTime | UTC timestamp                  |

### videos
| Column   | Type   | Notes                  |
|----------|--------|------------------------|
| id       | Integer| Primary key            |
| title    | String | Video title            |
| url      | String | YouTube URL            |
| category | String | Fundraising, Legal ... |

### dictionary_entries
| Column     | Type   | Notes              |
|------------|--------|--------------------|
| id         | Integer| Primary key        |
| term       | String | Startup term       |
| definition | String | Plain English def  |

---

## Edge Cases Handled

- Empty input → returns empty list, no crash
- Single word input → classified with fallback to "task"
- All-caps input → normalized to lowercase before matching
- Duplicate submission → creates duplicate items (acceptable at MVP; dedup can be added)
- Unknown terms → default type=task, priority=Medium, category=Business

---

## Trade-offs

| Decision             | Chosen      | Alternative       | Reason                         |
|----------------------|-------------|-------------------|---------------------------------|
| DB                   | SQLite      | PostgreSQL        | Zero setup for MVP             |
| Parsing              | Rule-based  | OpenAI API        | Free, fast, explainable        |
| State management     | Local state | Redux/Zustand     | Overkill for this scale        |
| Auth                 | None        | JWT / OAuth       | Reduces friction for demo      |

---

## Future Improvements

- Full-text search on items
- Recurring reminder scheduler (Celery + Redis)
- Multi-user support with auth
- Parser v2: use spaCy NER for better classification
- Mobile app (React Native sharing the same API)
