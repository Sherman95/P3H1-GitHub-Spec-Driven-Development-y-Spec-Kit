export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "pending" | "in_progress" | "finished";

export type Task = {
  id: string;
  title: string;
  description: string;
  subject: string;
  due_date: string;
  priority: TaskPriority;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
};

export type TaskPayload = Omit<Task, "id" | "created_at" | "updated_at">;

export type Summary = {
  total: number;
  pending: number;
  finished: number;
  highPriority: number;
};

export type Filters = {
  status?: TaskStatus | "";
  priority?: TaskPriority | "";
  subject?: string;
};
