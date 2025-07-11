from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.product import Candle, Category, Tag
from pydantic import BaseModel
from typing import List

from app.models.user import Address, Notification, Order, User, Wishlist

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
        from_attributes = True


class CategoryRead(BaseModel):
    id: int
    name: str
    description: str | None = None

    class Config:
        from_attributes = True


class TagRead(BaseModel):
    id: int
    name: str
    description: str | None = None

    class Config:
        from_attributes = True

class UserRead(BaseModel):
    id: int
    email: str
    full_name: str | None = None
    phone: str | None = None
    profile_picture: str | None = None
    created_at: str | None = None
    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    full_name: str | None = None
    phone: str | None = None
    profile_picture: str | None = None


class AddressRead(BaseModel):
    id: int
    type: str | None = None
    street: str | None = None
    city: str | None = None
    state: str | None = None
    postal_code: str | None = None
    country: str | None = None
    class Config:
        from_attributes = True


class AddressCreate(BaseModel):
    type: str
    street: str
    city: str
    state: str
    postal_code: str
    country: str


class OrderRead(BaseModel):
    id: int
    status: str
    order_date: str | None = None
    total_amount: float | None = None
    class Config:
        from_attributes = True


class WishlistRead(BaseModel):
    candle_id: int
    class Config:
        from_attributes = True


class NotificationRead(BaseModel):
    id: int
    title: str
    message: str
    is_read: bool
    created_at: str | None = None
    class Config:
        from_attributes = True

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


@router.get("/v2/search/", response_model=List[CandleRead])
def search_candles(query: str, db: Session = Depends(get_db)):
    return db.query(Candle).filter(
        (Candle.name.ilike(f"%{query}%")) | (Candle.scent.ilike(f"%{query}%"))
    ).all()


@router.get("/v2/tags/", response_model=List[TagRead])
def get_tags(db: Session = Depends(get_db)):
    return db.query(Tag).all()


@router.get("/v2/by_tag/{tag_id}", response_model=List[CandleRead])
def get_candles_by_tag(tag_id: int, db: Session = Depends(get_db)):
    return db.query(Candle).join(Candle.tags).filter(Tag.id == tag_id).all()


@router.get("/v2/users/{user_id}", response_model=UserRead)
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/v2/users/{user_id}", response_model=UserRead)
def update_user_profile(user_id: int, update: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    for key, value in update.dict(exclude_unset=True).items():
        setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user


@router.get("/v2/users/{user_id}/addresses", response_model=List[AddressRead])
def get_user_addresses(user_id: int, db: Session = Depends(get_db)):
    return db.query(Address).filter(Address.user_id == user_id).all()


@router.post("/v2/users/{user_id}/addresses", response_model=AddressRead)
def add_user_address(user_id: int, address: AddressCreate, db: Session = Depends(get_db)):
    db_address = Address(user_id=user_id, **address.dict())
    db.add(db_address)
    db.commit()
    db.refresh(db_address)
    return db_address


@router.get("/v2/users/{user_id}/orders", response_model=List[OrderRead])
def get_user_orders(user_id: int, db: Session = Depends(get_db)):
    return db.query(Order).filter(Order.user_id == user_id).all()


@router.get("/v2/users/{user_id}/wishlist", response_model=List[WishlistRead])
def get_user_wishlist(user_id: int, db: Session = Depends(get_db)):
    return db.query(Wishlist).filter(Wishlist.user_id == user_id).all()


@router.post("/v2/users/{user_id}/wishlist/{candle_id}", response_model=WishlistRead)
def add_candle_to_wishlist(user_id: int, candle_id: int, db: Session = Depends(get_db)):
    exists = db.query(Wishlist).filter(Wishlist.user_id == user_id, Wishlist.candle_id == candle_id).first()
    if exists:
        raise HTTPException(status_code=400, detail="Candle already in wishlist")
    wishlist = Wishlist(user_id=user_id, candle_id=candle_id)
    db.add(wishlist)
    db.commit()
    db.refresh(wishlist)
    return wishlist


@router.delete("/v2/users/{user_id}/wishlist/{candle_id}")
def remove_candle_from_wishlist(user_id: int, candle_id: int, db: Session = Depends(get_db)):
    wishlist = db.query(Wishlist).filter(Wishlist.user_id == user_id, Wishlist.candle_id == candle_id).first()
    if not wishlist:
        raise HTTPException(status_code=404, detail="Candle not in wishlist")
    db.delete(wishlist)
    db.commit()
    return {"detail": "Removed from wishlist"}


@router.get("/v2/users/{user_id}/notifications", response_model=List[NotificationRead])
def get_user_notifications(user_id: int, db: Session = Depends(get_db)):
    return db.query(Notification).filter(Notification.user_id == user_id).all()


@router.put("/v2/users/{user_id}/notifications/{notification_id}/read", response_model=NotificationRead)
def mark_notification_as_read(user_id: int, notification_id: int, db: Session = Depends(get_db)):
    notification = db.query(Notification).filter(Notification.user_id == user_id, Notification.id == notification_id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    setattr(notification, "is_read", True)
    db.commit()
    db.refresh(notification)
    return notification
