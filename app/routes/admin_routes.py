from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.product import Candle, Category
from pydantic import BaseModel
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


class CategoryCreate(BaseModel):
    name: str
    description: str | None = None


class CategoryRead(CategoryCreate):
    id: int

    class Config:
        orm_mode = True


@router.post("/v2/", response_model=CandleRead, dependencies=[Depends(verify_api_key)])
def create_candle(candle: CandleCreate, db: Session = Depends(get_db)):
    db_candle = Candle(**candle.dict())
    db.add(db_candle)
    db.commit()
    db.refresh(db_candle)
    return db_candle


@router.delete("/v2/deleteid/{candle_id}", status_code=204, dependencies=[Depends(verify_api_key)])
def delete_candle(candle_id: int, db: Session = Depends(get_db)):
    candle = db.query(Candle).filter(Candle.id == candle_id).first()
    if not candle:
        raise HTTPException(status_code=404, detail="Candle not found")
    db.delete(candle)
    db.commit()
    return


@router.post("/v2/categories/", response_model=CategoryRead, dependencies=[Depends(verify_api_key)])
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    db_category = Category(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


@router.get("/v2/categories/", response_model=list[CategoryRead], dependencies=[Depends(verify_api_key)])
def list_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()


@router.put("/v2/categories/{category_id}", response_model=CategoryRead, dependencies=[Depends(verify_api_key)])
def update_category(category_id: int, category: CategoryCreate, db: Session = Depends(get_db)):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    for key, value in category.dict().items():
        setattr(db_category, key, value)
    db.commit()
    db.refresh(db_category)
    return db_category


@router.delete("/v2/categories/{category_id}", status_code=204, dependencies=[Depends(verify_api_key)])
def delete_category(category_id: int, db: Session = Depends(get_db)):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(db_category)
    db.commit()
    return

