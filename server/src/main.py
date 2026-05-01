from os import getenv
from dotenv import load_dotenv
from fastapi import FastAPI
import uvicorn

load_dotenv()

app = FastAPI(title='Iron Paradise API')

@app.get('/')
def root():
    return {
        'message': 'Welcome to Iron Paradise API',
        'version': '0.0.1',
    }

if __name__ == "__main__":
    try:
        port = int(getenv("PORT", "6969"))
    except ValueError:
        port = 6969
    reload_enabled = getenv("UVICORN_RELOAD", "false").lower() == "true"
    uvicorn.run("src.main:app", host="0.0.0.0", port=port, reload=reload_enabled)
