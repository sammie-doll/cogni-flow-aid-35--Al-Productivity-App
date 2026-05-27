import { lsGet, lsSet } from "./storage";

const KEY = "cogniflow.minutes";

export interface MinuteLog {
  date: string; // YYYY-MM-DD
  minutes: number;
  topic?: string;
}

export function getLogs(): MinuteLog[] {
  return lsGet<MinuteLog[]>(KEY, []);
}

export function addMinutes(minutes: number, topic?: string) {
  const date = new Date().toISOString().slice(0, 10);
  const logs = getLogs();
  const existing = logs.find((l) => l.date === date && l.topic === topic);
  if (existing) existing.minutes += minutes;
  else logs.push({ date, minutes, topic });
  lsSet(KEY, logs);
}

export function rangeMinutes(days: number) {
  const logs = getLogs();
  const now = Date.now();
  const cutoff = now - days * 86400000;
  return logs
    .filter((l) => new Date(l.date).getTime() >= cutoff)
    .reduce((s, l) => s + l.minutes, 0);
}

export function dailySeries(days: number) {
  const map = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    map.set(d, 0);
  }
  for (const l of getLogs()) {
    if (map.has(l.date)) map.set(l.date, (map.get(l.date) || 0) + l.minutes);
  }
  return Array.from(map.entries()).map(([date, minutes]) => ({
    date: date.slice(5),
    minutes,
  }));
}

export function topicBreakdown(days = 30) {
  const cutoff = Date.now() - days * 86400000;
  const map = new Map<string, number>();
  for (const l of getLogs()) {
    if (new Date(l.date).getTime() < cutoff) continue;
    const k = l.topic || "General";
    map.set(k, (map.get(k) || 0) + l.minutes);
  }
  return Array.from(map.entries())
    .map(([topic, minutes]) => ({ topic, minutes }))
    .sort((a, b) => b.minutes - a.minutes);
}

// Auto session tracker — bump every minute while a page is active
export function startSessionTracker(topic: string) {
  if (typeof window === "undefined") return () => {};
  const iv = window.setInterval(() => {
    if (document.visibilityState === "visible") addMinutes(1, topic);
  }, 60_000);
  return () => window.clearInterval(iv);
}

// Seed friendly demo data on first run
export function ensureDemoSeed() {
  const logs = getLogs();
  if (logs.length) return;
  const topics = ["Notes", "Reading", "Research", "Review", "Flashcards"];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    const t = topics[i % topics.length];
    const m = 15 + Math.floor(Math.random() * 75);
    logs.push({ date, minutes: m, topic: t });
  }
  lsSet(KEY, logs);
}
