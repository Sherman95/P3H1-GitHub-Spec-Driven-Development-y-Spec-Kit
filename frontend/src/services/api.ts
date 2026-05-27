const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

export const apiRequest = async (path: string, options?: RequestInit) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      ...options
    });
    if (!response.ok) {
      throw new Error("Request failed");
    }
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
};
