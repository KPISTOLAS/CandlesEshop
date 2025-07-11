from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, func
from sqlalchemy.exc import IntegrityError
from app.database import SessionLocal
from app.models.product import Candle, Category, CandleImage, Tag
from app.models.user import User, Order, OrderItem, Review, Address, PaymentMethod, Notification, UserToken
from pydantic import BaseModel
from app.routes.auth_routes import verify_token
from typing import List, Optional
from datetime import datetime, timedelta

router = APIRouter()


def verify_admin(current_user: User = Depends(verify_token)):
    """Verify that the current user is an admin"""
    if not getattr(current_user, 'is_admin', False):
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )
    return current_user


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
    weight_grams: Optional[int] = None
    burn_time_hours: Optional[int] = None
    color: Optional[str] = None
    scent: Optional[str] = None
    material: Optional[str] = None
    category_id: Optional[int] = None
    category: Optional[str] = None  # Allow both category_id and category string
    is_active: Optional[bool] = True
    featured: Optional[bool] = False
    discount_percentage: Optional[float] = 0.0


class CandleRead(BaseModel):
    id: int
    name: str
    description: str | None = None
    price: float
    stock_quantity: int
    weight_grams: Optional[int] = None
    burn_time_hours: Optional[int] = None
    color: Optional[str] = None
    scent: Optional[str] = None
    material: Optional[str] = None
    category_id: Optional[int] = None
    category: Optional[str] = None
    is_active: bool = True
    featured: bool = False
    discount_percentage: float = 0.0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        
    @classmethod
    def from_orm(cls, obj):
        # Convert database integer fields back to boolean for frontend
        data = {
            'id': obj.id,
            'name': obj.name,
            'description': obj.description,
            'price': float(obj.price) if obj.price else 0.0,
            'stock_quantity': obj.stock_quantity,
            'weight_grams': obj.weight_grams,
            'burn_time_hours': obj.burn_time_hours,
            'color': obj.color,
            'scent': obj.scent,
            'material': obj.material,
            'category_id': obj.category_id,
            'category': obj.category.name if obj.category else None,
            'is_active': bool(obj.is_active) if obj.is_active is not None else True,
            'featured': bool(obj.featured) if obj.featured is not None else False,
            'discount_percentage': float(obj.discount_percentage) if obj.discount_percentage else 0.0,
            'created_at': obj.created_at,
            'updated_at': obj.updated_at
        }
        return cls(**data)


class CategoryCreate(BaseModel):
    name: str
    description: str | None = None


class CategoryRead(CategoryCreate):
    id: int

    class Config:
        from_attributes = True


class TagCreate(BaseModel):
    name: str


class TagRead(TagCreate):
    id: int

    class Config:
        from_attributes = True


class CandleImageCreate(BaseModel):
    candle_id: int
    image_url: str
    alt_text: Optional[str] = None


class CandleImageRead(CandleImageCreate):
    id: int

    class Config:
        from_attributes = True


