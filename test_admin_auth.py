#!/usr/bin/env python3
"""
Test script to verify admin authentication
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.database import SessionLocal
from app.models.user import User
from app.routes.auth_routes import verify_password, create_access_token, verify_token
from fastapi.security import HTTPAuthorizationCredentials
from fastapi import Depends
import jwt
from datetime import timedelta
from sqlalchemy.exc import IntegrityError

def test_admin_user():
    """Test if admin user exists and can be authenticated"""
    
    db = SessionLocal()
    
    try:
        # Check if admin user exists
        admin_user = db.query(User).filter(User.email == "admin@example.com").first()
        
        if not admin_user:
            print("❌ Admin user not found!")
            print("Creating admin user...")
            
            # Create admin user
            from app.routes.auth_routes import get_password_hash
            admin_password_hash = get_password_hash("admin123")
            
            admin_user = User(
                email="admin@example.com",
                password_hash=admin_password_hash,
                full_name="Admin User",
                is_admin=True
            )
            
            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)
            print("✅ Admin user created successfully")
        else:
            print(f"✅ Admin user found: {admin_user.email} (Admin: {admin_user.is_admin})")
        
        # Test password verification
        if verify_password("admin123", str(admin_user.password_hash)):
            print("✅ Password verification works")
        else:
            print("❌ Password verification failed")
            return False
        
        # Test token creation
        access_token = create_access_token(
            data={"sub": str(admin_user.id)}, 
            expires_delta=timedelta(minutes=30)
        )
        print(f"✅ Token created: {access_token[:50]}...")
        
        # Test token verification
        try:
            from app.routes.auth_routes import SECRET_KEY, ALGORITHM
            payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = payload.get("sub")
            print(f"✅ Token decoded successfully, user_id: {user_id}")
            
            # Verify user exists
            user = db.query(User).filter(User.id == int(user_id)).first()
            if user and getattr(user, 'is_admin', False):
                print("✅ Admin user verified from token")
                return True
            else:
                print("❌ User not found or not admin")
                return False
                
        except jwt.PyJWTError as e:
            print(f"❌ Token verification failed: {e}")
            return False
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    finally:
        db.close()

if __name__ == "__main__":
    print("🔐 Testing Admin Authentication")
    print("=" * 40)
    
    success = test_admin_user()
    
    if success:
        print("\n✅ Admin authentication test passed!")
        print("\n📝 Admin credentials:")
        print("  Email: admin@example.com")
        print("  Password: admin123")
        print("  API Key: admin-secret-key-2024")
    else:
        print("\n❌ Admin authentication test failed!")
        sys.exit(1) 