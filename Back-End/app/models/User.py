import uuid
from mongoengine import *
from mongoengine.errors import DoesNotExist
from pydantic import BaseModel,Strict, EmailStr
from typing import Annotated
from bson import objectid
from datetime import date
from fastapi import HTTPException
from enum import Enum

# internal import
from ..internals.crypto_grapy import hash_password, verify_password

# User type
class UserType(Enum):
    ADMIN = "ADMIN"
    BABY_YODA = "BABY YODA"

# Subscription Type
class UserSubscriptionType(Enum):
    FREE = "FREE"
    PREMIUM = "PREMIUM"
    

def _not_empty(val):
    if not val:
        raise ValidationError('Value can not be empty')

# USER DOCUMENT MODEL:
# Based on this model user will be recoded on database
class User(Document):
    id = ObjectIdField(primary_key=True)
    name = StringField(max_length=50,required=False, validation=_not_empty)
    username = StringField(max_length=50,required=False, unique=True, validation=_not_empty)
    email = EmailField(max_length=50,required=True, unique=True,validation=_not_empty)
    password = StringField(max_length=1000,required=True, validation=_not_empty)
    date_of_birth = StringField(required=False, default="null")
    disabled = BooleanField(required=False, default=False)
    user_type = EnumField(UserType, required=False, default=UserType.BABY_YODA)
    subscription = EnumField(UserSubscriptionType, required=False, default=UserSubscriptionType.FREE)
    subscription_token = ListField(StringField(), required=False, default=list())
    image = StringField(required=False, default="null")
    confirmed_email = BooleanField(required=False, default=False)

# USER MODEL:
# This model will handle all user operation with database
class UserModel:
    def __init__(self):
        pass
    
    # This function will create new user
    def create_new_user_signup(
        self,
        email: EmailStr, 
        username: Annotated[str, Strict()], 
        password: Annotated[str, Strict()],
        ):
     
        self.email = email
        self.username = username
        self.password = hash_password(password)
    
    # This function will save user on database
    def save_new_user_signup(self):
        
        self.model = User()
        self.model.id = objectid.ObjectId()
        self.model.email = self.email
        self.model.username = self.username
        self.model.password = self.password
        self.model.save()
        return True
       
        
    # Update model
    @staticmethod
    def update_model(username, field, value):
        try:
            user = User.objects.get(username=username)
            # update model
            user[field] = value
            # Save update model
            user.save()
            return True
        except DoesNotExist as ne:
            raise HTTPException(
                status_code=400,
                detail=str(ne)
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=str(e)
            )
        
    # This static method will find user based on username
    @staticmethod
    def find_user_by_username(username):
        try:
            user = User.objects.get(username=username)
            
            return user
        except DoesNotExist as ne:
            return False
        except Exception as e:
           
            return False
        
    @staticmethod
    def find_user_by_email(email):
        try:
            user = User.objects.get(email=email)
            return user
        except DoesNotExist as ne:
            return False
        except Exception as e:
            
            return False
    # This static function will retrun all users
    @staticmethod
    def get_all():
        try:
            users = User.objects.all()
            return users
        except Exception as e:
            return False
    
    # This function return user as a python dictionary
    def dump_json(self):
        return {
            "username": self.username, 
            "email": self.email,
            }
    

