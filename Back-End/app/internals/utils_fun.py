from fastapi import HTTPException
from io import BytesIO
from PIL import Image
import numpy as np
from email_validator import validate_email, EmailNotValidError

# Check File as image or not
def check_is_valid_image(file):    
    try:
        image = Image.open(BytesIO(file.read()))
        image = np.array(image)
    except Exception as e:
        raise HTTPException(
            status_code=415,
            detail=f"Error processing image: {str(e)}"
        )
    
    return file


# Check image string
def is_valid_email(email: str):
    try:
        is_valid = validate_email(email)
        return True
    except Exception as e:
        return False