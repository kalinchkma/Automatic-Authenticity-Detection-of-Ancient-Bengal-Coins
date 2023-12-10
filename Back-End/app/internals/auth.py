from typing import Annotated, List
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from decouple import config
from jose import JWTError, jwt

# internal imports
from .crypto_grapy import verify_password
from ..models.User import UserModel,UserType, UserSubscriptionType, UserType, UserSubscriptionType, User
from ..internals.jwt_token_generator import decode_verify_token
from ..internals.utils_fun import is_valid_email

# Expiration duration of user login token
LOGIN_TOKEN_EXPIRE_TIME=10080
# Alogrithm used to create token
ALGORITHM="HS256"

# TOKEN MODEL:
class TokenData(BaseModel):
    username: str | None = None

# RESPONSE USER MODEL:
class ResponseUser(BaseModel):
    username: str
    email: str
    name: str

# USER TYPE 
class UserInfo(BaseModel):
    username: str
    email: str
    name: str
    date_of_birth: str | None
    disabled: bool
    user_type: UserType | None
    subscription: UserSubscriptionType | None
    subscription_token: List[str]
    image: str | None
    confirmed_email: bool

# Convert user object ot user model
def create_user_info(user: User):
   try:
        user_info = UserInfo(
            username=user.username,
            email=user.email,
            name=user.name,
            date_of_birth=user.date_of_birth,
            disabled=user.disabled,
            user_type=user.user_type,
            subscription=user.subscription,
            subscription_token=user.subscription_token,
            image=user.image,
            confirmed_email=user.confirmed_email
        )
        return user_info.model_dump()
   except Exception as e:
       return {
           "username": user.username,
           "email": user.email,
           "name": user.name,
           "date_of_birth": user.date_of_birth,
           "disabled": user.disabled,
           "user_type": user.user_type,
           "subscription": user.subscription,
           "subscription_token": user.subscription_token,
           "image": user.image,
           "confirmed_email": user.confirmed_email
       }

# THIS FUNCTION WILL CHECK AUTHENTICITY OF USER CRIDENTIALS
def authenticate_user(model, email: str, password: str):
    # Find user in database based of username
    if is_valid_email(email):
        user = model.find_user_by_email(email)

    # If user not found retrun 'FALSE'
    if not user:
        return False
    # If user exist in database check password of the user, if password not match return 'FALSE'
    if not verify_password(password, user.password):
        return False
    
    # check user disable or enabled
    if user.disabled:
        raise HTTPException(
            status_code=403,
            detail="Your account has been disabled, please contact to support"
        ) 
    # check user confirm email
    if not user.confirmed_email:
        raise HTTPException(
            status_code=403,
            detail="Please confirm your email, try login again"
        )
    
    # If user found in database and password if correct return user object
    return user


# THIS FUNCTION WILL DECODE USER ACCESS TOKEN
async def decode_current_user(token: Annotated[str, Depends(OAuth2PasswordBearer(tokenUrl="/auth/token"))]):
    # Create exception 
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )
   
    payload = decode_verify_token(token=token)

    # Check user username exist in decoded token
    username: str = payload['username']
    
    # If username is not exist raise error
    if username is None:
        raise credentials_exception
    # If exist set token data
    token_data = TokenData(username=username)

    # If token docode success find user on database
    user = UserModel.find_user_by_username(token_data.username)
   
    # If user not found raise error
    if not user:
        raise credentials_exception
    
    # Check user have right access
    # check user disable or enabled
    if user.disabled:
        raise HTTPException(
            status_code=403,
            detail="Your account has been disabled, please contact to support"
        ) 
    # check user confirm email
    if not user.confirmed_email:
        raise HTTPException(
            status_code=403,
            detail="Please confirm your email, try login again"
        )
        
    # If everything is ok return user properties
    # Make user_info objectt
    user = create_user_info(user)
    return user


# THIS FUNCTION RETURN CURRENT AUTHICATED USER
async def get_current_active_user(
    current_user: Annotated[UserInfo, Depends(decode_current_user)]
):
    return current_user


# THIS FUNCTION CHECK PREMIUM USER
async def check_premium_user(
    current_user: Annotated[UserInfo, Depends(decode_current_user)]
):
    # Check Premiun user
    try:
        if current_user.subscription == UserSubscriptionType.PREMIUM or current_user.user_type == UserType.ADMIN:
            return current_user
        
        raise HTTPException(
            status_code=403,
            detail="Access Forbidden"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Internal Server error"
        )

# THIS FUNCTION CHECK ADMIN USER
async def check_admin_user(
    current_user: Annotated[UserInfo, Depends(decode_current_user)]
):
    # Check Admin user
    try:
        if current_user.user_type == UserType.ADMIN:
            return current_user
        
        raise HTTPException(
            status_code=403,
            detail="Access Forbidden"
        )
    except Exception as e:
        raise HTTPException(
            status_code=403,
            detail="Access Forbidden"
        )