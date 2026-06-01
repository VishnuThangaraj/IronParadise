import uvicorn
from os import getenv
from fastapi import FastAPI
from dotenv import load_dotenv
from contextlib import asynccontextmanager

from src.config.corsConfig import setup_cors
from src.config.dbConfig import connect_db, close_db

from src.routers import authRoutes
from src.routers import dietPlanRoutes
from src.routers import workoutPlanRoutes

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    #startup
    await connect_db()
    yield
    #shutdown
    await close_db()

app = FastAPI(title="IronParadise API", lifespan=lifespan)

# Apply CORS middleware
setup_cors(app)

@app.get('/')
def root():
    return {
        'message': 'IronParadise Server Running...',
        'version': '0.0.1',
    }

# Routes
app.include_router(authRoutes.router)
app.include_router(dietPlanRoutes.router)
app.include_router(workoutPlanRoutes.router)

if __name__ == "__main__":
    port = int(getenv("PORT"))
    uvicorn.run("src.main:app", host="localhost", port=port, reload=True)
