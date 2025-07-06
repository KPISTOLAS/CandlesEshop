#!/usr/bin/env python3
"""
Script to clean up database references that prevent candle deletion.
This will help identify and optionally remove references to candles in related tables.
"""

import sqlite3
import os
from pathlib import Path

def get_db_path():
    """Get the database file path"""
    # Look for the database file in common locations
    possible_paths = [
        "candles.db",
        "app/candles.db", 
        "database.db",
        "app/database.db"
    ]
    
    for path in possible_paths:
        if os.path.exists(path):
            return path
    
    # If not found, ask user
    print("Database file not found in common locations.")
    db_path = input("Please enter the path to your database file: ").strip()
    if os.path.exists(db_path):
        return db_path
    else:
        print(f"Error: File {db_path} does not exist.")
        return None

def check_candle_references(candle_id, db_path):
    """Check what references exist for a specific candle"""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print(f"\n=== Checking references for candle ID {candle_id} ===")
    
    # Check cart_items
    cursor.execute("SELECT COUNT(*) FROM cart_items WHERE candle_id = ?", (candle_id,))
    cart_count = cursor.fetchone()[0]
    if cart_count > 0:
        print(f"❌ Found {cart_count} cart item(s) referencing this candle")
        cursor.execute("SELECT id, user_id, quantity FROM cart_items WHERE candle_id = ?", (candle_id,))
        cart_items = cursor.fetchall()
        for item in cart_items:
            print(f"   - Cart item {item[0]} (User {item[1]}, Qty: {item[2]})")
    else:
        print("✅ No cart items reference this candle")
    
    # Check order_items
    cursor.execute("SELECT COUNT(*) FROM order_items WHERE candle_id = ?", (candle_id,))
    order_count = cursor.fetchone()[0]
    if order_count > 0:
        print(f"❌ Found {order_count} order item(s) referencing this candle")
        cursor.execute("SELECT id, order_id, quantity FROM order_items WHERE candle_id = ?", (candle_id,))
        order_items = cursor.fetchall()
        for item in order_items:
            print(f"   - Order item {item[0]} (Order {item[1]}, Qty: {item[2]})")
    else:
        print("✅ No order items reference this candle")
    
    # Check reviews
    cursor.execute("SELECT COUNT(*) FROM reviews WHERE candle_id = ?", (candle_id,))
    review_count = cursor.fetchone()[0]
    if review_count > 0:
        print(f"❌ Found {review_count} review(s) referencing this candle")
        cursor.execute("SELECT id, user_id, rating FROM reviews WHERE candle_id = ?", (candle_id,))
        reviews = cursor.fetchall()
        for review in reviews:
            print(f"   - Review {review[0]} (User {review[1]}, Rating: {review[2]})")
    else:
        print("✅ No reviews reference this candle")
    
    # Check wishlist
    cursor.execute("SELECT COUNT(*) FROM wishlists WHERE candle_id = ?", (candle_id,))
    wishlist_count = cursor.fetchone()[0]
    if wishlist_count > 0:
        print(f"❌ Found {wishlist_count} wishlist item(s) referencing this candle")
        cursor.execute("SELECT id, user_id FROM wishlists WHERE candle_id = ?", (candle_id,))
        wishlist_items = cursor.fetchall()
        for item in wishlist_items:
            print(f"   - Wishlist item {item[0]} (User {item[1]})")
    else:
        print("✅ No wishlist items reference this candle")
    
    # Check candle_images
    cursor.execute("SELECT COUNT(*) FROM candle_images WHERE candle_id = ?", (candle_id,))
    image_count = cursor.fetchone()[0]
    if image_count > 0:
        print(f"❌ Found {image_count} image(s) referencing this candle")
        cursor.execute("SELECT id, image_url FROM candle_images WHERE candle_id = ?", (candle_id,))
        images = cursor.fetchall()
        for image in images:
            print(f"   - Image {image[0]} ({image[1]})")
    else:
        print("✅ No images reference this candle")
    
    # Check candle_tags
    cursor.execute("SELECT COUNT(*) FROM candle_tags WHERE candle_id = ?", (candle_id,))
    tag_count = cursor.fetchone()[0]
    if tag_count > 0:
        print(f"❌ Found {tag_count} tag association(s) for this candle")
        cursor.execute("SELECT tag_id FROM candle_tags WHERE candle_id = ?", (candle_id,))
        tags = cursor.fetchall()
        for tag in tags:
            print(f"   - Tag ID {tag[0]}")
    else:
        print("✅ No tag associations for this candle")
    
    conn.close()
    
    total_references = cart_count + order_count + review_count + wishlist_count + image_count + tag_count
    return total_references > 0

