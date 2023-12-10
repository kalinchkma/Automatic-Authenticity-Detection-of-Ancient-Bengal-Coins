from mongoengine import connect
from decouple import config

def connect_mongodb_database():
    try:
        db_connection =  connect(host=config('DATABASE_URL'))
        print("Database connected: ", config('DATABASE_URL'))
    except:
        raise Exception("Faild to connect database")
    


