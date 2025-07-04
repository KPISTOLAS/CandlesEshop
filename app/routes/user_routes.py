from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.product import Candle, Category, Tag
from pydantic import BaseModel
from typing import List

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class CandleRead(BaseModel):
    id: int
    name: str
    description: str | None = None
    price: float
    stock_quantity: int

    class Config:
        orm_mode = True


class CategoryRead(BaseModel):
    id: int
    name: str
    description: str | None = None

    class Config:
        orm_mode = True


class TagRead(BaseModel):
    id: int
    name: str
    description: str | None = None

    class Config:
        orm_mode = True


@router.get("/v2/", response_model=List[CandleRead])
def get_candles(db: Session = Depends(get_db)):
    return db.query(Candle).all()


@router.get("/v2/{candle_id}", response_model=CandleRead)
def get_candle_by_id(candle_id: int, db: Session = Depends(get_db)):
    candle = db.query(Candle).filter(Candle.id == candle_id).first()
    if not candle:
        raise HTTPException(status_code=404, detail="Candle not found")
    return candle


@router.get("/v2/categories/", response_model=List[CategoryRead])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()


@router.get("/candles/v2/search/", response_model=List[CandleRead])
def search_candles(query: str, db: Session = Depends(get_db)):
    return db.query(Candle).filter(
        (Candle.name.ilike(f"%{query}%")) | (Candle.scent.ilike(f"%{query}%"))
    ).all()


@router.get("/tags/", response_model=List[TagRead])
def get_tags(db: Session = Depends(get_db)):
    return db.query(Tag).all()


@router.get("/candles/v2/by_tag/{tag_id}", response_model=List[CandleRead])
def get_candles_by_tag(tag_id: int, db: Session = Depends(get_db)):
    return db.query(Candle).join(Candle.tags).filter(Tag.id == tag_id).all()