class UserRead(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None
    phone: Optional[str] = None
    profile_picture: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class OrderRead(BaseModel):
    id: int
    user_id: int
    status: str
    order_date: datetime
    total_amount: Optional[float] = None

    class Config:
        from_attributes = True


class OrderItemRead(BaseModel):
    id: int
    order_id: int
    candle_id: int
    quantity: int
    price_at_order: float

    class Config:
        from_attributes = True


class ReviewRead(BaseModel):
    id: int
    user_id: int
    candle_id: int
    rating: int
    comment: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class AddressRead(BaseModel):
    id: int
    user_id: int
    type: Optional[str] = None
    street: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None

    class Config:
        from_attributes = True


class PaymentMethodRead(BaseModel):
    id: int
    user_id: int
    card_last4: Optional[str] = None
    card_brand: Optional[str] = None
    expiry_month: Optional[int] = None
    expiry_year: Optional[int] = None
    added_at: datetime

    class Config:
        from_attributes = True


class NotificationRead(BaseModel):
    id: int
    user_id: int
    title: Optional[str] = None
    message: Optional[str] = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserTokenRead(BaseModel):
    id: int
    user_id: int
    token: str
    type: Optional[str] = None
    is_used: bool
    created_at: datetime
    expires_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class DashboardStats(BaseModel):
    total_users: int
    total_orders: int
    total_revenue: float
    total_candles: int
    low_stock_candles: int
    recent_orders: List[OrderRead]
    top_selling_candles: List[dict]


@router.post("/v2/", response_model=CandleRead, dependencies=[Depends(verify_admin)])
def create_candle(candle: CandleCreate, db: Session = Depends(get_db)):
    # Convert the data for database storage
    candle_data = candle.dict()
    
    # Handle category field - if category string is provided, find or create category
    if candle_data.get('category') and not candle_data.get('category_id'):
        category_name = candle_data.pop('category')
        db_category = db.query(Category).filter(Category.name == category_name).first()
        if not db_category:
            db_category = Category(name=category_name)
            db.add(db_category)
            db.commit()
            db.refresh(db_category)
        candle_data['category_id'] = db_category.id
    
    # Convert boolean fields to integers for database
    if 'is_active' in candle_data:
        candle_data['is_active'] = 1 if candle_data['is_active'] else 0
    if 'featured' in candle_data:
        candle_data['featured'] = 1 if candle_data['featured'] else 0
    
    # Remove category string field if it exists
    candle_data.pop('category', None)
    
    db_candle = Candle(**candle_data)
    db.add(db_candle)
    db.commit()
    db.refresh(db_candle)
    return db_candle


@router.get("/v2/", response_model=List[CandleRead], dependencies=[Depends(verify_admin)])
def list_candles(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    category_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Candle)
    if category_id:
        query = query.filter(Candle.category_id == category_id)
    return query.offset(skip).limit(limit).all()


@router.get("/v2/{candle_id}", response_model=CandleRead, dependencies=[Depends(verify_admin)])
def get_candle(candle_id: int, db: Session = Depends(get_db)):
    candle = db.query(Candle).filter(Candle.id == candle_id).first()
    if not candle:
        raise HTTPException(status_code=404, detail="Candle not found")
    return candle


@router.put("/v2/{candle_id}", response_model=CandleRead, dependencies=[Depends(verify_admin)])
def update_candle(candle_id: int, candle: CandleCreate, db: Session = Depends(get_db)):
    db_candle = db.query(Candle).filter(Candle.id == candle_id).first()
    if not db_candle:
        raise HTTPException(status_code=404, detail="Candle not found")
    
    # Convert the data for database storage
    candle_data = candle.dict()
    
    # Handle category field - if category string is provided, find or create category
    if candle_data.get('category') and not candle_data.get('category_id'):
        category_name = candle_data.pop('category')
        db_category = db.query(Category).filter(Category.name == category_name).first()
        if not db_category:
            db_category = Category(name=category_name)
            db.add(db_category)
            db.commit()
            db.refresh(db_category)
        candle_data['category_id'] = db_category.id
    
    # Convert boolean fields to integers for database
    if 'is_active' in candle_data:
        candle_data['is_active'] = 1 if candle_data['is_active'] else 0
    if 'featured' in candle_data:
        candle_data['featured'] = 1 if candle_data['featured'] else 0
    
    # Remove category string field if it exists
    candle_data.pop('category', None)
    
    # Update the candle with converted data
    for key, value in candle_data.items():
        setattr(db_candle, key, value)
    
    db.commit()
    db.refresh(db_candle)
    return db_candle


@router.delete("/v2/deleteid/{candle_id}", status_code=204, dependencies=[Depends(verify_admin)])
def delete_candle(candle_id: int, db: Session = Depends(get_db)):
    try:
        candle = db.query(Candle).filter(Candle.id == candle_id).first()
        if not candle:
            raise HTTPException(status_code=404, detail="Candle not found")
        db.delete(candle)
        db.commit()
        return
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400, 
            detail="Cannot delete candle. It may be referenced in orders, cart items, or other related data. Please remove all references first."
        )


@router.post("/v2/bulk-delete", dependencies=[Depends(verify_admin)])
def bulk_delete_candles(product_ids: List[int], db: Session = Depends(get_db)):
    if not product_ids:
        raise HTTPException(status_code=400, detail="No product IDs provided")
    
    deleted_count = 0
    failed_deletions = []
    
    try:
        for product_id in product_ids:
            candle = db.query(Candle).filter(Candle.id == product_id).first()
            if candle:
                try:
                    db.delete(candle)
                    deleted_count += 1
                except IntegrityError:
                    failed_deletions.append(product_id)
                    db.rollback()
                    continue
        
        db.commit()
        
        if failed_deletions:
            return {
                "message": f"Successfully deleted {deleted_count} products",
                "failed_deletions": failed_deletions,
                "warning": "Some products could not be deleted due to existing references"
            }
        
        return {"message": f"Successfully deleted {deleted_count} products"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="An error occurred during bulk deletion")


