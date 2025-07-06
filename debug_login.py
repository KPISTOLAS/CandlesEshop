#!/usr/bin/env python3
"""
Debug script to check login issues
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.database import SessionLocal
from app.models.user import User
import bcrypt

def debug_login():
    """Debug the login process"""
    
    db = SessionLocal()
    
    try:
        # Find the demo user
        user = db.query(User).filter(User.email == "demo@example.com").first()
        
        if not user:
            print("❌ User demo@example.com not found in database")
            return
        
        print(f"✅ Found user: {user.email}")
        print(f"   ID: {user.id}")
        print(f"   Full Name: {user.full_name}")
        print(f"   Is Admin: {user.is_admin}")
        print(f"   Password Hash: {user.password_hash}")
        
        # Test password verification
        test_password = "demo123"
        print(f"\n🔍 Testing password: {test_password}")
        
        # Method 1: Using bcrypt directly
        try:
            is_valid = bcrypt.checkpw(test_password.encode('utf-8'), user.password_hash.encode('utf-8'))
            print(f"   Direct bcrypt check: {is_valid}")
        except Exception as e:
            print(f"   Direct bcrypt error: {e}")
        
        # Method 2: Generate new hash and compare
        new_hash = bcrypt.hashpw(test_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        print(f"   New hash for 'demo123': {new_hash}")
        
        # Method 3: Check if stored hash matches expected format
        if user.password_hash.startswith('$2b$'):
            print("   ✅ Stored hash has correct bcrypt format")
        else:
            print("   ❌ Stored hash doesn't have bcrypt format")
        
        # Test with the exact hash from our setup
        expected_hash = "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iQeO"
        print(f"\n🔍 Comparing with expected hash: {expected_hash}")
        print(f"   Stored hash matches expected: {user.password_hash == expected_hash}")
        
        # Test verification with expected hash
        try:
            is_valid_expected = bcrypt.checkpw(test_password.encode('utf-8'), expected_hash.encode('utf-8'))
            print(f"   Expected hash verification: {is_valid_expected}")
        except Exception as e:
            print(f"   Expected hash error: {e}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("🔍 Debug Login Issues")
    print("=" * 30)
    debug_login() 