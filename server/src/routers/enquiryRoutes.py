from fastapi import APIRouter, Request, status, BackgroundTasks
from src.schemas.enquirySchemas import EnquiryCreate, EnquiryUpdate, EnquiryReply
from src.controllers.enquiryController import submit_enquiry, fetch_all_enquiries, resolve_enquiry, reply_enquiry
from src.controllers.authController import get_loggedin_admin

router = APIRouter(prefix="/enquiry", tags=["Enquiry"])

@router.post("/submit", status_code=status.HTTP_201_CREATED)
async def create_enquiry(request: Request, data: EnquiryCreate):
    return await submit_enquiry(data)

@router.get("/all", status_code=status.HTTP_200_OK)
async def get_enquiries(request: Request):
    await get_loggedin_admin(request)
    return await fetch_all_enquiries()

@router.put("/resolve/{id}", status_code=status.HTTP_200_OK)
async def update_enquiry_status(request: Request, id: str, data: EnquiryUpdate):
    await get_loggedin_admin(request)
    return await resolve_enquiry(id, data)

@router.post("/reply/{id}", status_code=status.HTTP_200_OK)
async def admin_reply_enquiry(request: Request, id: str, data: EnquiryReply, background_tasks: BackgroundTasks):
    await get_loggedin_admin(request)
    return await reply_enquiry(id, data, background_tasks)
