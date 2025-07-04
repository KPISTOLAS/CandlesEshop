from fastapi import Header, HTTPException, status

API_KEY = "123123123"  # ← Same as in main.py, or load from env

def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key != API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API Key",
        )
