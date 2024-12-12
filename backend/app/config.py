import os

class Config:
    UPLOAD_FOLDER = "./tmp"
    PROCESSED_CSV = "processed_data.csv"
    SQLALCHEMY_DATABASE_URI = "mysql://user:password@localhost:3306/db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SOCKETIO_CORS_ALLOWED_ORIGINS = "*"
    # if you are using windows, you can use the executable file
    # if you are using linux, you can use the C source code

    C_EXECUTABLE_PATH = "./utils/data_processor"
    #C_EXECUTABLE_PATH = "./utils/data_processor.exe"
   