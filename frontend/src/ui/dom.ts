import type { Summary, Task } from "../types/task";
import { labels } from "../state/store";

export const dom = {
  connectionStatus: document.getElementById("connection-status") as HTMLParagraphElement,
  taskList: document.getElementById("task-list") as HTMLDivElement,
  summaryTotal: document.getElementById("summary-total") as HTMLParagraphElement,
  summaryPending: document.getElementById("summary-pending") as HTMLParagraphElement,
  summaryFinished: document.getElementById("summary-finished") as HTMLParagraphElement,
  summaryHigh: document.getElementById("summary-high") as HTMLParagraphElement,
  filterStatus: document.getElementById("filter-status") as HTMLSelectElement,
  filterPriority: document.getElementById("filter-priority") as HTMLSelectElement,
  filterSubject: document.getElementById("filter-subject") as HTMLInputElement,
  form: document.getElementById("task-form") as HTMLFormElement,
  taskId: document.getElementById("task-id") as HTMLInputElement,
  title: document.getElementById("title") as HTMLInputElement,
  description: document.getElementById("description") as HTMLTextAreaElement,
  subject: document.getElementById("subject") as HTMLInputElement,
  dueDate: document.getElementById("due-date") as HTMLInputElement,
  priority: document.getElementById("priority") as HTMLSelectElement,
  status: document.getElementById("status") as HTMLSelectElement,
  reset: document.getElementById("reset-form") as HTMLButtonElement,
  submitLabel: document.querySelector("#task-form button[type='submit']") as HTMLButtonElement
};

export const setConnectionStatus = (mode: "api" | "local") => {
  if (mode === "api") {
    dom.connectionStatus.textContent = "Conectado al backend";
  } else {
    dom.connectionStatus.textContent = "Modo local (sin backend)";
  }
};

export const renderSummary = (summary: Summary) => {
  dom.summaryTotal.textContent = summary.total.toString();
  dom.summaryPending.textContent = summary.pending.toString();
  dom.summaryFinished.textContent = summary.finished.toString();
  dom.summaryHigh.textContent = summary.highPriority.toString();
};

export const renderTasks = (tasks: Task[]) => {
  if (!tasks.length) {
    dom.taskList.innerHTML =
      "<div class=\"rounded-xl border border-dashed border-slate/30 p-6 text-center text-slate\">No hay tareas registradas.</div>";
    return;
  }

  dom.taskList.innerHTML = tasks
    .map(
      (task) => `
      <article class="rounded-2xl border border-slate/10 bg-mist/60 p-4">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 class="text-lg font-semibold">${task.title}</h3>
            <p class="text-sm text-slate">${task.subject}</p>
          </div>
          <div class="flex flex-wrap gap-2 text-xs">
            <span class="rounded-full bg-white px-3 py-1">${labels.priority[task.priority]}</span>
            <span class="rounded-full bg-white px-3 py-1">${labels.status[task.status]}</span>
            <span class="rounded-full bg-white px-3 py-1">Entrega: ${task.due_date}</span>
          </div>
        </div>
        <p class="mt-3 text-sm text-slate">${task.description}</p>
        <div class="mt-4 flex gap-3">
          <button data-action="edit" data-id="${task.id}" class="rounded-lg border border-slate/20 px-3 py-1 text-sm">Editar</button>
          <button data-action="delete" data-id="${task.id}" class="rounded-lg bg-ink px-3 py-1 text-sm text-white">Eliminar</button>
        </div>
      </article>
    `
    )
    .join("");
};

export const resetForm = () => {
  dom.form.reset();
  dom.taskId.value = "";
  dom.submitLabel.textContent = "Guardar tarea";
};

export const fillForm = (task: Task) => {
  dom.taskId.value = task.id;
  dom.title.value = task.title;
  dom.description.value = task.description;
  dom.subject.value = task.subject;
  dom.dueDate.value = task.due_date;
  dom.priority.value = task.priority;
  dom.status.value = task.status;
  dom.submitLabel.textContent = "Actualizar tarea";
};
