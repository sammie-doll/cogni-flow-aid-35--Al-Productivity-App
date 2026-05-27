import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Mood =
  | "default"
  | "focus"
  | "study"
  | "research"
  | "creative"
  | "exam"
  | "soft"
  | "night-coder"
  | "calm"
  | "luxury"
  | "y2k"
  | "academic"
  | "cozy";

export interface MoodMeta {
  id: Mood;
  label: string;
  description: string;
  emoji: string;
}

export const MOODS: MoodMeta[] = [
  { id: "default", label: "Default", description: "Balanced workspace", emoji: "✨" },
  { id: "focus", label: "Focus Mode", description: "Distraction-free deep work", emoji: "🎯" },
  { id: "study", label: "Study Mode", description: "Warm, library-like calm", emoji: "📚" },
  { id: "research", label: "Research Mode", description: "Cool analytical palette", emoji: "🔬" },
  { id: "creative", label: "Creative Thinking", description: "Vibrant, playful sparks", emoji: "🎨" },
  { id: "exam", label: "Exam Prep", description: "High-energy crunch time", emoji: "⏱️" },
  { id: "soft", label: "Soft Aesthetic", description: "Pastel & cozy", emoji: "🌸" },
  { id: "night-coder", label: "Night Coder", description: "Neon green on black", emoji: "💻" },
  { id: "calm", label: "Calm & Minimal", description: "Quiet zen surfaces", emoji: "🕊️" },
  { id: "luxury", label: "Luxury Dark", description: "Gold on obsidian", emoji: "🥂" },
  { id: "y2k", label: "Retro Y2K", description: "Chrome & holographic", emoji: "💿" },
  { id: "academic", label: "Academic", description: "Classic scholarly tones", emoji: "🎓" },
  { id: "cozy", label: "Cozy Winter", description: "Fireside warmth", emoji: "🧣" },
];

const Ctx = createContext<{
  mood: Mood;
  setMood: (m: Mood) => void;
  meta: MoodMeta;
} | null>(null);

const KEY = "cogniflow.mood";
const ALL_CLASSES = MOODS.map((m) => `mood-${m.id}`);

export function MoodProvider({ children }: { children: ReactNode }) {
  const [mood, setMoodState] = useState<Mood>("default");

  useEffect(() => {
    const saved = (localStorage.getItem(KEY) as Mood) || "default";
    setMoodState(saved);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    ALL_CLASSES.forEach((c) => root.classList.remove(c));
    root.classList.add(`mood-${mood}`);
    localStorage.setItem(KEY, mood);
  }, [mood]);

  const meta = MOODS.find((m) => m.id === mood) || MOODS[0];

  return <Ctx.Provider value={{ mood, setMood: setMoodState, meta }}>{children}</Ctx.Provider>;
}

export function useMood() {
  const c = useContext(Ctx);
  if (!c) throw new Error("MoodProvider missing");
  return c;
}
