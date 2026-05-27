import type { Filters, Task } from "../types/task";

export const state = {
  tasks: [] as Task[],
  filters: {
    status: "",
    priority: "",
    subject: ""
  } as Filters,
  useLocal: false
};

export const labels = {
  priority: {
    low: "Baja",
    medium: "Media",
    high: "Alta"
  },
  status: {
    pending: "Pendiente",
    in_progress: "En proceso",
    finished: "Finalizada"
  }
};
