import { useState } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AMBIENT_OPTIONS, useSound } from "@/lib/sound";

export function SoundDock() {
  const { enabled, setEnabled, ambient, setAmbient, volume, setVolume } = useSound();
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Sound controls">
          {enabled && ambient !== "off" ? <Music className="h-4 w-4 text-primary animate-pulse" /> : enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 glass">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Ambient sound</div>
            <Button size="sm" variant={enabled ? "default" : "outline"} onClick={() => setEnabled(!enabled)}>
              {enabled ? "On" : "Off"}
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {AMBIENT_OPTIONS.map((a) => (
              <button
                key={a.id}
                onClick={() => setAmbient(a.id)}
                className={`text-left rounded-lg border p-2 hover:bg-accent transition-colors ${ambient === a.id ? "border-primary bg-primary/10" : "border-border"}`}
              >
                <div className="text-sm font-medium">{a.emoji} {a.label}</div>
                <div className="text-[10px] text-muted-foreground">{a.desc}</div>
              </button>
            ))}
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground"><span>Volume</span><span>{Math.round(volume * 100)}%</span></div>
            <Slider value={[volume * 100]} max={100} step={1} onValueChange={(v) => setVolume((v[0] ?? 0) / 100)} />
          </div>
          <p className="text-[10px] text-muted-foreground">Sounds are generated locally — no data leaves your device.</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
