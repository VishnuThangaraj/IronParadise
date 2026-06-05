from fastapi import APIRouter, Request, status
from src.controllers.dashboardController import get_dashboard_metrics
from src.controllers.authController import get_loggedin_admin

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/metrics", status_code=status.HTTP_200_OK)
async def fetch_metrics(request: Request):
    await get_loggedin_admin(request)
    return await get_dashboard_metrics()
