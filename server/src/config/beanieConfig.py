from beanie import init_beanie
from src.models.Admin import Admin
from src.models.Counter import Counter

async def setup_beanie(db):
    await init_beanie(database=db, document_models=[Admin, Counter])
