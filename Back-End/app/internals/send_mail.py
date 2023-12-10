import smtplib
from pydantic import EmailStr
from fastapi import HTTPException
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from decouple import config


# Email Server configuration
EMAIL_SERVER = config("EMAIL_SERVER")
EMAIL_PORT = config('EMAIL_PORT')
EMAIL_USERNAME = config('EMAIL_USERNAME')
EMAIL_PASSWORD = config('EMAIL_PASSWORD')
SENDER_EMAIL = config('SENDER_EMAIL')


def send_mail(to_email: EmailStr, subject: str, message: str):
    try:
        # Create the MIME object
        msg = MIMEMultipart()
        msg.attach(MIMEText(message, 'html'))
        msg["Subject"] = subject
        msg["From"] = SENDER_EMAIL
        msg["To"] = to_email
        
        # Setup the connection to SMTP server
        with smtplib.SMTP(EMAIL_SERVER, EMAIL_PORT) as server:
            # Start the TLS session
            server.starttls()
            
            # Login to email account
            server.login(EMAIL_USERNAME, EMAIL_PASSWORD)

            # Send the email
            server.sendmail(SENDER_EMAIL, to_email, msg.as_string())
           
            # Close the connection
            server.quit()
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ivalid email")
