from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import user_routes, admin_routes, candle_routes, auth_routes  # Make sure candle_routes is imported

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include v1 routes
app.include_router(candle_routes.router, prefix="/candles", tags=["v1"])
app.include_router(user_routes.router, prefix="/user/candles", tags=["user-v2"])
app.include_router(admin_routes.router, prefix="/admin/candles", tags=["admin-v2"])
app.include_router(auth_routes.router, prefix="/auth", tags=["authentication"])

@app.get("/")
async def root():
    return {"message": "Candle API up and running"}
# py -m uvicorn app.main:app --reload
''' cd frontend
npm install --legacy-peer-deps
npm run dev
'''
