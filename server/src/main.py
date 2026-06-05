import uvicorn
from os import getenv
from fastapi import FastAPI
from dotenv import load_dotenv
from contextlib import asynccontextmanager

from src.config.corsConfig import setup_cors
from src.config.dbConfig import connect_db, close_db

from src.routers import authRoutes
from src.routers import trainerRoutes
from src.routers import dietPlanRoutes
from src.routers import workoutPlanRoutes
from src.routers import membershipPlanRoutes
from src.routers import memberRoutes
from src.routers import emailRoutes
from src.routers import memberPlanRoutes
from src.routers import memberMeasurementRoutes
from src.routers import memberPaymentRoutes
from src.routers import eventRoutes
from src.routers import attendanceRoutes
from src.routers import kioskRoutes
from src.routers import enquiryRoutes
from src.routers import dashboardRoutes


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
app.include_router(emailRoutes.router)
app.include_router(trainerRoutes.router)
app.include_router(dietPlanRoutes.router)
app.include_router(workoutPlanRoutes.router)
app.include_router(membershipPlanRoutes.router)
app.include_router(memberRoutes.router)
app.include_router(memberPlanRoutes.router)
app.include_router(memberMeasurementRoutes.router)
app.include_router(memberPaymentRoutes.router)
app.include_router(eventRoutes.router)
app.include_router(attendanceRoutes.router)
app.include_router(kioskRoutes.router)
app.include_router(enquiryRoutes.router)
app.include_router(dashboardRoutes.router)


if __name__ == "__main__":
    port = int(getenv("PORT"))
    uvicorn.run("src.main:app", host="localhost", port=port, reload=True)
