from datetime import datetime
from typing import Optional

from supabase import create_client

from ..schemas.task import TaskCreate, TaskOut, TaskPriority, TaskStatus, TaskUpdate


class SupabaseTaskRepository:
    def __init__(self, url: str, key: str, table: str) -> None:
        self.client = create_client(url, key)
        self.table = table

    def list(
        self,
        status: Optional[TaskStatus],
        priority: Optional[TaskPriority],
        subject: Optional[str]
    ) -> list[TaskOut]:
        query = self.client.table(self.table).select("*")
        if status:
            query = query.eq("status", status)
        if priority:
            query = query.eq("priority", priority)
        if subject:
            query = query.ilike("subject", f"%{subject}%")
        response = query.execute()
        return response.data or []

    def create(self, payload: TaskCreate) -> TaskOut:
        now = datetime.utcnow().isoformat()
        task = {**payload.model_dump(), "created_at": now, "updated_at": now}
        response = self.client.table(self.table).insert(task).execute()
        return response.data[0]

    def update(self, task_id: str, payload: TaskUpdate) -> Optional[TaskOut]:
        now = datetime.utcnow().isoformat()
        data = {**payload.model_dump(), "updated_at": now}
        response = self.client.table(self.table).update(data).eq("id", task_id).execute()
        return response.data[0] if response.data else None

    def delete(self, task_id: str) -> bool:
        response = self.client.table(self.table).delete().eq("id", task_id).execute()
        return bool(response.data)

    def summary(self) -> dict:
        response = self.client.table(self.table).select("*").execute()
        tasks = response.data or []
        total = len(tasks)
        pending = len([task for task in tasks if task["status"] == "pending"])
        finished = len([task for task in tasks if task["status"] == "finished"])
        high_priority = len([task for task in tasks if task["priority"] == "high"])
        return {
            "total": total,
            "pending": pending,
            "finished": finished,
            "highPriority": high_priority
        }
