from fastapi import APIRouter, HTTPException, Query

from ..schemas.task import TaskCreate, TaskOut, TaskPriority, TaskStatus, TaskUpdate
from ..services.task_service import TaskService

router = APIRouter()


def get_router(service: TaskService) -> APIRouter:
    @router.get("/tasks", response_model=list[TaskOut])
    def list_tasks(
        status: TaskStatus | None = Query(default=None),
        priority: TaskPriority | None = Query(default=None),
        subject: str | None = Query(default=None)
    ):
        return service.list(status=status, priority=priority, subject=subject)

    @router.post("/tasks", response_model=TaskOut)
    def create_task(payload: TaskCreate):
        return service.create(payload)

    @router.put("/tasks/{task_id}", response_model=TaskOut)
    def update_task(task_id: str, payload: TaskUpdate):
        task = service.update(task_id, payload)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        return task

    @router.delete("/tasks/{task_id}")
    def delete_task(task_id: str):
        removed = service.delete(task_id)
        if not removed:
            raise HTTPException(status_code=404, detail="Task not found")
        return {"ok": True}

    @router.get("/summary")
    def summary():
        return service.summary()

    return router
