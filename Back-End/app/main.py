import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException


# internals import 
from .dependencies import database
from .routers.users import delete, read, update
from .routers.auth import signin, signup
from .routers.services import payment, ml_service
from .internals.auth import get_current_active_user

# connect database
database.connect_mongodb_database()

app = FastAPI()

# static file serving
app.mount("/static", StaticFiles(directory=os.path.join(os.getcwd(),"public")), name="static")

# Authentication Routes
app.include_router(signin.router)
app.include_router(signup.router)

# User Routes
app.include_router(delete.router)
app.include_router(read.router)
app.include_router(
    update.router,
)

# Payment Routes
app.include_router(payment.router)

# AI Services
app.include_router(
    ml_service.router,
    # dependencies=[Depends(get_current_active_user)]
)
@app.get("/test")
async def default():
    return {"dummy": {
        "name": "Mr dummy",
        "age": "999"
    }}

# Starlette HTTPException handler
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    return await request_error_response(request=request, errors=exc.detail, status=exc.status_code)

# Validation error handler
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    error_messages = exc.errors()
    return await request_error_response(request= request, errors="validation error", status=400, )

# Error response function
async def request_error_response(request, errors, status=500):
    return JSONResponse(
        content={"errors": str(errors)},
        status_code=status,
    )

