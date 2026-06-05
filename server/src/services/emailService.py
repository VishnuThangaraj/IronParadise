import smtplib
import asyncio
from email.message import EmailMessage

from fastapi import HTTPException

from src.config.emailConfig import EmailConfig


class EmailService:

    @staticmethod
    def _send_email_sync(recipient: str, subject: str, body: str, is_html: bool = True):
        EmailConfig.validate()

        message = EmailMessage()
        message["Subject"] = subject
        message["From"] = EmailConfig.EMAIL_USER
        message["To"] = recipient
        
        if is_html:
            message.add_alternative(body, subtype="html")
        else:
            message.set_content(body)

        try:
            with smtplib.SMTP_SSL(
                EmailConfig.SMTP_SERVER,
                EmailConfig.SMTP_PORT
            ) as smtp:

                smtp.login(
                    EmailConfig.EMAIL_USER,
                    EmailConfig.EMAIL_PASSWORD
                )

                smtp.send_message(message)
                
        except Exception as e:
            print(f"ERROR: Failed to send email to {recipient}: {str(e)}")
            # We don't re-raise here so background tasks don't crash the server.
            return False
            
        return True

    @staticmethod
    async def send_email(
        recipient: str,
        subject: str,
        body: str,
        is_html: bool = True
    ):
        try:
            # Run the synchronous SMTP code in a thread pool so we don't block the FastAPI event loop
            await asyncio.to_thread(
                EmailService._send_email_sync,
                recipient,
                subject,
                body,
                is_html
            )

            return {
                "success": True,
                "message": "Email sent successfully or queued"
            }

        except Exception as e:
            # We log the error but DO NOT raise HTTPException.
            # Raising HTTPException inside a BackgroundTask causes a Starlette RuntimeError.
            print(f"Background Task Error (Email): {str(e)}")
            return {
                "success": False,
                "message": str(e)
            }