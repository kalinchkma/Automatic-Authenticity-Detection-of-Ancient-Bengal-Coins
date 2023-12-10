from fastapi import APIRouter, HTTPException,Depends
from fastapi.responses import JSONResponse
from typing import Annotated,List
from ...models.User import UserModel

# intenal import 
from ...internals.auth import UserInfo, get_current_active_user, create_user_info

router = APIRouter(
    prefix="/users",
    tags=["users", "read"],
    responses={404: {"description": "Not found"}}
)

# Read Current authenticated user
@router.get('/me', response_model=UserInfo)
async def read_user_me(current_user: Annotated[UserInfo, Depends(get_current_active_user)]):
    return current_user

# Read All users at once
# @TODO: Make this router only for admin
@router.get('/all')
async def real_all_user(auth_user: Annotated[UserInfo, Depends(get_current_active_user)]):
    try:
        all_users = UserModel.get_all()
        if not all_users:
            raise HTTPException(
                status_code=500,
                detail="Internal Server error"
            )
        # Create response user object from user_list
        list_of_users = [create_user_info(u) for u in all_users]
        # Respose with all user
        return {"users": list_of_users}
    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )
 
