import { state } from "./state/store";
import type { TaskPayload, TaskPriority, TaskStatus } from "./types/task";
import { createStorage } from "./services/storage";
import { dom, fillForm, renderSummary, renderTasks, resetForm, setConnectionStatus } from "./ui/dom";

const storage = createStorage(setConnectionStatus);

const refresh = async () => {
  state.tasks = await storage.list(state.filters);
  renderTasks(state.tasks);
  renderSummary(await storage.summary());
};

const getPayload = (): TaskPayload => ({
  title: dom.title.value.trim(),
  description: dom.description.value.trim(),
  subject: dom.subject.value.trim(),
  due_date: dom.dueDate.value,
  priority: dom.priority.value as TaskPriority,
  status: dom.status.value as TaskStatus
});

const hasValidPayload = (payload: TaskPayload) =>
  payload.title && payload.description && payload.subject && payload.due_date;

const bindEvents = () => {
  dom.filterStatus.addEventListener("change", async () => {
    state.filters.status = dom.filterStatus.value as TaskStatus | "";
    await refresh();
  });

  dom.filterPriority.addEventListener("change", async () => {
    state.filters.priority = dom.filterPriority.value as TaskPriority | "";
    await refresh();
  });

  dom.filterSubject.addEventListener("input", async () => {
    state.filters.subject = dom.filterSubject.value.trim();
    await refresh();
  });

  dom.reset.addEventListener("click", () => resetForm());

  dom.form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = getPayload();
    if (!hasValidPayload(payload)) return;

    if (dom.taskId.value) {
      await storage.update(dom.taskId.value, payload);
    } else {
      await storage.create(payload);
    }

    resetForm();
    await refresh();
  });

  dom.taskList.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;
    const action = target.dataset.action;
    const id = target.dataset.id;

    if (!action || !id) return;

    if (action === "edit") {
      const task = state.tasks.find((item) => item.id === id);
      if (!task) return;
      fillForm(task);
      return;
    }

    if (action === "delete") {
      await storage.remove(id);
      await refresh();
    }
  });
};

export const initApp = async () => {
  bindEvents();
  await storage.detectBackend();
  await refresh();
};
