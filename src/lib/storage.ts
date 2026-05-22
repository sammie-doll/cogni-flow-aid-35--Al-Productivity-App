export interface SavedItem {
  id: string;
  type: "email" | "summary" | "plan" | "research" | "report" | "chat";
  title: string;
  content: string;
  createdAt: number;
  meta?: Record<string, unknown>;
}

const KEY = "cogniflow.saved";

export function getSaved(): SavedItem[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveItem(item: Omit<SavedItem, "id" | "createdAt">): SavedItem {
  const all = getSaved();
  const next: SavedItem = { ...item, id: crypto.randomUUID(), createdAt: Date.now() };
  all.unshift(next);
  localStorage.setItem(KEY, JSON.stringify(all));
  return next;
}

export function deleteItem(id: string) {
  const all = getSaved().filter((i) => i.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function clearSaved() {
  localStorage.removeItem(KEY);
}

// Generic key/value helpers
export function lsGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
export function lsSet<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}
