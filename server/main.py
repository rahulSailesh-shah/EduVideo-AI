# type: ignore
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Item(BaseModel):
    name: str
    description: str

@app.get("/")
async def root():
    return {"message": "Hello from FastAPI!"}

@app.get("/api/items")
async def get_items():
    return [
        {"id": 1, "name": "Item 1", "description": "First item"},
        {"id": 2, "name": "Item 2", "description": "Second item"}
    ]

@app.post("/api/items")
async def create_item(item: Item):
    return {"message": f"Created item: {item.name}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
