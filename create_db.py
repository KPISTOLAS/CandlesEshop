import sqlite3
import os

def create_database():
    """Create the database with all necessary tables and columns"""
    
    # Database file path
    db_path = "candles.db"
    
    print(f"Creating database: {db_path}")
    
    # Connect to database (creates it if it doesn't exist)
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Create categories table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(100) UNIQUE NOT NULL,
                description TEXT
            )
        """)
        
        # Create candles table with all columns
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS candles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(150) NOT NULL,
                description TEXT,
                price DECIMAL(10,2) NOT NULL,
                stock_quantity INTEGER NOT NULL,
                weight_grams INTEGER,
                burn_time_hours INTEGER,
                color VARCHAR(50),
                scent VARCHAR(100),
                material VARCHAR(100),
                category_id INTEGER,
                is_active INTEGER DEFAULT 1,
                featured INTEGER DEFAULT 0,
                discount_percentage DECIMAL(5,2) DEFAULT 0.00,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL
            )
        """)
        
        # Create other necessary tables
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS candle_images (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                candle_id INTEGER NOT NULL,
                image_url TEXT NOT NULL,
                alt_text VARCHAR(150),
                FOREIGN KEY (candle_id) REFERENCES candles (id) ON DELETE CASCADE
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS tags (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(50) UNIQUE NOT NULL
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS candle_tags (
                candle_id INTEGER NOT NULL,
                tag_id INTEGER NOT NULL,
                PRIMARY KEY (candle_id, tag_id),
                FOREIGN KEY (candle_id) REFERENCES candles (id) ON DELETE CASCADE,
                FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
            )
        """)
        
        cursor.execute("""
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
        """)
        
        # Insert some sample categories
        cursor.execute("""
            INSERT OR IGNORE INTO categories (name, description) VALUES 
            ('Relaxation', 'Candles for relaxation and stress relief'),
            ('Comfort', 'Warm and comforting scents'),
            ('Fresh', 'Fresh and invigorating fragrances'),
            ('Seasonal', 'Seasonal and holiday themed candles')
        """)
        
        # Insert sample candles
        cursor.execute("""
            INSERT OR IGNORE INTO candles (name, description, price, stock_quantity, weight_grams, burn_time_hours, color, scent, material, category_id, is_active, featured, discount_percentage) VALUES 
            ('Lavender Dreams', 'Relaxing lavender scent for peaceful evenings', 24.99, 15, 200, 40, 'Purple', 'Lavender', 'Soy wax', 1, 1, 1, 0.00),
            ('Vanilla Comfort', 'Warm vanilla aroma for cozy moments', 19.99, 25, 180, 35, 'Cream', 'Vanilla', 'Soy wax', 2, 1, 0, 10.00),
            ('Ocean Breeze', 'Fresh ocean scent for a refreshing atmosphere', 22.99, 10, 220, 45, 'Blue', 'Ocean', 'Soy wax', 3, 1, 1, 0.00),
            ('Cinnamon Spice', 'Warm cinnamon and spice for cozy winter nights', 26.99, 8, 250, 50, 'Brown', 'Cinnamon', 'Soy wax', 4, 1, 0, 15.00)
        """)
        
        # Insert admin user
        import bcrypt
        admin_password_hash = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        cursor.execute("""
            INSERT OR IGNORE INTO users (email, password_hash, full_name, is_admin) VALUES 
            ('admin@example.com', ?, 'Admin User', TRUE)
        """, (admin_password_hash,))
        
        conn.commit()
        print("✅ Database created successfully!")
        print("✅ Sample data inserted!")
        
        # Show what was created
        cursor.execute("SELECT COUNT(*) FROM categories")
        cat_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM candles")
        candle_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM users")
        user_count = cursor.fetchone()[0]
        
        print(f"\n📊 Database Summary:")
        print(f"  - Categories: {cat_count}")
        print(f"  - Candles: {candle_count}")
        print(f"  - Users: {user_count}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error creating database: {e}")
        conn.rollback()
        return False
    finally:
        conn.close()

if __name__ == "__main__":
    print("🕯️  Creating Candle Shop Database")
    print("=" * 40)
    
    success = create_database()
    
    if success:
        print("\n✅ Database setup completed!")
        print("\n📝 Admin credentials:")
        print("  Email: admin@example.com")
        print("  Password: admin123")
    else:
        print("\n❌ Database setup failed!") 