@router.post("/v2/categories/", response_model=CategoryRead, dependencies=[Depends(verify_admin)])
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    db_category = Category(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


@router.get("/v2/categories/", response_model=List[CategoryRead], dependencies=[Depends(verify_admin)])
def list_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()


@router.put("/v2/categories/{category_id}", response_model=CategoryRead, dependencies=[Depends(verify_admin)])
def update_category(category_id: int, category: CategoryCreate, db: Session = Depends(get_db)):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    for key, value in category.dict().items():
        setattr(db_category, key, value)
    db.commit()
    db.refresh(db_category)
    return db_category


@router.delete("/v2/categories/{category_id}", status_code=204, dependencies=[Depends(verify_admin)])
def delete_category(category_id: int, db: Session = Depends(get_db)):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(db_category)
    db.commit()
    return


@router.post("/v2/tags/", response_model=TagRead, dependencies=[Depends(verify_admin)])
def create_tag(tag: TagCreate, db: Session = Depends(get_db)):
    db_tag = Tag(**tag.dict())
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    return db_tag


@router.get("/v2/tags/", response_model=List[TagRead], dependencies=[Depends(verify_admin)])
def list_tags(db: Session = Depends(get_db)):
    return db.query(Tag).all()


@router.delete("/v2/tags/{tag_id}", status_code=204, dependencies=[Depends(verify_admin)])
def delete_tag(tag_id: int, db: Session = Depends(get_db)):
    db_tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if not db_tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    db.delete(db_tag)
    db.commit()
    return


@router.post("/v2/images/", response_model=CandleImageRead, dependencies=[Depends(verify_admin)])
def create_candle_image(image: CandleImageCreate, db: Session = Depends(get_db)):
    candle = db.query(Candle).filter(Candle.id == image.candle_id).first()
    if not candle:
        raise HTTPException(status_code=404, detail="Candle not found")
    
    db_image = CandleImage(**image.dict())
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image


@router.get("/v2/images/candle/{candle_id}", response_model=List[CandleImageRead], dependencies=[Depends(verify_admin)])
def get_candle_images(candle_id: int, db: Session = Depends(get_db)):
    return db.query(CandleImage).filter(CandleImage.candle_id == candle_id).all()


@router.delete("/v2/images/{image_id}", status_code=204, dependencies=[Depends(verify_admin)])
def delete_candle_image(image_id: int, db: Session = Depends(get_db)):
    db_image = db.query(CandleImage).filter(CandleImage.id == image_id).first()
    if not db_image:
        raise HTTPException(status_code=404, detail="Image not found")
    db.delete(db_image)
    db.commit()
    return


@router.get("/v2/users/", response_model=List[UserRead], dependencies=[Depends(verify_admin)])
def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    return db.query(User).offset(skip).limit(limit).all()


@router.get("/v2/users/{user_id}", response_model=UserRead, dependencies=[Depends(verify_admin)])
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.delete("/v2/users/{user_id}", status_code=204, dependencies=[Depends(verify_admin)])
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return


@router.get("/v2/orders/", response_model=List[OrderRead], dependencies=[Depends(verify_admin)])
def list_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Order)
    if status:
        query = query.filter(Order.status == status)
    return query.order_by(desc(Order.order_date)).offset(skip).limit(limit).all()


