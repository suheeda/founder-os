# Scaling Answer — Founder OS at 50,000 Daily Founders

## Question
"If this product is used by 50,000 founders daily, what will break first and how would you fix it?"

---

## What Breaks First: SQLite Concurrency

SQLite uses file-level locking. With 50,000 users doing concurrent reads and writes, the database will start throwing `database is locked` errors almost immediately under load.

**Fix**: Migrate to PostgreSQL.

```python
# Change one line in database.py
DATABASE_URL = "postgresql://user:pass@localhost/founderos"
```

SQLAlchemy's ORM abstracts the difference — no other code changes needed.

---

## High Read/Write Load

At 50,000 DAU with ~5 parse operations each = 250,000 writes/day and even more reads.

**Fixes**:
1. **Add database indexing** on frequently queried columns:
   ```sql
   CREATE INDEX idx_items_type ON items(type);
   CREATE INDEX idx_items_status ON items(status);
   CREATE INDEX idx_items_created_at ON items(created_at);
   ```

2. **Read replicas** — Route all GET requests to read replicas; writes go to primary.

3. **Connection pooling** — Use PgBouncer to manage DB connections efficiently instead of opening a new connection per request.

---

## Parser Bottleneck

The parser runs synchronously in the request cycle. Under load, slow parse operations (long inputs) will block the event loop.

**Fix**: Offload parsing to a background task queue.

```
Request → FastAPI → enqueue parse job → return 202 Accepted
                         ↓
                    Celery Worker (Redis queue) → parse → save to DB
                         ↓
                    WebSocket push to frontend (or polling)
```

This decouples parsing latency from API response time.

---

## Caching Strategy

The `/videos` and `/dictionary` endpoints return static data that never changes per request.

**Fix**: Cache these responses in Redis.

```python
@app.get("/videos")
async def get_videos():
    cached = redis_client.get("videos")
    if cached:
        return json.loads(cached)
    videos = db.query(Video).all()
    redis_client.setex("videos", 3600, json.dumps([v.__dict__ for v in videos]))
    return videos
```

This eliminates DB hits for the two most frequent read endpoints.

---

## Infrastructure Upgrade Path

| Stage      | Users      | Stack                                    |
|------------|------------|------------------------------------------|
| MVP        | < 1,000    | SQLite + single FastAPI server           |
| Growth     | 1K–10K     | PostgreSQL + FastAPI + basic indexing    |
| Scale      | 10K–100K   | PG + read replicas + Redis + Celery      |
| Hyper-scale| 100K+      | Microservices, separate parser service   |

---

## Separating the Parser Service

At scale, parsing is the most CPU-variable operation. It should become its own microservice:

```
API Gateway
    ├── items-service     (FastAPI + PostgreSQL)
    ├── parser-service    (FastAPI + Celery workers, scales independently)
    ├── content-service   (videos + dictionary, cached aggressively)
    └── auth-service      (JWT tokens, user management)
```

Parser workers can autoscale horizontally (Kubernetes HPA) based on queue depth.

---

## Summary

| Problem                 | Root Cause              | Fix                              |
|-------------------------|-------------------------|----------------------------------|
| DB locking              | SQLite file-level lock  | Migrate to PostgreSQL            |
| Slow queries            | No indexes              | Add composite indexes            |
| Connection exhaustion   | New conn per request    | PgBouncer connection pooling     |
| Parser blocking API     | Synchronous execution   | Celery + Redis task queue        |
| Repeated static reads   | No caching              | Redis cache for videos/dict      |
| Single point of failure | Monolith                | Microservices per domain         |
