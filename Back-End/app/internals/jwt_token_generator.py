from jose import jwt, JWTError
from decouple import config
from datetime import datetime, timedelta
from fastapi import HTTPException, status

# Configuration for secret token
SECRET_KEY = config('SECRET_KEY')
ALGORITHM = "HS256"


# THIS FUNCTION WILL CREATE ACCESS TOKEN OF USER
def create_token(data: dict, expires_delta: timedelta):
    # Copy given user data
    data_copy = data.copy()
    # Set expiration time based on given timedelta
    expire = datetime.utcnow() + expires_delta
   
    # Add expiration time on user object
    data_copy.update({'expire': str(expire)})
   
    # Create token for user user 'HS256' algorithm
    encoded_jwt = jwt.encode(data_copy, SECRET_KEY, algorithm=ALGORITHM)
    # Retrun token
    return encoded_jwt

# THIS FUNCTION DECODE THE JWT TOKEN
def decode_token(token: str):
    try:
        # Decode token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=500,
            detail="Internal Server error",
        )
 
# THIS FUNCTION DECODE THE JWT TOKEN
def decode_verify_token(token: str):
    try:
        # Decode token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        verified_token = verify_valid_token(payload)
        if not verified_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"}
            )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )
    

# THIS FUNCTION VERIFY THE TOKEN
def verify_valid_token(payload: dict):
    try:
        current_time = datetime.utcnow()
        token_expire_time = datetime.strptime(payload['expire'], "%Y-%m-%d %H:%M:%S.%f")
        if current_time > token_expire_time:
            return False
        return True
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )
