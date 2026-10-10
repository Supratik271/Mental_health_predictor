import type { StudentData } from "./schema";

export interface HistoryEntry {
  id: string;
  createdAt: string;
  input: StudentData;
  score: number;
}

const KEY = "mindscope.history.v1";
const MAX = 50;

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(list: HistoryEntry[]) {
  try { localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX))); } catch { /* storage unavailable */ }
}

export function addEntry(input: StudentData, score: number): HistoryEntry {
  const entry: HistoryEntry = {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()),
    createdAt: new Date().toISOString(),
    input,
    score,
  };
  save([entry, ...loadHistory()]);
  return entry;
}

export function removeEntry(id: string): HistoryEntry[] {
  const next = loadHistory().filter((e) => e.id !== id);
  save(next);
  return next;
}

export function clearHistory() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}
