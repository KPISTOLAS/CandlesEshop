#!/usr/bin/env python3
"""
PostgreSQL Database migration script to add new columns to the candles table.
This script adds is_active, featured, and discount_percentage columns.
"""

import psycopg2
import os
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def get_db_connection():
    """Get database connection"""
    try:
        conn = psycopg2.connect(
            host="localhost",
            port="5432",
            database="ecom",
            user="postgres",
            password="Admin"
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        return conn
    except Exception as e:
        print(f"❌ Error connecting to database: {e}")
        return None

def check_column_exists(cursor, table_name, column_name):
    """Check if a column exists in a table"""
    cursor.execute("""
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = %s AND column_name = %s
    """, (table_name, column_name))
    return cursor.fetchone() is not None

def migrate_database():
    """Migrate the database to add new columns"""
    conn = get_db_connection()
    if not conn:
        return False
    
    cursor = conn.cursor()
    
    print("🔄 Starting PostgreSQL database migration...")
    
    try:
        # Check if candles table exists
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name = 'candles'
        """)
        if not cursor.fetchone():
            print("❌ Candles table not found. Please run setup_database.py first.")
            return False
        
        # Add is_active column if it doesn't exist
        if not check_column_exists(cursor, 'candles', 'is_active'):
            print("➕ Adding is_active column...")
            cursor.execute("ALTER TABLE candles ADD COLUMN is_active INTEGER DEFAULT 1")
            print("✅ is_active column added")
        else:
            print("✅ is_active column already exists")
        
        # Add featured column if it doesn't exist
        if not check_column_exists(cursor, 'candles', 'featured'):
            print("➕ Adding featured column...")
            cursor.execute("ALTER TABLE candles ADD COLUMN featured INTEGER DEFAULT 0")
            print("✅ featured column added")
        else:
            print("✅ featured column already exists")
        
        # Add discount_percentage column if it doesn't exist
        if not check_column_exists(cursor, 'candles', 'discount_percentage'):
            print("➕ Adding discount_percentage column...")
            cursor.execute("ALTER TABLE candles ADD COLUMN discount_percentage DECIMAL(5,2) DEFAULT 0.00")
            print("✅ discount_percentage column added")
        else:
            print("✅ discount_percentage column already exists")
        
        # Update existing records to have default values
        print("🔄 Updating existing records...")
        cursor.execute("UPDATE candles SET is_active = 1 WHERE is_active IS NULL")
        cursor.execute("UPDATE candles SET featured = 0 WHERE featured IS NULL")
        cursor.execute("UPDATE candles SET discount_percentage = 0.00 WHERE discount_percentage IS NULL")
        
        print("✅ Migration completed successfully!")
        
        # Show table structure
        print("\n📋 Current candles table structure:")
        cursor.execute("""
            SELECT column_name, data_type, column_default, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'candles'
            ORDER BY ordinal_position
        """)
        columns = cursor.fetchall()
        for col in columns:
            print(f"  - {col[0]} ({col[1]}) - Default: {col[2]} - Nullable: {col[3]}")
        
        return True
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False
    finally:
        cursor.close()
        conn.close()

def main():
    print("🕯️  PostgreSQL Database Migration Tool")
    print("=" * 40)
    
    # Confirm migration
    confirm = input("\nDo you want to proceed with the migration? (y/N): ").strip().lower()
    if confirm != 'y':
        print("❌ Migration cancelled")
        return
    
    # Run migration
    success = migrate_database()
    
    if success:
        print("\n🎉 Migration completed! Your database is now ready for the new features.")
        print("You can now create and edit products with the new fields (is_active, featured, discount_percentage).")
    else:
        print("\n❌ Migration failed. Please check the error messages above.")

if __name__ == "__main__":
    main() 