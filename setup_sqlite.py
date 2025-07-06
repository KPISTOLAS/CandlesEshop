#!/usr/bin/env python3
"""
SQLite Database setup script for the Candle Shop API
This script creates the necessary tables and inserts demo users
"""

import os
import sys
import sqlite3
import bcrypt
from sqlalchemy import text

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.database import DATABASE_URL, engine, SessionLocal
from app.models.user import User
from app.models.product import Base as ProductBase

def setup_database():
    """Set up the database tables and demo data"""
    
    print("Setting up SQLite database...")
    
    # Create all tables
    try:
        ProductBase.metadata.create_all(bind=engine)
        print("✅ Product tables created successfully")
    except Exception as e:
        print(f"❌ Error creating product tables: {e}")
        return False
    
    # Create users table if it doesn't exist
    try:
        with engine.connect() as conn:
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    full_name VARCHAR(255),
                    phone VARCHAR(50),
                    profile_picture VARCHAR(500),
                    is_admin BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """))
            conn.commit()
        print("✅ Users table created successfully")
    except Exception as e:
        print(f"❌ Error creating users table: {e}")
        return False
    
    # Insert demo users
    try:
        db = SessionLocal()
        
        # Check if demo users already exist
        existing_user = db.query(User).filter(User.email == "demo@example.com").first()
        if existing_user:
            print("✅ Demo users already exist")
            db.close()
            return True
        
        # Hash passwords
        demo_password_hash = bcrypt.hashpw("demo123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        password_hash = bcrypt.hashpw("password123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        admin_password_hash = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Create demo users
        demo_users = [
            User(
                email="demo@example.com",
                password_hash=demo_password_hash,
                full_name="Demo User",
                is_admin=False
            ),
            User(
                email="john@example.com",
                password_hash=password_hash,
                full_name="John Doe",
                is_admin=False
            ),
            User(
                email="sarah@example.com",
                password_hash=password_hash,
                full_name="Sarah Smith",
                is_admin=False
            ),
            User(
                email="admin@example.com",
                password_hash=admin_password_hash,
                full_name="Admin User",
                is_admin=True
            )
        ]
        
        for user in demo_users:
            db.add(user)
        
        db.commit()
        print("✅ Demo users created successfully")
        
        # Show created users
        users = db.query(User).all()
        print("\n📋 Created users:")
        for user in users:
            print(f"  - {user.email} ({user.full_name}) - Admin: {user.is_admin}")
        
        db.close()
        return True
        
    except Exception as e:
        print(f"❌ Error creating demo users: {e}")
        if 'db' in locals():
            db.close()
        return False

if __name__ == "__main__":
    print("🕯️  Candle Shop SQLite Database Setup")
    print("=" * 40)
    
    success = setup_database()
    
    if success:
        print("\n✅ Database setup completed successfully!")
        print("\n📝 Demo credentials:")
        print("  Regular User: demo@example.com / demo123")
        print("  Admin User: admin@example.com / admin123")
        print("  Admin API Key: admin-secret-key-2024")
    else:
        print("\n❌ Database setup failed!")
        sys.exit(1) 