def cleanup_candle_references(candle_id, db_path, cleanup_cart=True, cleanup_reviews=True, cleanup_wishlist=True):
    """Clean up references for a specific candle"""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print(f"\n=== Cleaning up references for candle ID {candle_id} ===")
    
    try:
        # Clean up cart items
        if cleanup_cart:
            cursor.execute("DELETE FROM cart_items WHERE candle_id = ?", (candle_id,))
            cart_deleted = cursor.rowcount
            print(f"🗑️  Deleted {cart_deleted} cart item(s)")
        
        # Clean up reviews
        if cleanup_reviews:
            cursor.execute("DELETE FROM reviews WHERE candle_id = ?", (candle_id,))
            reviews_deleted = cursor.rowcount
            print(f"🗑️  Deleted {reviews_deleted} review(s)")
        
        # Clean up wishlist items
        if cleanup_wishlist:
            cursor.execute("DELETE FROM wishlists WHERE candle_id = ?", (candle_id,))
            wishlist_deleted = cursor.rowcount
            print(f"🗑️  Deleted {wishlist_deleted} wishlist item(s)")
        
        # Clean up images (these are safe to delete)
        cursor.execute("DELETE FROM candle_images WHERE candle_id = ?", (candle_id,))
        images_deleted = cursor.rowcount
        print(f"🗑️  Deleted {images_deleted} image(s)")
        
        # Clean up tag associations (these are safe to delete)
        cursor.execute("DELETE FROM candle_tags WHERE candle_id = ?", (candle_id,))
        tags_deleted = cursor.rowcount
        print(f"🗑️  Deleted {tags_deleted} tag association(s)")
        
        # Note: We don't delete order_items as they represent actual sales history
        
        conn.commit()
        print("✅ Cleanup completed successfully")
        
    except Exception as e:
        conn.rollback()
        print(f"❌ Error during cleanup: {e}")
        return False
    finally:
        conn.close()
    
    return True

def list_candles(db_path):
    """List all candles in the database"""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, name, price, stock_quantity FROM candles ORDER BY id")
    candles = cursor.fetchall()
    
    print("\n=== Available Candles ===")
    print("ID  | Name                    | Price  | Stock")
    print("-" * 50)
    
    for candle in candles:
        print(f"{candle[0]:<3} | {candle[1]:<23} | ${candle[2]:<5} | {candle[3]}")
    
    conn.close()
    return [candle[0] for candle in candles]

def main():
    print("🕯️  Candle Reference Cleanup Tool")
    print("=" * 40)
    
    # Get database path
    db_path = get_db_path()
    if not db_path:
        return
    
    print(f"📁 Using database: {db_path}")
    
    # List available candles
    candle_ids = list_candles(db_path)
    
    if not candle_ids:
        print("❌ No candles found in database")
        return
    
    # Get candle ID from user
    while True:
        try:
            candle_id = int(input(f"\nEnter candle ID to check (1-{max(candle_ids)}): "))
            if candle_id in candle_ids:
                break
            else:
                print(f"❌ Invalid candle ID. Please choose from {min(candle_ids)}-{max(candle_ids)}")
        except ValueError:
            print("❌ Please enter a valid number")
    
    # Check references
    has_references = check_candle_references(candle_id, db_path)
    
    if not has_references:
        print("\n✅ No references found! The candle should be deletable.")
        return
    
    # Ask if user wants to clean up
    print(f"\n⚠️  References found for candle {candle_id}")
    cleanup = input("Do you want to clean up these references? (y/N): ").strip().lower()
    
    if cleanup == 'y':
        print("\nChoose what to clean up:")
        print("1. Cart items (safe to delete)")
        print("2. Reviews (safe to delete)")
        print("3. Wishlist items (safe to delete)")
        print("4. All of the above")
        print("5. Cancel")
        
        choice = input("Enter choice (1-5): ").strip()
        
        if choice == '1':
            cleanup_candle_references(candle_id, db_path, cleanup_cart=True, cleanup_reviews=False, cleanup_wishlist=False)
        elif choice == '2':
            cleanup_candle_references(candle_id, db_path, cleanup_cart=False, cleanup_reviews=True, cleanup_wishlist=False)
        elif choice == '3':
            cleanup_candle_references(candle_id, db_path, cleanup_cart=False, cleanup_reviews=False, cleanup_wishlist=True)
        elif choice == '4':
            cleanup_candle_references(candle_id, db_path, cleanup_cart=True, cleanup_reviews=True, cleanup_wishlist=True)
        else:
            print("❌ Cleanup cancelled")
            return
        
        print("\n✅ Cleanup completed! You should now be able to delete the candle.")
    else:
        print("❌ Cleanup cancelled")

if __name__ == "__main__":
    main() 