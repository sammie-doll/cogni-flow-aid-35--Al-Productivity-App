import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

export type Ambient = "off" | "rain" | "cafe" | "focus" | "ocean" | "keyboard" | "lofi";

export const AMBIENT_OPTIONS: { id: Ambient; label: string; emoji: string; desc: string }[] = [
  { id: "off", label: "Silence", emoji: "🔇", desc: "No background sound" },
  { id: "rain", label: "Rain", emoji: "🌧️", desc: "Soft rainfall" },
  { id: "cafe", label: "Café", emoji: "☕", desc: "Warm coffee shop hum" },
  { id: "focus", label: "Focus Pulse", emoji: "🎯", desc: "Deep concentration tone" },
  { id: "ocean", label: "Ocean", emoji: "🌊", desc: "Calming sea waves" },
  { id: "keyboard", label: "Keyboard", emoji: "⌨️", desc: "Mechanical typing" },
  { id: "lofi", label: "Lo-Fi Pulse", emoji: "🎧", desc: "Gentle study pulse" },
];

interface SoundCtx {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
  ambient: Ambient;
  setAmbient: (a: Ambient) => void;
  volume: number;
  setVolume: (v: number) => void;
  click: () => void;
}

const Ctx = createContext<SoundCtx | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);
  const [ambient, setAmbient] = useState<Ambient>("off");
  const [volume, setVolume] = useState(0.35);

  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ stop: () => void } | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("cogniflow.sound") || "null");
      if (s) {
        setEnabled(s.enabled ?? true);
        setAmbient(s.ambient ?? "off");
        setVolume(s.volume ?? 0.35);
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("cogniflow.sound", JSON.stringify({ enabled, ambient, volume }));
  }, [enabled, ambient, volume]);

  // Audio engine
  useEffect(() => {
    // teardown
    nodesRef.current?.stop();
    nodesRef.current = null;

    if (!enabled || ambient === "off") return;

    const AC = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
    if (!ctxRef.current) ctxRef.current = new AC();
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const master = ctx.createGain();
    master.gain.value = volume;
    master.connect(ctx.destination);
    gainRef.current = master;

    const stops: Array<() => void> = [];

    const makeNoise = (type: "white" | "pink" | "brown" = "white") => {
      const bufferSize = 2 * ctx.sampleRate;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let last = 0;
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === "white") data[i] = white;
        else if (type === "brown") {
          last = (last + 0.02 * white) / 1.02;
          data[i] = last * 3.5;
        } else {
          b0 = 0.99765 * b0 + white * 0.099046;
          b1 = 0.963 * b1 + white * 0.2965164;
          b2 = 0.57 * b2 + white * 1.0526913;
          data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.18;
        }
      }
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      src.start();
      return src;
    };

    if (ambient === "rain") {
      const src = makeNoise("pink");
      const filt = ctx.createBiquadFilter();
      filt.type = "lowpass";
      filt.frequency.value = 1200;
      src.connect(filt).connect(master);
      stops.push(() => src.stop());
    } else if (ambient === "ocean") {
      const src = makeNoise("brown");
      const filt = ctx.createBiquadFilter();
      filt.type = "lowpass";
      filt.frequency.value = 600;
      // slow LFO on filter
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.15;
      lfoGain.gain.value = 250;
      lfo.connect(lfoGain).connect(filt.frequency);
      lfo.start();
      src.connect(filt).connect(master);
      stops.push(() => { src.stop(); lfo.stop(); });
    } else if (ambient === "cafe") {
      const src = makeNoise("brown");
      const filt = ctx.createBiquadFilter();
      filt.type = "bandpass";
      filt.frequency.value = 800;
      filt.Q.value = 0.7;
      src.connect(filt).connect(master);
      stops.push(() => src.stop());
    } else if (ambient === "focus") {
      // binaural-ish: two close sines
      const oscL = ctx.createOscillator();
      const oscR = ctx.createOscillator();
      oscL.frequency.value = 220;
      oscR.frequency.value = 226;
      const g = ctx.createGain();
      g.gain.value = 0.05;
      oscL.connect(g);
      oscR.connect(g);
      g.connect(master);
      oscL.start();
      oscR.start();
      stops.push(() => { oscL.stop(); oscR.stop(); });
    } else if (ambient === "keyboard") {
      // periodic tick clusters
      let cancelled = false;
      const tick = () => {
        if (cancelled) return;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "square";
        o.frequency.value = 1200 + Math.random() * 800;
        g.gain.value = 0;
        o.connect(g).connect(master);
        const t = ctx.currentTime;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.15, t + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
        o.start(t);
        o.stop(t + 0.05);
        setTimeout(tick, 80 + Math.random() * 300);
      };
      tick();
      stops.push(() => { cancelled = true; });
    } else if (ambient === "lofi") {
      const notes = [220, 261.63, 293.66, 329.63, 392];
      let i = 0;
      let cancelled = false;
      const step = () => {
        if (cancelled) return;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = notes[i % notes.length] / 2;
        const t = ctx.currentTime;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.08, t + 0.1);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
        o.connect(g).connect(master);
        o.start(t);
        o.stop(t + 1.5);
        i++;
        setTimeout(step, 700);
      };
      step();
      stops.push(() => { cancelled = true; });
    }

    nodesRef.current = { stop: () => stops.forEach((s) => s()) };
    return () => nodesRef.current?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ambient]);

  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = volume;
  }, [volume]);

  const click = () => {
    if (!enabled) return;
    try {
      const AC = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
      if (!ctxRef.current) ctxRef.current = new AC();
      const ctx = ctxRef.current;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "triangle";
      o.frequency.value = 880;
      const t = ctx.currentTime;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.08 * volume, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.1);
    } catch {}
  };

  return (
    <Ctx.Provider value={{ enabled, setEnabled, ambient, setAmbient, volume, setVolume, click }}>
      {children}
    </Ctx.Provider>
  );
}

export function useSound() {
  const c = useContext(Ctx);
  if (!c) throw new Error("SoundProvider missing");
  return c;
}