@router.get("/v2/orders/{order_id}", response_model=OrderRead, dependencies=[Depends(verify_admin)])
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.put("/v2/orders/{order_id}/status", dependencies=[Depends(verify_admin)])
def update_order_status(order_id: int, status: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    valid_statuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    db.query(Order).filter(Order.id == order_id).update({"status": status})
    db.commit()
    return {"message": "Order status updated successfully"}


@router.get("/v2/orders/{order_id}/items", response_model=List[OrderItemRead], dependencies=[Depends(verify_admin)])
def get_order_items(order_id: int, db: Session = Depends(get_db)):
    return db.query(OrderItem).filter(OrderItem.order_id == order_id).all()


@router.get("/v2/reviews/", response_model=List[ReviewRead], dependencies=[Depends(verify_admin)])
def list_reviews(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    candle_id: Optional[int] = None,
    rating: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Review)
    if candle_id:
        query = query.filter(Review.candle_id == candle_id)
    if rating:
        query = query.filter(Review.rating == rating)
    return query.order_by(desc(Review.created_at)).offset(skip).limit(limit).all()


@router.delete("/v2/reviews/{review_id}", status_code=204, dependencies=[Depends(verify_admin)])
def delete_review(review_id: int, db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    db.delete(review)
    db.commit()
    return


@router.get("/v2/users/{user_id}/addresses", response_model=List[AddressRead], dependencies=[Depends(verify_admin)])
def get_user_addresses(user_id: int, db: Session = Depends(get_db)):
    return db.query(Address).filter(Address.user_id == user_id).all()


@router.get("/v2/users/{user_id}/payment-methods", response_model=List[PaymentMethodRead], dependencies=[Depends(verify_admin)])
def get_user_payment_methods(user_id: int, db: Session = Depends(get_db)):
    return db.query(PaymentMethod).filter(PaymentMethod.user_id == user_id).all()


@router.get("/v2/notifications/", response_model=List[NotificationRead], dependencies=[Depends(verify_admin)])
def list_notifications(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    user_id: Optional[int] = None,
    is_read: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Notification)
    if user_id:
        query = query.filter(Notification.user_id == user_id)
    if is_read is not None:
        query = query.filter(Notification.is_read == is_read)
    return query.order_by(desc(Notification.created_at)).offset(skip).limit(limit).all()


@router.post("/v2/notifications/", dependencies=[Depends(verify_admin)])
def create_notification(
    user_id: int,
    title: str,
    message: str,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    notification = Notification(
        user_id=user_id,
        title=title,
        message=message
    )
    db.add(notification)
    db.commit()
    return {"message": "Notification created successfully"}


@router.get("/v2/user-tokens/", response_model=List[UserTokenRead], dependencies=[Depends(verify_admin)])
def list_user_tokens(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    user_id: Optional[int] = None,
    token_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(UserToken)
    if user_id:
        query = query.filter(UserToken.user_id == user_id)
    if token_type:
        query = query.filter(UserToken.type == token_type)
    return query.order_by(desc(UserToken.created_at)).offset(skip).limit(limit).all()


@router.get("/v2/dashboard/stats", response_model=DashboardStats, dependencies=[Depends(verify_admin)])
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_users = db.query(func.count(User.id)).scalar()
    total_orders = db.query(func.count(Order.id)).scalar()
    total_candles = db.query(func.count(Candle.id)).scalar()
    
    total_revenue = db.query(func.coalesce(func.sum(Order.total_amount), 0)).scalar()
    
    low_stock_candles = db.query(func.count(Candle.id)).filter(Candle.stock_quantity < 10).scalar()
    
    recent_orders = db.query(Order).order_by(desc(Order.order_date)).limit(10).all()
    
    top_selling = db.query(
        Candle.id,
        Candle.name,
        func.sum(OrderItem.quantity).label('total_sold')
    ).join(OrderItem, Candle.id == OrderItem.candle_id)\
     .group_by(Candle.id, Candle.name)\
     .order_by(desc('total_sold'))\
     .limit(5).all()
    
    top_selling_candles = [
        {"id": item.id, "name": item.name, "total_sold": item.total_sold}
        for item in top_selling
    ]
    
    return DashboardStats(
        total_users=total_users,
        total_orders=total_orders,
        total_revenue=float(total_revenue),
        total_candles=total_candles,
        low_stock_candles=low_stock_candles,
        recent_orders=[OrderRead.from_orm(order) for order in recent_orders],
        top_selling_candles=top_selling_candles
    )


@router.get("/v2/analytics/sales", dependencies=[Depends(verify_admin)])
def get_sales_analytics(
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db)
):
    start_date = datetime.utcnow() - timedelta(days=days)
    
    daily_sales = db.query(
        func.date(Order.order_date).label('date'),
        func.count(Order.id).label('orders'),
        func.coalesce(func.sum(Order.total_amount), 0).label('revenue')
    ).filter(Order.order_date >= start_date)\
     .group_by(func.date(Order.order_date))\
     .order_by(func.date(Order.order_date)).all()
    
    return {
        "period_days": days,
        "daily_sales": [
            {
                "date": str(sale.date),
                "orders": sale.orders,
                "revenue": float(sale.revenue)
            }
            for sale in daily_sales
        ]
    }


@router.get("/v2/analytics/inventory", dependencies=[Depends(verify_admin)])
def get_inventory_analytics(db: Session = Depends(get_db)):
    total_stock = db.query(func.sum(Candle.stock_quantity)).scalar()
    out_of_stock = db.query(func.count(Candle.id)).filter(Candle.stock_quantity == 0).scalar()
    low_stock = db.query(func.count(Candle.id)).filter(Candle.stock_quantity < 10).scalar()
    
    category_distribution = db.query(
        Category.name,
        func.count(Candle.id).label('count'),
        func.sum(Candle.stock_quantity).label('total_stock')
    ).outerjoin(Candle, Category.id == Candle.category_id)\
     .group_by(Category.id, Category.name)\
     .all()
    
    return {
        "total_stock": total_stock or 0,
        "out_of_stock": out_of_stock,
        "low_stock": low_stock,
        "category_distribution": [
            {
                "category": item.name,
                "product_count": item.count,
                "total_stock": item.total_stock or 0
            }
            for item in category_distribution
        ]
    }

