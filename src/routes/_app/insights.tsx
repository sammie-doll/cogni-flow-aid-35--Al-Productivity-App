import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShareDialog } from "@/components/share-dialog";
import { ensureDemoSeed, dailySeries, rangeMinutes, topicBreakdown } from "@/lib/knowledge-minutes";
import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { Calendar, Sparkles, TrendingUp, Brain, Target, Share2 } from "lucide-react";

export const Route = createFileRoute("/_app/insights")({ component: InsightsPage });

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function InsightsPage() {
  const [month, setMonth] = useState(new Date().getMonth());

  useEffect(() => { ensureDemoSeed(); }, []);

  const daily = useMemo(() => dailySeries(30), []);
  const topics = useMemo(() => topicBreakdown(30), []);
  const total = rangeMinutes(30);
  const weekly = rangeMinutes(7);
  const today = rangeMinutes(1);

  const strongest = topics[0]?.topic || "—";
  const weakest = topics[topics.length - 1]?.topic || "—";

  const heatmap = useMemo(() => {
    const days = 35;
    const arr: { d: string; v: number }[] = [];
    const map = new Map(daily.map((x) => [x.date, x.minutes]));
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(Date.now() - i * 86400000);
      const k = date.toISOString().slice(5, 10);
      arr.push({ d: k, v: map.get(k) || 0 });
    }
    return arr;
  }, [daily]);
  const maxH = Math.max(1, ...heatmap.map((x) => x.v));

  const summary = `This month you logged ${total} knowledge minutes across ${topics.length} topics. ` +
    `Your strongest area is ${strongest} — keep that momentum. ` +
    `${weakest && weakest !== strongest ? `Consider giving ${weakest} extra attention next week.` : ""} ` +
    `You averaged ${(total / 30).toFixed(1)} min/day; aim for consistent short sessions over long sprints.`;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Calendar className="h-6 w-6 text-primary" /> Monthly Knowledge Insights</h1>
        <div className="flex items-center gap-2">
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="h-9 rounded-md border bg-background px-2 text-sm">
            {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
          <ShareDialog
            trigger={<Button size="sm" variant="outline" className="gap-2"><Share2 className="h-4 w-4" /> Share insights</Button>}
            title="My monthly learning insights"
            text={summary}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard icon={<Sparkles className="h-4 w-4" />} label="Today" value={`${today} min`} hint="Knowledge minutes" />
        <StatCard icon={<TrendingUp className="h-4 w-4" />} label="This week" value={`${weekly} min`} hint="Last 7 days" />
        <StatCard icon={<Brain className="h-4 w-4" />} label="This month" value={`${total} min`} hint="Last 30 days" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="glass">
          <CardHeader><CardTitle className="text-sm">Daily learning trend</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={daily}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="minutes" stroke="var(--primary)" fill="url(#g1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader><CardTitle className="text-sm">Topic distribution</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topics}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="topic" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="minutes" radius={[6,6,0,0]}>
                  {topics.map((_, i) => <Cell key={i} fill={`var(--chart-${(i % 5) + 1})`} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="glass">
        <CardHeader><CardTitle className="text-sm">Consistency heatmap</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1.5">
            {heatmap.map((c, i) => {
              const intensity = c.v / maxH;
              return (
                <div key={i} title={`${c.d}: ${c.v} min`}
                  className="aspect-square rounded-md transition-transform hover:scale-110"
                  style={{ background: c.v ? `color-mix(in oklab, var(--primary) ${intensity * 80 + 12}%, transparent)` : "var(--muted)" }} />
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <InsightCard icon="🏆" title="Strongest category" body={strongest} />
        <InsightCard icon="🎯" title="Needs attention" body={weakest} />
        <InsightCard icon="🧠" title="Most studied" body={`${total} minutes total`} />
      </div>

      <Card className="glass border-primary/30">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2"><Target className="h-4 w-4 text-primary" /> AI Monthly Progress Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{summary}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: string; hint: string }) {
  return (
    <Card className="glass hover-scale">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">{icon} {label}</div>
        <div className="text-2xl font-bold mt-1">{value}</div>
        <div className="text-[10px] text-muted-foreground">{hint}</div>
      </CardContent>
    </Card>
  );
}
function InsightCard({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <Card className="glass">
      <CardContent className="p-4">
        <div className="text-2xl">{icon}</div>
        <div className="text-xs text-muted-foreground mt-1">{title}</div>
        <div className="text-sm font-semibold">{body}</div>
      </CardContent>
    </Card>
  );
}
