from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import HTMLResponse
from pydantic import BaseModel,EmailStr
from bson import objectid
from enum import Enum
from datetime import date
from mongoengine.errors import ValidationError, NotUniqueError
from pymongo.errors import DuplicateKeyError
import uuid
from datetime import datetime, timedelta

# internal imports
from ...models.User import UserModel
from ...internals.send_mail import send_mail
from ...internals.email_template import generate_confirme_email
from ...internals.jwt_token_generator import decode_verify_token, create_token, decode_token
from ...internals.utils import get_uname



# USER REQUEST BODY MODEL:
# this model defined the model of user request body
class RequsetBody(BaseModel):
    email: EmailStr
    password: str


# Router
router = APIRouter(
    prefix="/auth",
    tags=["authentication"],
    responses={404: {"description": "Not found"}, 500: {"description": "Internal Server Error"}}
)

# PUBLIC ROUTES:
# signup public user
@router.post('/signup', responses={403: {'description': 'Operation Forbidden'}})
async def signup_user(user: RequsetBody, background_tasks: BackgroundTasks):
    try:
        # Create model for new user
        new_user = UserModel()
     
        uname: str = get_uname(user.email)
        
        # Set attribute of new user 
        new_user.create_new_user_signup( user.email, uname, user.password, )
        # Save new user to database 
        result = new_user.save_new_user_signup()
        if result:
            expire = timedelta(minutes=1)
            token = create_token(data={"username": new_user.username}, expires_delta=expire)
            subject = "Confirm your mail"
            link = f"http://localhost:8000/auth/confirm-mail/{token}"
            message = generate_confirme_email(link=link, name=new_user.username)
            background_tasks.add_task(send_mail,to_email=new_user.email, subject=subject, message=message)
        # Return create newly user 
        return {"msg": f"Please check and confirm your email, Email send to {new_user.email}"}
    # If user input not valid raise error
    except ValidationError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    # If user already exist in database raise duplicate key error
    except DuplicateKeyError as dke:
        raise HTTPException(status_code=400, detail=str(dke))
    # If user already exist in database raise NotUniqueError error
    except NotUniqueError as nue:
        raise HTTPException(status_code=410, detail=str(nue))
    # Other error exception
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# SPECIAL ROUTES:
# This routes will confirm user email
@router.get('/confirm-mail/{active}', responses={403: {'description': 'Operation Forbidden'}})
async def confirm_email(active: str):
    try:
        payload = decode_token(active)
        username = payload['username']
        user = UserModel.find_user_by_username(username)
        if not user:
            # raise HTTPException(
            #     status_code=404,
            #     detail="Service not found"
            # )
            html = '''
                <html>
                <head>
                    <title>Email Confirmation</title>
                </head>
                <body>
                    <h1>Service not found</h1>
                
                </body>
                </html>
            '''
            return HTMLResponse(content=html)
        update = UserModel.update_model(username, "confirmed_email", True)
        if not update:
            # raise HTTPException(
            #     status_code=500,
            #     detail="Internal Server error"
            # )
            html = '''
                <html>
                <head>
                    <title>Email Confirmation</title>
                </head>
                <body>
                    <h1>Service not found</h1>
                
                </body>
                </html>
            '''
            return HTMLResponse(content=html)
        
        html_content = """
            <html>
            <head>
                <title>Email Confirmation</title>
            </head>
            <body>
              <div style="display: flex;flex-direction: column;align-items: center; justify-content: center">
                <h1>Your Account has been acctivated.</h1>
                <a style="display: inline-block; padding: 10px 20px; background: green; color: #fff; text-decoration: none; font-weight: bold; font-size: 20px" href="http://localhost:3000/login">Login</a>
            <div>
            </body>
            </html>
        """
        return HTMLResponse(content=html_content)
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail="Internal Server error"
        )