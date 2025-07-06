#!/usr/bin/env python3
"""
Script to insert sample products into the database
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.database import SessionLocal
from app.models.product import Candle, Category, Tag
from app.models.user import User

def insert_sample_data():
    """Insert sample categories and products"""
    
    db = SessionLocal()
    
    try:
        # Check if data already exists
        existing_candles = db.query(Candle).count()
        if existing_candles > 0:
            print(f"✅ Database already has {existing_candles} products")
            return True
        
        # Create categories
        categories = [
            Category(name="Scented", description="Candles with pleasant fragrances"),
            Category(name="Decorative", description="Candles mainly for decoration purposes"),
            Category(name="Handmade", description="Artisan handmade candles"),
            Category(name="Relaxation", description="Candles for relaxation and meditation"),
            Category(name="Seasonal", description="Seasonal and holiday candles")
        ]
        
        for category in categories:
            db.add(category)
        db.commit()
        
        print("✅ Categories created successfully")
        
        # Create products
        products = [
            Candle(
                name="Lavender Dreams Candle",
                description="Relaxing lavender scent for peaceful evenings",
                price=24.99,
                stock_quantity=15,
                weight_grams=200,
                burn_time_hours=40,
                color="Purple",
                scent="Lavender",
                material="Soy wax",
                category_id=1
            ),
            Candle(
                name="Vanilla Comfort Candle",
                description="Warm vanilla aroma for cozy moments",
                price=19.99,
                stock_quantity=25,
                weight_grams=180,
                burn_time_hours=35,
                color="Cream",
                scent="Vanilla",
                material="Soy wax",
                category_id=1
            ),
            Candle(
                name="Ocean Breeze Candle",
                description="Fresh ocean scent for a refreshing atmosphere",
                price=22.99,
                stock_quantity=10,
                weight_grams=220,
                burn_time_hours=45,
                color="Blue",
                scent="Ocean",
                material="Soy wax",
                category_id=1
            ),
            Candle(
                name="Cinnamon Spice Candle",
                description="Warm cinnamon and spice for cozy winter nights",
                price=26.99,
                stock_quantity=8,
                weight_grams=250,
                burn_time_hours=50,
                color="Brown",
                scent="Cinnamon",
                material="Soy wax",
                category_id=5
            ),
            Candle(
                name="Rose Garden Candle",
                description="Elegant rose fragrance for romantic evenings",
                price=29.99,
                stock_quantity=12,
                weight_grams=200,
                burn_time_hours=38,
                color="Pink",
                scent="Rose",
                material="Soy wax",
                category_id=1
            )
        ]
        
        for product in products:
            db.add(product)
        db.commit()
        
        print("✅ Products created successfully")
        
        # Show created data
        candles = db.query(Candle).all()
        print(f"\n📋 Created {len(candles)} products:")
        for candle in candles:
            print(f"  - {candle.name} (${candle.price}) - Stock: {candle.stock_quantity}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error inserting sample data: {e}")
        db.rollback()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    print("🕯️  Inserting Sample Products")
    print("=" * 40)
    
    success = insert_sample_data()
    
    if success:
        print("\n✅ Sample data inserted successfully!")
    else:
        print("\n❌ Failed to insert sample data!")
        sys.exit(1) 