import { lsGet, lsSet } from "./storage";
import { getLogs, rangeMinutes } from "./knowledge-minutes";
import { getSaved } from "./storage";

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  earned?: boolean;
  earnedAt?: number;
}

const KEY = "cogniflow.badges";

export const BADGES: Badge[] = [
  { id: "first-note", name: "First Note Created", description: "Save your first item to the knowledge base.", emoji: "📝", rarity: "common" },
  { id: "streak-7", name: "7-Day Learning Streak", description: "Learn every day for a week.", emoji: "🔥", rarity: "rare" },
  { id: "deep-researcher", name: "Deep Researcher", description: "Spend 300+ minutes researching.", emoji: "🔬", rarity: "rare" },
  { id: "topic-master", name: "Topic Master", description: "Concentrate 500+ minutes on a single topic.", emoji: "🏆", rarity: "epic" },
  { id: "monthly-consistency", name: "Monthly Consistency", description: "Active 20+ days in a single month.", emoji: "📅", rarity: "epic" },
  { id: "knowledge-builder", name: "Knowledge Builder", description: "Save 25+ items to the knowledge base.", emoji: "🏗️", rarity: "legendary" },
  { id: "music-curator", name: "Music Curator", description: "Share 3 playlists with friends.", emoji: "🎶", rarity: "rare" },
  { id: "focus-warrior", name: "Focus Warrior", description: "Complete a 60-minute focus session.", emoji: "🧠", rarity: "rare" },
];

function getEarned(): Record<string, number> {
  return lsGet(KEY, {} as Record<string, number>);
}
function saveEarned(map: Record<string, number>) {
  lsSet(KEY, map);
}

export function unlock(id: string) {
  const e = getEarned();
  if (!e[id]) {
    e[id] = Date.now();
    saveEarned(e);
  }
}

function currentStreak() {
  const logs = getLogs();
  const days = new Set(logs.filter((l) => l.minutes > 0).map((l) => l.date));
  let s = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    if (days.has(d)) s++;
    else break;
  }
  return s;
}

export function recomputeBadges(): Badge[] {
  const saved = getSaved();
  if (saved.length >= 1) unlock("first-note");
  if (saved.length >= 25) unlock("knowledge-builder");
  if (currentStreak() >= 7) unlock("streak-7");
  if (rangeMinutes(30) >= 300) unlock("deep-researcher");

  // topic master
  const logs = getLogs();
  const totals = new Map<string, number>();
  for (const l of logs) {
    const k = l.topic || "General";
    totals.set(k, (totals.get(k) || 0) + l.minutes);
  }
  if (Array.from(totals.values()).some((v) => v >= 500)) unlock("topic-master");

  // monthly consistency
  const month = new Date().toISOString().slice(0, 7);
  const monthDays = new Set(logs.filter((l) => l.date.startsWith(month) && l.minutes > 0).map((l) => l.date));
  if (monthDays.size >= 20) unlock("monthly-consistency");

  const earned = getEarned();
  return BADGES.map((b) => ({ ...b, earned: !!earned[b.id], earnedAt: earned[b.id] }));
}

export function currentLearningStreak() {
  return currentStreak();
}
