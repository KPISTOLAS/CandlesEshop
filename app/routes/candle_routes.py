from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.product import Candle
from pydantic import BaseModel
from typing import List
from app.dependencies import verify_api_key

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class CandleCreate(BaseModel):
    name: str
    description: str | None = None
    price: float
    stock_quantity: int

class CandleRead(CandleCreate):
    id: int
    class Config:
        orm_mode = True

@router.get("/v1/", response_model=List[CandleRead])
def get_candles(db: Session = Depends(get_db)):
    return db.query(Candle).all()
@router.get("/v1/{candle_id}", response_model=CandleRead)
def get_candle_by_id(candle_id: int, db: Session = Depends(get_db)):
    candle = db.query(Candle).filter(Candle.id == candle_id).first()
    if not candle:
        raise HTTPException(status_code=404, detail="Candle not found")
    return candle
@router.post("/v1/", response_model=CandleRead, dependencies=[Depends(verify_api_key)])
def create_candle(candle: CandleCreate, db: Session = Depends(get_db)):
    db_candle = Candle(**candle.dict())
    db.add(db_candle)
    db.commit()
    db.refresh(db_candle)
    return db_candle

@router.delete("/v1/deleteid/{candle_id}", status_code=204, dependencies=[Depends(verify_api_key)])
def delete_candle(candle_id: int, db: Session = Depends(get_db)):
    candle = db.query(Candle).filter(Candle.id == candle_id).first()
    if not candle:
        raise HTTPException(status_code=404, detail="Candle not found")
    db.delete(candle)
    db.commit()
