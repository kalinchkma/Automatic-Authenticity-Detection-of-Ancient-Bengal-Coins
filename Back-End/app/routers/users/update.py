import os
from fastapi import APIRouter, HTTPException, UploadFile, File, Depends, Request
from pydantic import *
from typing import Optional, Annotated
from datetime import date, datetime
from PIL import Image
import uuid
from decouple import config


#-- Internal imports
from ...internals.auth import get_current_active_user, UserInfo
from ...models.User import UserModel
from ...internals.utils_fun import check_is_valid_image
from ...internals.send_mail import send_mail

router = APIRouter(
    prefix="/users/update",
    tags=["users", "update"],
    responses={404: {"description": "Not found"}}
)

# name change request body
class NameReqBody(BaseModel):
    name: StrictStr

# date_of_birth request body model
class DOBReqBody(BaseModel):
    date_of_birth: date


# This route change name of current active user
@router.put('/name', responses={403: {'description': 'Operation Forbidden'}})
async def change_name(req_body: NameReqBody, auth: Annotated[UserInfo , Depends(get_current_active_user)]):
    try:
        # Change request model
        change_status = UserModel.update_model(auth['username'], "name", req_body.name)
        # If change not success raise error
        if not change_status:
            raise HTTPException(
                status_code=401,
                detail="Sorry! Something went wrong"
            )
        # If ok return success
        return {"msg": "Name successfully changed"}
    except ValidationError as ve:
        raise HTTPException(
            status_code=400,
            detail=str(ve)
        )
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

# This route change date of birth of user
@router.put('/date_of_birth', responses={403: {'description': 'Operation Forbidden'}})
async def change_date_of_birth(req_body: DOBReqBody, auth: Annotated[UserInfo, Depends(get_current_active_user)]):
    try:
        # change date of birth
        change_status = UserModel.update_model(auth['username'], 'date_of_birth', DOBReqBody.date_of_birth)
        # not ok raise error
        if not change_status:
            raise HTTPException(
                status_code=401,
                detail="Sorry! Something went wrong"
            )
        # if ok return success msg
        return {"msg": "Date of Birth change successfully"}
    except ValidationError as ve:
        raise HTTPException(
            status_code=422,
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

# Profile image update
@router.put("/upload-profile-image", responses={403: {"description": "Operation Forbidden"}})
async def change_profile_image(req: Request, auth: Annotated[UserInfo, Depends(get_current_active_user)], file: UploadFile):
    try:
        image = check_is_valid_image(file=file.file)
        # try to save image to directory
        with Image.open(image) as image:
            path = os.path.join(os.getcwd(), "public", "images")
            image_name = str(uuid.uuid4()) + str(datetime.utcnow()) + ".jpg"
            server_path = str(req.base_url) + str(os.path.join("static", "images", image_name))
            image.save(os.path.join(path, image_name))
        
        update_image = UserModel.update_model(auth['username'], 'image', server_path)
        if not update_image:
            raise HTTPException(
                status_code=400,
                detail="Error Upload image"
            )
        
        return {"msg": "image updated successfully"}
    except ValidationError as ve:
        raise HTTPException(
            status_code=422,
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )    


