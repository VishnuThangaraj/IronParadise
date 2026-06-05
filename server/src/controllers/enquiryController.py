from datetime import datetime
from fastapi import HTTPException, status, BackgroundTasks
from src.models.Enquiry import Enquiry
from src.schemas.enquirySchemas import EnquiryCreate, EnquiryUpdate, EnquiryReply
from src.services.emailService import EmailService
from src.template.baseTemplate import BaseTemplate

async def submit_enquiry(data: EnquiryCreate):
    new_enquiry = Enquiry(
        name=data.name,
        email=data.email,
        mobile=data.mobile,
        userType=data.userType,
        subject=data.subject,
        message=data.message,
        status="pending"
    )
    await new_enquiry.insert()
    return {"message": "Enquiry submitted successfully", "enquiry": new_enquiry}

async def fetch_all_enquiries():
    enquiries = await Enquiry.find().sort(-Enquiry.createdAt).to_list()
    return enquiries

async def resolve_enquiry(enquiry_id: str, data: EnquiryUpdate):
    enquiry = await Enquiry.find_one(Enquiry.enquiryId == enquiry_id)
    if not enquiry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Enquiry not found")
    
    enquiry.status = data.status
    await enquiry.save()
    return {"message": "Enquiry status updated successfully", "enquiry": enquiry}

async def reply_enquiry(enquiry_id: str, data: EnquiryReply, background_tasks: BackgroundTasks):
    enquiry = await Enquiry.find_one(Enquiry.enquiryId == enquiry_id)
    if not enquiry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Enquiry not found")
    
    if enquiry.status == "replied":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Enquiry has already been replied to")

    enquiry.replyMessage = data.replyMessage
    enquiry.repliedAt = datetime.utcnow()
    enquiry.status = "replied"
    await enquiry.save()

    # Send Email
    subject = f"Re: {enquiry.subject}"
    body = f"<p>Dear {enquiry.name},</p><p>{data.replyMessage}</p><br/><hr/><p><i>Original Message:</i></p><p>{enquiry.message}</p>"
    html_body = BaseTemplate.get_base_html(subject, body)

    background_tasks.add_task(
        EmailService.send_email,
        enquiry.email,
        subject,
        html_body
    )

    return {"message": "Reply sent successfully", "enquiry": enquiry}
