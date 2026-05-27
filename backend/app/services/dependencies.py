from .storage_factory import build_repository
from .task_service import TaskService


def get_task_service() -> TaskService:
    repo = build_repository()
    return TaskService(repo)
