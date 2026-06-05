from os import getenv
from dotenv import load_dotenv

load_dotenv()


class EmailConfig:
    SMTP_SERVER = getenv("SMTP_SERVER", "smtp.gmail.com")
    SMTP_PORT = int(getenv("SMTP_PORT", 465))
    EMAIL_USER = getenv("EMAIL_USER")
    EMAIL_PASSWORD = getenv("EMAIL_PASSWORD")

    @classmethod
    def validate(cls):
        if not cls.EMAIL_USER:
            raise ValueError("EMAIL_USER is not configured")

        if not cls.EMAIL_PASSWORD:
            raise ValueError("EMAIL_PASSWORD is not configured")