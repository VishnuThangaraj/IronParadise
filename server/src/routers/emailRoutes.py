from fastapi import APIRouter, BackgroundTasks

from src.schemas.emailSchema import EmailRequest, TrainerWelcomeRequest, BulkEmailRequest
from src.services.emailService import EmailService
from src.template.trainer.trainerWelcome import TrainerTemplate

router = APIRouter(
    prefix="/email",
    tags=["Email"]
)


@router.post("/send")
async def send_email(request: EmailRequest, background_tasks: BackgroundTasks):

    background_tasks.add_task(
        EmailService.send_email,
        request.to,
        request.subject,
        request.body
    )
    
    return {
        "success": True, 
        "message": "Email is being sent in the background"
    }

@router.post("/send/trainer-welcome")
async def send_trainer_welcome(request: TrainerWelcomeRequest, background_tasks: BackgroundTasks):
    
    # Generate the beautiful HTML using the Python template
    email_data = TrainerTemplate.welcome(
        trainer_name=request.name,
        email=request.email,
        specialization=request.specialization,
        shift_time=request.shift_time,
        mobile=request.mobile
    )

    # Dispatch to background task
    background_tasks.add_task(
        EmailService.send_email,
        request.email,
        email_data["subject"],
        email_data["body"]
    )
    
    return {
        "success": True, 
        "message": f"Trainer welcome email sent to {request.email} in the background"
    }

@router.post("/send/bulk")
async def send_bulk(request: BulkEmailRequest, background_tasks: BackgroundTasks):
    from src.template.baseTemplate import BaseTemplate
    # Wrap the user body in the beautiful base template
    html_body = BaseTemplate.get_base_html(request.subject, request.body)
    
    background_tasks.add_task(
        EmailService.send_bulk_email,
        request.recipients,
        request.subject,
        html_body
    )
    
    return {
        "success": True,
        "message": f"Bulk email queued for {len(request.recipients)} recipients"
    }