from typing import Protocol, Optional

from ..schemas.task import TaskCreate, TaskOut, TaskPriority, TaskStatus, TaskUpdate


class TaskRepository(Protocol):
    def list(
        self,
        status: Optional[TaskStatus],
        priority: Optional[TaskPriority],
        subject: Optional[str]
    ) -> list[TaskOut]:
        ...

    def create(self, payload: TaskCreate) -> TaskOut:
        ...

    def update(self, task_id: str, payload: TaskUpdate) -> Optional[TaskOut]:
        ...

    def delete(self, task_id: str) -> bool:
        ...

    def summary(self) -> dict:
        ...
