from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, timezone
from database import Base


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    type = Column(String, nullable=False)       # task / risk / goal / reminder
    status = Column(String, default="Pending")  # Pending / Done / Ignored
    priority = Column(String, default="Medium") # High / Medium / Low
    category = Column(String, default="Business") # Business / Personal / Legal
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Video(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    url = Column(String, nullable=False)
    category = Column(String, nullable=False)


class DictionaryEntry(Base):
    __tablename__ = "dictionary_entries"

    id = Column(Integer, primary_key=True, index=True)
    term = Column(String, nullable=False, unique=True)
    definition = Column(String, nullable=False)
