import uvicorn
from decouple import config
from app.main import app

if __name__ == "__main__":
    uvicorn.run(app, host=config('HOST'), port=config('PORT'))


