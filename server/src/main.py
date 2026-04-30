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
    port = int(getenv("PORT", 8000))
    uvicorn.run("src.main:app", host="0.0.0.0", port=port, reload=True)
