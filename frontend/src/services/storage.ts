import { apiRequest } from "./api";
import {
  createLocalTask,
  filterTasks,
  loadLocalTasks,
  localSummary,
  saveLocalTasks
} from "./localStore";
import { state } from "../state/store";
import type { Filters, Summary, Task, TaskPayload } from "../types/task";

export type ConnectionMode = "api" | "local";

export const createStorage = (setConnectionStatus: (mode: ConnectionMode) => void) => {
  const detectBackend = async () => {
    try {
      await apiRequest("/summary");
      state.useLocal = false;
      setConnectionStatus("api");
    } catch {
      state.useLocal = true;
      setConnectionStatus("local");
    }
  };

  const list = async (filters: Filters) => {
    if (state.useLocal) {
      const tasks = loadLocalTasks();
      return filterTasks(tasks, filters);
    }

    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.priority) params.set("priority", filters.priority);
    if (filters.subject) params.set("subject", filters.subject);

    try {
      return (await apiRequest(`/tasks?${params.toString()}`)) as Task[];
    } catch {
      state.useLocal = true;
      setConnectionStatus("local");
      const tasks = loadLocalTasks();
      return filterTasks(tasks, filters);
    }
  };

  const create = async (payload: TaskPayload) => {
    if (state.useLocal) {
      const tasks = loadLocalTasks();
      const newTask = createLocalTask(payload);
      const next = [newTask, ...tasks];
      saveLocalTasks(next);
      return newTask;
    }

    try {
      return (await apiRequest("/tasks", {
        method: "POST",
        body: JSON.stringify(payload)
      })) as Task;
    } catch {
      state.useLocal = true;
      setConnectionStatus("local");
      return create(payload);
    }
  };

  const update = async (id: string, payload: TaskPayload) => {
    if (state.useLocal) {
      const tasks = loadLocalTasks();
      const now = new Date().toISOString();
      const next = tasks.map((task) =>
        task.id === id ? { ...task, ...payload, updated_at: now } : task
      );
      saveLocalTasks(next);
      return next.find((task) => task.id === id) as Task;
    }

    try {
      return (await apiRequest(`/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      })) as Task;
    } catch {
      state.useLocal = true;
      setConnectionStatus("local");
      return update(id, payload);
    }
  };

  const remove = async (id: string) => {
    if (state.useLocal) {
      const tasks = loadLocalTasks();
      const next = tasks.filter((task) => task.id !== id);
      saveLocalTasks(next);
      return;
    }

    try {
      await apiRequest(`/tasks/${id}`, { method: "DELETE" });
    } catch {
      state.useLocal = true;
      setConnectionStatus("local");
      return remove(id);
    }
  };

  const summary = async (): Promise<Summary> => {
    if (state.useLocal) {
      return localSummary(loadLocalTasks());
    }

    try {
      return (await apiRequest("/summary")) as Summary;
    } catch {
      state.useLocal = true;
      setConnectionStatus("local");
      return localSummary(loadLocalTasks());
    }
  };

  return {
    detectBackend,
    list,
    create,
    update,
    remove,
    summary
  };
};
