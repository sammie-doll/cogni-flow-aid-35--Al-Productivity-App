import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShareDialog } from "@/components/share-dialog";
import { ensureDemoSeed } from "@/lib/knowledge-minutes";
import { recomputeBadges, BADGES } from "@/lib/achievements";
import { useEffect, useMemo } from "react";
import { Trophy, Share2, Lock } from "lucide-react";

export const Route = createFileRoute("/_app/achievements")({ component: AchievementsPage });

const RARITY_COLOR: Record<string, string> = {
  common: "bg-muted text-muted-foreground",
  rare: "bg-sky-500/15 text-sky-600 dark:text-sky-300",
  epic: "bg-violet-500/15 text-violet-600 dark:text-violet-300",
  legendary: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
};

function AchievementsPage() {
  useEffect(() => { ensureDemoSeed(); }, []);
  const badges = useMemo(() => recomputeBadges(), []);
  const earned = badges.filter((b) => b.earned);
  const progress = Math.round((earned.length / badges.length) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Trophy className="h-6 w-6 text-amber-500" /> Achievements</h1>
        <ShareDialog
          trigger={<Button size="sm" variant="outline" className="gap-2"><Share2 className="h-4 w-4" /> Share showcase</Button>}
          title="My CogniFlow achievements"
          text={`I unlocked ${earned.length}/${BADGES.length} badges on CogniFlow!`}
        />
      </div>

      <Card className="glass">
        <CardContent className="p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Collection progress</span>
            <span className="font-semibold">{earned.length} / {badges.length}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full gradient-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((b) => (
          <Card key={b.id} className={`glass transition-all hover-scale relative overflow-hidden ${b.earned ? "border-primary/40 shadow-glow" : "opacity-70"}`}>
            {b.earned && <div className="absolute inset-0 gradient-accent opacity-10 pointer-events-none" />}
            <CardContent className="p-5 relative">
              <div className="flex items-start justify-between">
                <div className="text-5xl">{b.earned ? b.emoji : <Lock className="h-10 w-10 text-muted-foreground" />}</div>
                <Badge className={RARITY_COLOR[b.rarity]} variant="outline">{b.rarity}</Badge>
              </div>
              <div className="mt-3 font-semibold">{b.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{b.description}</div>
              {b.earned && b.earnedAt && (
                <div className="text-[10px] text-muted-foreground mt-2">Unlocked {new Date(b.earnedAt).toLocaleDateString()}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
