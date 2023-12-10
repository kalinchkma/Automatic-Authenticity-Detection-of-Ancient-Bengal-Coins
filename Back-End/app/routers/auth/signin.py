from typing import Annotated
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from mongoengine.errors import ValidationError, NotUniqueError
from datetime import datetime, timedelta
from decouple import config
from jose import JWTError, jwt


# INTERNAL IMPORTS
from ...internals.crypto_grapy import verify_password
from ...models.User import UserModel
from ...internals.auth import authenticate_user, decode_current_user, get_current_active_user, ResponseUser, LOGIN_TOKEN_EXPIRE_TIME
from ...internals.jwt_token_generator import decode_verify_token, create_token


# ROUTER: 
router = APIRouter(
    prefix="/auth",
    tags=["authentication"],
    responses={404: {"description": "Not found"}, 500: {"description": "Internal Server Error"}}
)

# ACCESS TOKEN MODEL:
# this will return as access token
class Token(BaseModel):
    access_token: str
    token_type: str

# ACCESS TOKEN ROUTES: 
# This routes will give use access token that will use for access across the app
@router.post('/token', response_model=Token)
async def login_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
   
    # Authenticate & Validate user based on database cridentials
    user = authenticate_user(UserModel, form_data.username, form_data.password)
    # If user not valid response authentication error
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    try:
        # If user validate generate time for access token
        access_token_expires = timedelta(minutes=LOGIN_TOKEN_EXPIRE_TIME)
        # Generate Token for user with expiration time
        access_token = create_token(data={'email': user.username}, expires_delta=access_token_expires)
        # Return access token
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
       
        raise HTTPException (
            status_code=500,
            detail=str(e)
        )
 
