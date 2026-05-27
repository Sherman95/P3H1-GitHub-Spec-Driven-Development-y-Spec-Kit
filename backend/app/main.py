from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.routes import get_router
from .services.dependencies import get_task_service

load_dotenv()

app = FastAPI(title="TaskCampus API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

task_service = get_task_service()
app.include_router(get_router(task_service))
