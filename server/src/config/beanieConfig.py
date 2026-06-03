from beanie import init_beanie
from src.models.Admin import Admin
from src.models.Member import Member
from src.models.Counter import Counter
from src.models.Trainer import Trainer
from src.models.DietPlan import DietPlan
from src.models.WorkoutPlan import WorkoutPlan
from src.models.MembershipPlan import MembershipPlan
from src.models.MemberPlans import MemberPlans
from src.models.MemberMeasurement import MemberMeasurement

async def setup_beanie(db):
    await init_beanie(database=db, document_models=[Admin, Counter, DietPlan, WorkoutPlan, Trainer, Member, MembershipPlan, MemberPlans, MemberMeasurement])
