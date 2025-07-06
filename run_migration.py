import psycopg2

try:
    # Connect to database
    conn = psycopg2.connect(
        host="localhost",
        port="5432",
        database="ecom",
        user="postgres",
        password="Admin"
    )
    
    cursor = conn.cursor()
    
    print("Adding missing columns...")
    
    # Add columns with error handling
    try:
        cursor.execute("ALTER TABLE candles ADD COLUMN is_active INTEGER DEFAULT 1")
        print("Added is_active column")
    except:
        print("is_active column already exists")
    
    try:
        cursor.execute("ALTER TABLE candles ADD COLUMN featured INTEGER DEFAULT 0")
        print("Added featured column")
    except:
        print("featured column already exists")
    
    try:
        cursor.execute("ALTER TABLE candles ADD COLUMN discount_percentage DECIMAL(5,2) DEFAULT 0.00")
        print("Added discount_percentage column")
    except:
        print("discount_percentage column already exists")
    
    # Update existing records
    cursor.execute("UPDATE candles SET is_active = 1 WHERE is_active IS NULL")
    cursor.execute("UPDATE candles SET featured = 0 WHERE featured IS NULL")
    cursor.execute("UPDATE candles SET discount_percentage = 0.00 WHERE discount_percentage IS NULL")
    
    conn.commit()
    print("Migration completed successfully!")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"Error: {e}") 