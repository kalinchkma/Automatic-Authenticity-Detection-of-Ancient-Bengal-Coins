from fastapi import APIRouter, HTTPException

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}}
)


@router.delete('/{user_id}', responses={403: {'description': 'Operation Forbidden'}})
async def delete_user(user_id: str):
    return {"delete": "This end point will delete the user"}