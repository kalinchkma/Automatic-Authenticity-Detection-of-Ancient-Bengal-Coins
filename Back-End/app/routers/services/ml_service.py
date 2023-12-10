import numpy as np
from PIL import Image
from fastapi import APIRouter, HTTPException, UploadFile, Depends
from pydantic import BaseModel



from ...AI_Models.NumismaticModel import predict

router = APIRouter(
    prefix="/ai",
    tags=["AI Services"],
    responses={404: {"description": "Service not available"}}
)



@router.post("/predict")
async def ancient_bengal_coin_originality_detection(file: UploadFile):
    try:
        # Open file with pillow
        with Image.open(file.file) as img:
           pred = predict(img)
        return {"result": f'{pred}'}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
        
   