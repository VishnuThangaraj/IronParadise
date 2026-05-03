import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client: AsyncIOMotorClient | None = None
db = None


async def connect_db():
    global client, db
    try:
        client = AsyncIOMotorClient(
            MONGO_URI
        )
        db = client.IronParadise

        # check connection
        await client.admin.command("ping")

        print("MongoDB connected successfully")
    except Exception as e:
        print("MongoDB connection error:", e)
        raise e


async def close_db():
    global client
    if client:
        client.close()
        print("MongoDB connection closed")
