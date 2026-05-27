import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { AMBIENT_OPTIONS, useSound } from "@/lib/sound";
import { ShareDialog } from "@/components/share-dialog";
import { copyLink } from "@/lib/share";
import { Music2, Share2, Copy, ExternalLink, Headphones } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_app/music")({ component: MusicPage });

interface Playlist {
  id: string;
  title: string;
  vibe: string;
  cover: string; // gradient class
  url: string;
  curator: string;
  emoji: string;
}

const SEED_PLAYLISTS: Playlist[] = [
  { id: "p1", title: "Deep Focus Flow", vibe: "Instrumental · 2h", cover: "from-violet-500 to-indigo-700", url: "https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ", curator: "Spotify", emoji: "🎯" },
  { id: "p2", title: "Lo-Fi Beats Study", vibe: "Lo-fi · Chillhop", cover: "from-amber-400 to-rose-500", url: "https://www.youtube.com/watch?v=jfKfPfyJRdk", curator: "Lofi Girl", emoji: "🎧" },
  { id: "p3", title: "Brain Food", vibe: "Ambient electronic", cover: "from-sky-400 to-emerald-500", url: "https://open.spotify.com/playlist/37i9dQZF1DWXLeA8Omikj7", curator: "Spotify", emoji: "🧠" },
  { id: "p4", title: "Coding Mode", vibe: "Synth · Minimal", cover: "from-emerald-500 to-cyan-600", url: "https://open.spotify.com/playlist/37i9dQZF1DX5trt9i14X7j", curator: "Spotify", emoji: "💻" },
  { id: "p5", title: "Rainy Reading", vibe: "Classical · Calm", cover: "from-slate-500 to-blue-700", url: "https://open.spotify.com/playlist/37i9dQZF1DXahRLmiBjJbm", curator: "Spotify", emoji: "📖" },
  { id: "p6", title: "Sunrise Study", vibe: "Acoustic · Warm", cover: "from-orange-400 to-pink-500", url: "https://open.spotify.com/playlist/37i9dQZF1DWZd79rJ6a7lp", curator: "Spotify", emoji: "🌅" },
];

function MusicPage() {
  const { enabled, setEnabled, ambient, setAmbient, volume, setVolume } = useSound();
  const [custom, setCustom] = useState<Playlist[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    try { setCustom(JSON.parse(localStorage.getItem("cogniflow.playlists") || "[]")); } catch {}
  }, []);

  const addPlaylist = () => {
    if (!title || !url) return;
    const next: Playlist = {
      id: crypto.randomUUID(), title, vibe: "Custom", cover: "from-fuchsia-500 to-purple-700",
      url, curator: "You", emoji: "✨",
    };
    const arr = [next, ...custom];
    setCustom(arr);
    localStorage.setItem("cogniflow.playlists", JSON.stringify(arr));
    setTitle(""); setUrl("");
  };

  const all = [...custom, ...SEED_PLAYLISTS];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Music2 className="h-6 w-6 text-primary" /> Music & Sound</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="glass">
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Headphones className="h-4 w-4" /> Ambient sound controls</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm">Sound engine</div>
              <Button size="sm" variant={enabled ? "default" : "outline"} onClick={() => setEnabled(!enabled)}>{enabled ? "On" : "Off"}</Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AMBIENT_OPTIONS.map((a) => (
                <button key={a.id} onClick={() => setAmbient(a.id)}
                  className={`text-left rounded-lg border p-3 hover:bg-accent transition ${ambient === a.id ? "border-primary bg-primary/10 shadow-glow" : "border-border"}`}>
                  <div className="text-2xl">{a.emoji}</div>
                  <div className="text-sm font-medium mt-1">{a.label}</div>
                  <div className="text-[10px] text-muted-foreground">{a.desc}</div>
                </button>
              ))}
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1"><span>Volume</span><span>{Math.round(volume * 100)}%</span></div>
              <Slider value={[volume * 100]} max={100} step={1} onValueChange={(v) => setVolume((v[0] ?? 0) / 100)} />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader><CardTitle className="text-sm">Add a playlist</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Playlist title" className="w-full h-10 px-3 rounded-md border bg-background text-sm" />
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://open.spotify.com/playlist/…" className="w-full h-10 px-3 rounded-md border bg-background text-sm" />
            <Button onClick={addPlaylist} className="w-full">Save to library</Button>
            <p className="text-xs text-muted-foreground">Drop in your Spotify, Apple Music, or YouTube link — share it instantly with friends.</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-lg font-semibold">Curated study playlists</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {all.map((p) => (
          <Card key={p.id} className="glass overflow-hidden hover-scale group">
            <div className={`h-32 bg-gradient-to-br ${p.cover} relative`}>
              <div className="absolute inset-0 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform">{p.emoji}</div>
              <div className="absolute top-2 right-2 text-[10px] bg-black/40 text-white px-2 py-0.5 rounded-full">{p.curator}</div>
            </div>
            <CardContent className="p-4 space-y-2">
              <div className="font-semibold leading-tight">{p.title}</div>
              <div className="text-xs text-muted-foreground">{p.vibe}</div>
              <div className="flex gap-2 pt-1">
                <a href={p.url} target="_blank" rel="noreferrer" className="flex-1">
                  <Button size="sm" variant="outline" className="w-full gap-1"><ExternalLink className="h-3 w-3" /> Play</Button>
                </a>
                <Button size="icon" variant="outline" onClick={() => copyLink(p.url)} aria-label="Copy"><Copy className="h-3 w-3" /></Button>
                <ShareDialog
                  trigger={<Button size="icon" variant="outline" aria-label="Share"><Share2 className="h-3 w-3" /></Button>}
                  title={p.title}
                  text={`Listening to "${p.title}" while studying. Vibe: ${p.vibe}`}
                  url={p.url}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
