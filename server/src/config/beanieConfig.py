from beanie import init_beanie
from src.models.Admin import Admin
from src.models.Counter import Counter
from src.models.DietPlan import DietPlan

async def setup_beanie(db):
    await init_beanie(database=db, document_models=[Admin, Counter, DietPlan])
