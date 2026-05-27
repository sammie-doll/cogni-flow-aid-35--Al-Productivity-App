import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useMood, MOODS } from "@/lib/mood";
import { recomputeBadges, currentLearningStreak } from "@/lib/achievements";
import { rangeMinutes, ensureDemoSeed, topicBreakdown } from "@/lib/knowledge-minutes";
import { ShareDialog } from "@/components/share-dialog";
import { getSaved } from "@/lib/storage";
import { useEffect, useMemo, useState } from "react";
import { Share2, Pencil, Sparkles, Flame, Clock, BookMarked } from "lucide-react";

export const Route = createFileRoute("/_app/profile")({ component: ProfilePage });

function ProfilePage() {
  const { user } = useAuth();
  const { meta } = useMood();
  const [bio, setBio] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    ensureDemoSeed();
    setBio(localStorage.getItem("cogniflow.bio") || "Lifelong learner curating a personal knowledge base ✨");
  }, []);

  const badges = useMemo(() => recomputeBadges(), []);
  const streak = currentLearningStreak();
  const minutes30 = rangeMinutes(30);
  const topics = topicBreakdown(60).slice(0, 5);
  const saved = getSaved();
  const earned = badges.filter((b) => b.earned);

  const initials = (user?.name || "U").split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Banner */}
      <div className="relative h-44 rounded-2xl overflow-hidden glass shadow-glow">
        <div className="absolute inset-0 gradient-accent opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_60%)]" />
        <div className="absolute bottom-3 right-3">
          <ShareDialog
            trigger={<Button size="sm" variant="secondary" className="gap-2"><Share2 className="h-4 w-4" /> Share profile</Button>}
            title={`${user?.name || "My"} • CogniFlow profile`}
            text={`Check out my learning profile on CogniFlow — streak: ${streak} days, ${minutes30} knowledge minutes this month.`}
          />
        </div>
      </div>

      {/* Identity */}
      <div className="-mt-16 px-4 flex flex-col md:flex-row md:items-end gap-4">
        <div className="h-28 w-28 rounded-2xl gradient-primary flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-glow border-4 border-background">
          {initials}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{user?.name}</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <div className="mt-1 flex flex-wrap gap-2 items-center">
            <Badge variant="secondary" className="gap-1">{meta.emoji} {meta.label}</Badge>
            <Badge variant="outline" className="gap-1"><Flame className="h-3 w-3 text-orange-500" /> {streak}-day streak</Badge>
            <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3 text-primary" /> {minutes30} min this month</Badge>
          </div>
        </div>
      </div>

      {/* Bio */}
      <Card className="glass">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> About</CardTitle>
          <Button size="sm" variant="ghost" onClick={() => {
            if (editing) localStorage.setItem("cogniflow.bio", bio);
            setEditing(!editing);
          }}>
            <Pencil className="h-3 w-3 mr-1" /> {editing ? "Save" : "Edit"}
          </Button>
        </CardHeader>
        <CardContent>
          {editing ? (
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full text-sm bg-transparent border rounded-md p-2" rows={3} />
          ) : (
            <p className="text-sm">{bio}</p>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="glass">
          <CardHeader><CardTitle className="text-sm">Learning Stats</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Stat label="Knowledge minutes (30d)" value={`${minutes30} min`} />
            <Stat label="Current streak" value={`${streak} days`} />
            <Stat label="Saved items" value={`${saved.length}`} />
            <Stat label="Badges earned" value={`${earned.length}/${badges.length}`} />
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><BookMarked className="h-4 w-4 text-primary" /> Favorite Topics</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {topics.length === 0 && <p className="text-xs text-muted-foreground">No data yet — start learning!</p>}
            {topics.map((t) => (
              <div key={t.topic}>
                <div className="flex justify-between text-xs"><span>{t.topic}</span><span className="text-muted-foreground">{t.minutes} min</span></div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full gradient-primary" style={{ width: `${Math.min(100, (t.minutes / (topics[0]?.minutes || 1)) * 100)}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader><CardTitle className="text-sm">Mood Showcase</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-4 gap-2">
            {MOODS.slice(0, 8).map((m) => (
              <div key={m.id} className="aspect-square rounded-lg bg-accent/40 flex items-center justify-center text-xl">{m.emoji}</div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="glass">
        <CardHeader><CardTitle className="text-sm">Achievement Showcase</CardTitle></CardHeader>
        <CardContent>
          {earned.length === 0 ? (
            <p className="text-sm text-muted-foreground">No badges yet — keep learning to unlock your first one.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {earned.map((b) => (
                <div key={b.id} className="glass p-3 rounded-xl text-center hover-scale">
                  <div className="text-3xl">{b.emoji}</div>
                  <div className="text-sm font-medium mt-1">{b.name}</div>
                  <div className="text-[10px] text-muted-foreground">{b.rarity}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between p-2 rounded-md bg-accent/30">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
