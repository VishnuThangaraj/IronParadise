from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from os import getenv
from dotenv import load_dotenv

load_dotenv()

ADMIN_ORIGIN = getenv("ADMIN_ORIGIN")

def setup_cors(app: FastAPI):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            ADMIN_ORIGIN,
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    print(f">>> CORS configured for: {ADMIN_ORIGIN}")
    