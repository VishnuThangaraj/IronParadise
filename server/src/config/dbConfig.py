import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

client: AsyncIOMotorClient | None = None
db = None


async def connect_db():
    global client, db
    try:
        client = AsyncIOMotorClient(
            MONGO_URI
        )
        db = client[DB_NAME]

        # check connection
        await client.admin.command("ping")

        # Initialize Beanie
        from src.config.beanieConfig import setup_beanie
        await setup_beanie(db)

        print(">>> MongoDB connected successfully")
    except Exception as e:
        print(">>> MongoDB connection error:", e)
        raise e


async def close_db():
    global client
    if client:
        client.close()
        print(">>> MongoDB connection closed")
