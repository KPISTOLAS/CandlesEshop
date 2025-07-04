from fastapi import FastAPI
from app.routes import user_routes, admin_routes, candle_routes  # Make sure candle_routes is imported

app = FastAPI()

# Include v1 routes
app.include_router(candle_routes.router, prefix="/candles", tags=["v1"])
app.include_router(user_routes.router, prefix="/user/candles", tags=["user-v2"])
app.include_router(admin_routes.router, prefix="/admin/candles", tags=["admin-v2"])
@app.get("/")
async def root():
    return {"message": "Candle API up and running"}
# uvicorn app.main:app --reload