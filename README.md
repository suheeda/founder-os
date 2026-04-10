# Founder OS — Founder Operating System

A lightweight productivity tool for early-stage founders to capture messy thoughts and convert them into structured tasks, risks, goals, and reminders.

---

## Features

- **Smart Parser** — Paste free-form text; the system classifies items by type, priority, and category using rule-based heuristics
- **Dashboard** — Organized sections: Today's Focus, Tasks, Risks, Reminders, Goals
- **Status Management** — Update item status (Pending / Done / Ignored) from the UI
- **Learning Hub** — Curated startup videos grouped by category
- **Founder Dictionary** — Searchable glossary of startup terms

---

## Tech Stack

| Layer    | Technology                  |
|----------|-----------------------------|
| Frontend | React (Vite) + Tailwind CSS |
| Backend  | Python FastAPI              |
| Database | SQLite via SQLAlchemy       |
| API      | REST                        |

---

## Setup Instructions

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python seed_data.py
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173 | Backend: http://localhost:8000

---

## API Endpoints

| Method | Endpoint               | Description                      |
|--------|------------------------|----------------------------------|
| POST   | /parse-input           | Parse free-form text, save items |
| GET    | /items                 | Fetch all items                  |
| POST   | /items                 | Create item manually             |
| PATCH  | /items/{id}            | Update item status               |
| GET    | /videos                | Fetch all videos                 |
| GET    | /dictionary            | Fetch all dictionary entries     |
| GET    | /dictionary/search?q=  | Search dictionary                |

---

## Sample Input / Output

Input: "Need to finalize vendor agreement, gym from tomorrow, investor follow-up Friday, confused about ESOP structure"

Output:
- Task → Finalize vendor agreement (High, Legal)
- Goal → Gym from tomorrow (Low, Personal)
- Reminder → Investor follow-up Friday (High, Business)
- Risk → Confused about ESOP structure (High, Legal)

---

## Assumptions

- Parser is fully rule-based (no ML/AI APIs)
- SQLite for simplicity; PostgreSQL recommended for production
- Videos and dictionary seeded via seed_data.py
- All timestamps are UTC

---

## Future Improvements

- User authentication
- Recurring reminders with notifications
- AI-assisted parsing (optional upgrade path)
- Export to Notion / CSV
