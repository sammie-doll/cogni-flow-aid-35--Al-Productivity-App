import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MOODS, useMood } from "@/lib/mood";
import { Palette, Check } from "lucide-react";

export function MoodSwitcher() {
  const { mood, setMood, meta } = useMood();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">{meta.emoji} {meta.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 max-h-[70vh] overflow-auto">
        <DropdownMenuLabel>Personality & Mood</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {MOODS.map((m) => (
          <DropdownMenuItem key={m.id} onClick={() => setMood(m.id)} className="flex items-start gap-2">
            <span className="text-lg leading-none">{m.emoji}</span>
            <div className="flex-1">
              <div className="text-sm font-medium flex items-center gap-2">
                {m.label}
                {mood === m.id && <Check className="h-3 w-3 text-primary" />}
              </div>
              <div className="text-[11px] text-muted-foreground">{m.description}</div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
