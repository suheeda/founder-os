from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ItemCreate(BaseModel):
    title: str
    type: str
    status: Optional[str] = "Pending"
    priority: Optional[str] = "Medium"
    category: Optional[str] = "Business"


class ItemUpdate(BaseModel):
    status: str


class ItemResponse(BaseModel):
    id: int
    title: str
    type: str
    status: str
    priority: str
    category: str
    created_at: datetime

    class Config:
        from_attributes = True


class VideoResponse(BaseModel):
    id: int
    title: str
    url: str
    category: str

    class Config:
        from_attributes = True


class DictionaryResponse(BaseModel):
    id: int
    term: str
    definition: str

    class Config:
        from_attributes = True


class ParseInputRequest(BaseModel):
    text: str
