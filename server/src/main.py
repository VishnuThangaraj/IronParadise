import uvicorn
from os import getenv
from dotenv import load_dotenv
from fastapi import FastAPI
from contextlib import asynccontextmanager
from src.config.corsConfig import setup_cors
from src.config.dbConfig import connect_db, close_db

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    #startup
    await connect_db()
    yield
    #shutdown
    await close_db()

app = FastAPI(title="Iron Paradise API", lifespan=lifespan)

# Apply CORS middleware
setup_cors(app)

@app.get('/')
def root():
    return {
        'message': 'IronParadise Server Running...',
        'version': '0.0.1',
    }

if __name__ == "__main__":
    try:
        port = int(getenv("PORT", "6969"))
    except ValueError:
        port = 6969
    reload_enabled = getenv("UVICORN_RELOAD", "false").lower() == "true"
    uvicorn.run("src.main:app", host="0.0.0.0", port=port, reload=reload_enabled)
