#!/usr/bin/env python3
"""
Database migration script to add new columns to the candles table.
This script adds is_active, featured, and discount_percentage columns.
"""

import sqlite3
import os

def get_db_path():
    """Get the database file path"""
    possible_paths = [
        "candles.db",
        "app/candles.db", 
        "database.db",
        "app/database.db"
    ]
    
    for path in possible_paths:
        if os.path.exists(path):
            return path
    
    print("Database file not found in common locations.")
    db_path = input("Please enter the path to your database file: ").strip()
    if os.path.exists(db_path):
        return db_path
    else:
        print(f"Error: File {db_path} does not exist.")
        return None

def check_column_exists(cursor, table_name, column_name):
    """Check if a column exists in a table"""
    cursor.execute(f"PRAGMA table_info({table_name})")
    columns = cursor.fetchall()
    return any(col[1] == column_name for col in columns)

def migrate_database(db_path):
    """Migrate the database to add new columns"""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print("🔄 Starting database migration...")
    
    try:
        # Check if candles table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='candles'")
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
        
        # Commit changes
        conn.commit()
        print("✅ Migration completed successfully!")
        
        # Show table structure
        print("\n📋 Current candles table structure:")
        cursor.execute("PRAGMA table_info(candles)")
        columns = cursor.fetchall()
        for col in columns:
            print(f"  - {col[1]} ({col[2]}) - Default: {col[4]}")
        
        return True
        
    except Exception as e:
        conn.rollback()
        print(f"❌ Migration failed: {e}")
        return False
    finally:
        conn.close()

def main():
    print("🕯️  Database Migration Tool")
    print("=" * 30)
    
    # Get database path
    db_path = get_db_path()
    if not db_path:
        return
    
    print(f"📁 Using database: {db_path}")
    
    # Confirm migration
    confirm = input("\nDo you want to proceed with the migration? (y/N): ").strip().lower()
    if confirm != 'y':
        print("❌ Migration cancelled")
        return
    
    # Run migration
    success = migrate_database(db_path)
    
    if success:
        print("\n🎉 Migration completed! Your database is now ready for the new features.")
        print("You can now create and edit products with the new fields (is_active, featured, discount_percentage).")
    else:
        print("\n❌ Migration failed. Please check the error messages above.")

if __name__ == "__main__":
    main() 