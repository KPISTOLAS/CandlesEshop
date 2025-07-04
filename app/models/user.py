from sqlalchemy import Column, Integer, String, Text, ForeignKey, TIMESTAMP, Boolean, DECIMAL
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(150), unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    full_name = Column(String(150))
    phone = Column(String(20))
    profile_picture = Column(Text)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    addresses = relationship("Address", back_populates="user", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="user", cascade="all, delete-orphan")
    wishlist = relationship("Wishlist", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="user", cascade="all, delete-orphan")
    payment_methods = relationship("PaymentMethod", back_populates="user", cascade="all, delete-orphan")
    tokens = relationship("UserToken", back_populates="user", cascade="all, delete-orphan")

class Address(Base):
    __tablename__ = "addresses"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    type = Column(String(50))
    street = Column(String(255))
    city = Column(String(100))
    state = Column(String(100))
    postal_code = Column(String(20))
    country = Column(String(100))

    user = relationship("User", back_populates="addresses")

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String(50), default="pending")
    order_date = Column(TIMESTAMP, default=datetime.utcnow)
    total_amount = Column(DECIMAL(10,2))

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"))
    candle_id = Column(Integer)
    quantity = Column(Integer, nullable=False)
    price_at_order = Column(DECIMAL(10,2), nullable=False)

    order = relationship("Order", back_populates="items")

class Wishlist(Base):
    __tablename__ = "wishlists"
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    candle_id = Column(Integer, primary_key=True)

    user = relationship("User", back_populates="wishlist")

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    title = Column(String(150))
    message = Column(Text)
    is_read = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    candle_id = Column(Integer)
    rating = Column(Integer)
    comment = Column(Text)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    user = relationship("User", back_populates="reviews")

class PaymentMethod(Base):
    __tablename__ = "payment_methods"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    card_last4 = Column(String(4))
    card_brand = Column(String(50))
    expiry_month = Column(Integer)
    expiry_year = Column(Integer)
    added_at = Column(TIMESTAMP, default=datetime.utcnow)

    user = relationship("User", back_populates="payment_methods")

class UserToken(Base):
    __tablename__ = "user_tokens"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    token = Column(Text, nullable=False)
    type = Column(String(50))
    is_used = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    expires_at = Column(TIMESTAMP)

    user = relationship("User", back_populates="tokens") 
