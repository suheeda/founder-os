from typing import List

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, get_db
from models import Base, Item, Video, DictionaryEntry
from schemas import (
    ItemCreate,
    ItemUpdate,
    ItemResponse,
    VideoResponse,
    DictionaryResponse,
    ParseInputRequest,
)
from parser_logic import parse_input
from seed_data import seed

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Founder OS API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://founder-os-frontend.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    seed()


@app.post("/parse-input", response_model=List[ItemResponse])
def parse_and_save(payload: ParseInputRequest, db: Session = Depends(get_db)):
    parsed_items = parse_input(payload.text)

    if not parsed_items:
        return []

    saved_items = []
    for item_data in parsed_items:
        item = Item(
            title=item_data["title"],
            type=item_data["type"],
            status=item_data["status"],
            priority=item_data["priority"],
            category=item_data["category"],
        )
        db.add(item)
        db.commit()
        db.refresh(item)
        saved_items.append(item)

    return saved_items


@app.get("/items", response_model=List[ItemResponse])
def get_items(db: Session = Depends(get_db)):
    return db.query(Item).order_by(Item.created_at.desc()).all()


@app.post("/items", response_model=ItemResponse)
def create_item(payload: ItemCreate, db: Session = Depends(get_db)):
    item = Item(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@app.patch("/items/{item_id}", response_model=ItemResponse)
def update_item_status(item_id: int, payload: ItemUpdate, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    item.status = payload.status
    db.commit()
    db.refresh(item)
    return item


@app.delete("/items/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    db.delete(item)
    db.commit()
    return {"detail": "Item deleted"}


@app.get("/videos", response_model=List[VideoResponse])
def get_videos(db: Session = Depends(get_db)):
    return db.query(Video).order_by(Video.category, Video.title).all()


@app.get("/dictionary", response_model=List[DictionaryResponse])
def get_dictionary(db: Session = Depends(get_db)):
    return db.query(DictionaryEntry).order_by(DictionaryEntry.term).all()


@app.get("/dictionary/search", response_model=List[DictionaryResponse])
def search_dictionary(q: str = "", db: Session = Depends(get_db)):
    if not q.strip():
        return db.query(DictionaryEntry).order_by(DictionaryEntry.term).all()

    query = f"%{q.strip()}%"
    return (
        db.query(DictionaryEntry)
        .filter(
            DictionaryEntry.term.ilike(query)
            | DictionaryEntry.definition.ilike(query)
        )
        .order_by(DictionaryEntry.term)
        .all()
    )


@app.get("/")
def root():
    return {"status": "ok", "service": "Founder OS API"}