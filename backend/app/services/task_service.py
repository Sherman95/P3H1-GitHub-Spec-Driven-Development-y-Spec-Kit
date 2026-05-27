from typing import Optional

from ..repositories.base import TaskRepository
from ..schemas.task import TaskCreate, TaskOut, TaskPriority, TaskStatus, TaskUpdate


class TaskService:
    def __init__(self, repo: TaskRepository) -> None:
        self.repo = repo

    def list(
        self,
        status: Optional[TaskStatus],
        priority: Optional[TaskPriority],
        subject: Optional[str]
    ) -> list[TaskOut]:
        return self.repo.list(status=status, priority=priority, subject=subject)

    def create(self, payload: TaskCreate) -> TaskOut:
        return self.repo.create(payload)

    def update(self, task_id: str, payload: TaskUpdate) -> Optional[TaskOut]:
        return self.repo.update(task_id, payload)

    def delete(self, task_id: str) -> bool:
        return self.repo.delete(task_id)

    def summary(self) -> dict:
        return self.repo.summary()
