#!/usr/bin/env python3
"""
Test script to verify admin API endpoints
"""

import requests
import json

def test_admin_api():
    """Test admin API endpoints"""
    
    base_url = "http://localhost:8000"
    
    # Test 1: Check if server is running
    try:
        response = requests.get(f"{base_url}/")
        print(f"✅ Server is running: {response.json()}")
    except Exception as e:
        print(f"❌ Server not responding: {e}")
        return False
    
    # Test 2: Try to get products without auth (should fail)
    try:
        response = requests.get(f"{base_url}/admin/candles/v2/")
        print(f"❌ Products endpoint without auth: {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing products endpoint: {e}")
    
    # Test 3: Try to get dashboard stats without auth (should fail)
    try:
        response = requests.get(f"{base_url}/admin/candles/v2/dashboard/stats")
        print(f"❌ Dashboard stats without auth: {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing dashboard endpoint: {e}")
    
    # Test 4: Test with invalid token
    try:
        headers = {"Authorization": "Bearer invalid-token"}
        response = requests.get(f"{base_url}/admin/candles/v2/", headers=headers)
        print(f"❌ Products with invalid token: {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing with invalid token: {e}")
    
    print("\n📝 To test with valid admin token:")
    print("1. Login as admin in the frontend")
    print("2. Copy the token from localStorage")
    print("3. Use it in the Authorization header")
    
    return True

if __name__ == "__main__":
    print("🔍 Testing Admin API Endpoints")
    print("=" * 40)
    
    test_admin_api() 