#!/usr/bin/env python3
"""
Regenerate demo users with fresh password hashes
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.database import SessionLocal
from app.models.user import User
import bcrypt

def regenerate_users():
    """Regenerate demo users with fresh password hashes"""
    
    db = SessionLocal()
    
    try:
        # Delete existing demo users
        db.query(User).filter(User.email.in_([
            "demo@example.com", 
            "john@example.com", 
            "sarah@example.com", 
            "admin@example.com"
        ])).delete(synchronize_session=False)
        
        db.commit()
        print("✅ Deleted existing demo users")
        
        # Generate fresh password hashes
        demo_password_hash = bcrypt.hashpw("demo123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        password_hash = bcrypt.hashpw("password123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        admin_password_hash = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        print(f"🔑 Generated fresh hashes:")
        print(f"   demo123 -> {demo_password_hash}")
        print(f"   password123 -> {password_hash}")
        print(f"   admin123 -> {admin_password_hash}")
        
        # Create new demo users
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
        print("✅ Created new demo users")
        
        # Verify the passwords work
        print("\n🔍 Verifying passwords:")
        for user in demo_users:
            is_valid = bcrypt.checkpw("demo123".encode('utf-8'), user.password_hash.encode('utf-8')) if user.email == "demo@example.com" else \
                      bcrypt.checkpw("password123".encode('utf-8'), user.password_hash.encode('utf-8')) if user.email in ["john@example.com", "sarah@example.com"] else \
                      bcrypt.checkpw("admin123".encode('utf-8'), user.password_hash.encode('utf-8'))
            
            print(f"   {user.email}: {is_valid}")
        
        db.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.close()
        return False

if __name__ == "__main__":
    print("🔄 Regenerate Demo Users")
    print("=" * 30)
    
    success = regenerate_users()
    
    if success:
        print("\n✅ Demo users regenerated successfully!")
        print("\n📝 Demo credentials:")
        print("  Regular User: demo@example.com / demo123")
        print("  Admin User: admin@example.com / admin123")
        print("  Admin API Key: admin-secret-key-2024")
    else:
        print("\n❌ Failed to regenerate demo users!")
        sys.exit(1) 