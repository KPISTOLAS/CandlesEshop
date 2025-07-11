from sqlalchemy import Column, Integer, String, Text, DECIMAL, ForeignKey, Table, TIMESTAMP
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

# Association table for many-to-many
candle_tags = Table(
    "candle_tags",
    Base.metadata,
    Column("candle_id", Integer, ForeignKey("candles.id", ondelete="CASCADE"), primary_key=True),
    Column("tag_id", Integer, ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True)
)

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text)

    candles = relationship("Candle", back_populates="category")

class Candle(Base):
    __tablename__ = "candles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    description = Column(Text)
    price = Column(DECIMAL(10, 2), nullable=False)
    stock_quantity = Column(Integer, nullable=False)
    weight_grams = Column(Integer)
    burn_time_hours = Column(Integer)
    color = Column(String(50))
    scent = Column(String(100))
    material = Column(String(100))
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"))
    is_active = Column(Integer, default=1)  # 1 for active, 0 for inactive
    featured = Column(Integer, default=0)   # 1 for featured, 0 for not featured
    discount_percentage = Column(DECIMAL(5, 2), default=0.00)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow)

    category = relationship("Category", back_populates="candles")
    images = relationship("CandleImage", back_populates="candle", cascade="all, delete")
    tags = relationship("Tag", secondary=candle_tags, back_populates="candles")

class CandleImage(Base):
    __tablename__ = "candle_images"
    id = Column(Integer, primary_key=True)
    candle_id = Column(Integer, ForeignKey("candles.id", ondelete="CASCADE"))
    image_url = Column(Text, nullable=False)
    alt_text = Column(String(150))

    candle = relationship("Candle", back_populates="images")

class Tag(Base):
    __tablename__ = "tags"
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)

    candles = relationship("Candle", secondary=candle_tags, back_populates="tags")
