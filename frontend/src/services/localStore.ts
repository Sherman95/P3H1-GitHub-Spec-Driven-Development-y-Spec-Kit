import type { Filters, Summary, Task, TaskPayload } from "../types/task";

const LOCAL_KEY = "taskcampus.tasks";

export const loadLocalTasks = (): Task[] => {
  const raw = localStorage.getItem(LOCAL_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Task[];
  } catch {
    return [];
  }
};

export const saveLocalTasks = (tasks: Task[]) => {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(tasks));
};

export const filterTasks = (tasks: Task[], filters: Filters) =>
  tasks.filter((task) => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.subject && !task.subject.toLowerCase().includes(filters.subject.toLowerCase())) return false;
    return true;
  });

export const localSummary = (tasks: Task[]): Summary => {
  const total = tasks.length;
  const pending = tasks.filter((task) => task.status === "pending").length;
  const finished = tasks.filter((task) => task.status === "finished").length;
  const highPriority = tasks.filter((task) => task.priority === "high").length;
  return { total, pending, finished, highPriority };
};

export const createLocalTask = (payload: TaskPayload): Task => {
  const now = new Date().toISOString();
  return {
    ...payload,
    id: crypto.randomUUID(),
    created_at: now,
    updated_at: now
  };
};
