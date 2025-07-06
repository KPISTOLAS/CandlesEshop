#!/usr/bin/env python3
"""
Quick PostgreSQL migration script to add missing columns
"""

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def migrate_database():
    """Migrate the database to add new columns"""
    try:
        conn = psycopg2.connect(
            host="localhost",
            port="5432",
            database="ecom",
            user="postgres",
            password="Admin"
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        print("🔄 Starting PostgreSQL database migration...")
        
        # Add is_active column if it doesn't exist
        try:
            cursor.execute("ALTER TABLE candles ADD COLUMN is_active INTEGER DEFAULT 1")
            print("✅ is_active column added")
        except psycopg2.errors.DuplicateColumn:
            print("✅ is_active column already exists")
        
        # Add featured column if it doesn't exist
        try:
            cursor.execute("ALTER TABLE candles ADD COLUMN featured INTEGER DEFAULT 0")
            print("✅ featured column added")
        except psycopg2.errors.DuplicateColumn:
            print("✅ featured column already exists")
        
        # Add discount_percentage column if it doesn't exist
        try:
            cursor.execute("ALTER TABLE candles ADD COLUMN discount_percentage DECIMAL(5,2) DEFAULT 0.00")
            print("✅ discount_percentage column added")
        except psycopg2.errors.DuplicateColumn:
            print("✅ discount_percentage column already exists")
        
        # Update existing records
        cursor.execute("UPDATE candles SET is_active = 1 WHERE is_active IS NULL")
        cursor.execute("UPDATE candles SET featured = 0 WHERE featured IS NULL")
        cursor.execute("UPDATE candles SET discount_percentage = 0.00 WHERE discount_percentage IS NULL")
        
        print("✅ Migration completed successfully!")
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False

if __name__ == "__main__":
    print("🕯️  Quick PostgreSQL Migration")
    print("=" * 30)
    
    success = migrate_database()
    
    if success:
        print("\n🎉 Migration completed! Your database is now ready.")
    else:
        print("\n❌ Migration failed!") 