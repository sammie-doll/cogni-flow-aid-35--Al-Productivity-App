import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid,
} from "recharts";
import {
  Sparkles, Mail, FileText, ListChecks, Search, MessageSquare, Clock,
  TrendingUp, Flame, CheckCircle2, AlertTriangle, Users, Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/dashboard")({ component: Dashboard });

const suggestions = [
  "Plan my day", "Prioritize my tasks", "What's due today?", "Create study schedule",
  "Summarize my workload", "Suggest next task", "Start focus session", "Generate weekly goals",
  "Review my progress", "Organize my tasks", "Draft an email", "Summarize meeting notes",
  "Research a topic", "Export weekly report",
];

const quickAccess = [
  { title: "Draft Email", icon: Mail, to: "/email", color: "from-violet-500 to-fuchsia-500" },
  { title: "Summarize Meeting", icon: FileText, to: "/meetings", color: "from-sky-500 to-cyan-500" },
  { title: "Plan Tasks", icon: ListChecks, to: "/planner", color: "from-emerald-500 to-teal-500" },
  { title: "Research", icon: Search, to: "/research", color: "from-amber-500 to-orange-500" },
  { title: "AI Chat", icon: MessageSquare, to: "/chat", color: "from-pink-500 to-rose-500" },
];

function Dashboard() {
  const { user } = useAuth();
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {greeting}, <span className="text-gradient">{user?.name?.split(" ")[0]}</span> 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Here's your AI-powered workspace today.</p>
        </div>
        <Button onClick={() => toast.success("Sample data loaded — demo mode")} variant="outline" className="gap-2">
          <Sparkles className="h-4 w-4" /> Demo data
        </Button>
      </div>

      {/* Suggestion bar */}
      <Card className="glass">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-primary" /> AI Suggestions
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => toast.message(`Asking AI: "${s}"`)}
                className="text-xs px-3 py-1.5 rounded-full bg-accent/50 hover:bg-accent border border-border transition"
              >
                {s}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="heatmap">AI Heatmap</TabsTrigger>
          <TabsTrigger value="insights">Daily AI Insights</TabsTrigger>
          <TabsTrigger value="productivity">Productivity</TabsTrigger>
          <TabsTrigger value="shared">Shared Workspace</TabsTrigger>
          <TabsTrigger value="dataviz">Data Visualisation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <OverviewTab />
        </TabsContent>
        <TabsContent value="heatmap"><HeatmapTab /></TabsContent>
        <TabsContent value="insights"><InsightsTab /></TabsContent>
        <TabsContent value="productivity"><ProductivityTab /></TabsContent>
        <TabsContent value="shared"><SharedTab /></TabsContent>
        <TabsContent value="dataviz"><DataVizTab /></TabsContent>
      </Tabs>
    </div>
  );
}

function Stat({ icon: Icon, label, value, sub, accent = "from-violet-500 to-fuchsia-500" }: any) {
  return (
    <Card className="glass overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="text-2xl font-bold mt-1">{value}</div>
            {sub && <div className="text-[11px] text-muted-foreground mt-1">{sub}</div>}
          </div>
          <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center shadow-glow`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function OverviewTab() {
  const trend = Array.from({ length: 7 }, (_, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    score: 70 + Math.round(Math.sin(i) * 8 + i * 2),
  }));
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Stat icon={TrendingUp} label="Productivity" value="87%" sub="+12% vs last week" />
        <Stat icon={CheckCircle2} label="Tasks done" value="38" sub="this week" accent="from-emerald-500 to-teal-500" />
        <Stat icon={Clock} label="Hours saved" value="11.5" sub="via AI" accent="from-sky-500 to-cyan-500" />
        <Stat icon={Mail} label="Emails" value="22" sub="generated" accent="from-pink-500 to-rose-500" />
        <Stat icon={FileText} label="Meetings" value="6" sub="summarised" accent="from-amber-500 to-orange-500" />
        <Stat icon={Search} label="Research" value="14" sub="requests" accent="from-indigo-500 to-blue-500" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {quickAccess.map((q) => (
          <Link key={q.to} to={q.to} className="group">
            <Card className="glass hover:shadow-glow transition h-full">
              <CardContent className="p-4 flex flex-col gap-2">
                <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${q.color} flex items-center justify-center`}>
                  <q.icon className="h-4 w-4 text-white" />
                </div>
                <div className="font-medium text-sm">{q.title}</div>
                <div className="text-[11px] text-muted-foreground">Open →</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="glass md:col-span-2">
          <CardHeader><CardTitle className="text-sm">Productivity Trend</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="day" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="score" stroke="var(--color-chart-1)" fill="url(#g1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader><CardTitle className="text-sm">Smart AI Insights</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {[
              "You're most focused 9–12am.",
              "Email drafting time down 43%.",
              "Try a 25-min focus block now.",
              "3 tasks due tomorrow — review them?",
            ].map((t, i) => (
              <div key={i} className="flex gap-2 items-start p-2 rounded-lg bg-accent/40">
                <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                <span>{t}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="glass">
          <CardHeader><CardTitle className="text-sm">Today's Overview</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span>Tasks completed</span><span className="font-semibold">6 / 9</span></div>
            <Progress value={66} />
            <div className="flex justify-between"><span>Focus time</span><span className="font-semibold">2h 45m</span></div>
            <Progress value={55} />
            <div className="flex justify-between"><span>Meetings</span><span className="font-semibold">3</span></div>
            <Progress value={40} />
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader><CardTitle className="text-sm">Upcoming tasks</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {[
              { t: "Send Q3 client update", p: "high", due: "Today 4pm" },
              { t: "Review design proposal", p: "medium", due: "Tomorrow" },
              { t: "Plan team offsite agenda", p: "medium", due: "Fri" },
              { t: "Research vendor options", p: "low", due: "Next week" },
            ].map((x, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-accent/30">
                <div>
                  <div>{x.t}</div>
                  <div className="text-[11px] text-muted-foreground">{x.due}</div>
                </div>
                <Badge variant={x.p === "high" ? "destructive" : "secondary"}>{x.p}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function HeatmapTab() {
  const hours = Array.from({ length: 12 }, (_, i) => i + 7); // 7am-6pm
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const sections = [
    { title: "Peak productivity hours", seed: 1 },
    { title: "AI usage by time of day", seed: 2 },
    { title: "Task completion patterns", seed: 3 },
    { title: "Focus time patterns", seed: 4 },
  ];
  const val = (d: number, h: number, s: number) =>
    Math.abs(Math.sin((d + 1) * (h + 1) * s * 0.37)) ;

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {sections.map((sec) => (
        <Card key={sec.title} className="glass">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">{sec.title}</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => toast.success("Exported")} className="gap-1 text-xs">
              <Download className="h-3 w-3" /> Export
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="border-separate border-spacing-1">
                <tbody>
                  {days.map((d, di) => (
                    <tr key={d}>
                      <td className="text-[10px] text-muted-foreground pr-2">{d}</td>
                      {hours.map((h) => {
                        const v = val(di, h, sec.seed);
                        return (
                          <td key={h} title={`${d} ${h}:00 — ${(v * 100).toFixed(0)}%`}>
                            <div
                              className="h-6 w-6 rounded"
                              style={{ background: `color-mix(in oklab, var(--primary) ${10 + v * 80}%, transparent)` }}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  <tr>
                    <td></td>
                    {hours.map((h) => (
                      <td key={h} className="text-[9px] text-muted-foreground text-center">{h}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function InsightsTab() {
  const insights = [
    { t: "You're most productive between 9am and 12pm.", icon: Flame },
    { t: "Email drafting time reduced by 43% this week.", icon: Mail },
    { t: "Task completion improved by 27%.", icon: CheckCircle2 },
    { t: "Research requests increased this week (+5).", icon: Search },
    { t: "Suggested focus time: 10am–12pm tomorrow.", icon: Clock },
    { t: "Workload risk: Thursday is overloaded — consider rescheduling.", icon: AlertTriangle },
  ];
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
      {insights.map((i, idx) => (
        <Card key={idx} className="glass">
          <CardContent className="p-4 flex gap-3">
            <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center shrink-0">
              <i.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="text-sm font-medium">{i.t}</div>
              <div className="text-xs text-muted-foreground mt-1">AI recommendation</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ProductivityTab() {
  const trend = Array.from({ length: 7 }, (_, i) => ({ day: i + 1, done: 4 + Math.round(Math.sin(i) * 2 + i) }));
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card className="glass md:col-span-1 space-y-2">
        <CardHeader><CardTitle className="text-sm">Productivity Score</CardTitle></CardHeader>
        <CardContent>
          <div className="text-5xl font-bold text-gradient">87</div>
          <div className="text-xs text-muted-foreground">/ 100 · this week</div>
          <div className="mt-4 space-y-3 text-sm">
            <div>Weekly goal progress<Progress className="mt-1" value={72} /></div>
            <div>Focus sessions<Progress className="mt-1" value={60} /></div>
            <div>Overdue tasks<Progress className="mt-1" value={20} /></div>
          </div>
        </CardContent>
      </Card>
      <Card className="glass md:col-span-2">
        <CardHeader><CardTitle className="text-sm">Tasks completed (7 days)</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="day" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Bar dataKey="done" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="glass md:col-span-3">
        <CardHeader><CardTitle className="text-sm">Priority breakdown</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-4 gap-3 text-sm">
          {[{ l: "Urgent", v: 3, c: "destructive" }, { l: "High", v: 7, c: "warning" }, { l: "Medium", v: 12, c: "secondary" }, { l: "Low", v: 5, c: "outline" }].map((x) => (
            <div key={x.l} className="p-4 rounded-xl bg-accent/40">
              <div className="text-xs text-muted-foreground">{x.l}</div>
              <div className="text-2xl font-bold">{x.v}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function SharedTab() {
  const members = [
    { n: "Priya Shah", r: "Designer", s: "Available" },
    { n: "Marco Liu", r: "Engineer", s: "In focus" },
    { n: "Sam Okoye", r: "PM", s: "In meeting" },
    { n: "Jordan Lee", r: "Marketing", s: "Available" },
  ];
  const projects = [
    { name: "Q3 Launch", progress: 72, owner: "Sam" },
    { name: "Onboarding Revamp", progress: 45, owner: "Priya" },
    { name: "Vendor Research", progress: 30, owner: "Jordan" },
  ];
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card className="glass md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Shared Projects</CardTitle>
          <Button size="sm" variant="outline">Share summary</Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {projects.map((p) => (
            <div key={p.name} className="p-3 rounded-xl bg-accent/30">
              <div className="flex justify-between text-sm">
                <div className="font-medium">{p.name}</div>
                <div className="text-muted-foreground">Owner: {p.owner}</div>
              </div>
              <Progress value={p.progress} className="mt-2" />
              <div className="mt-2 flex gap-2 text-xs">
                <Badge variant="secondary">3 tasks</Badge>
                <Badge variant="secondary">2 comments</Badge>
                <Badge variant="outline">AI summary</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="glass">
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Users className="h-4 w-4" /> Team availability</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {members.map((m) => (
            <div key={m.n} className="flex items-center justify-between p-2 rounded-lg bg-accent/30">
              <div>
                <div className="font-medium">{m.n}</div>
                <div className="text-xs text-muted-foreground">{m.r}</div>
              </div>
              <Badge variant={m.s === "Available" ? "secondary" : "outline"}>{m.s}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function DataVizTab() {
  const team = ["Priya", "Marco", "Sam", "Jordan", "Alex"].map((n, i) => ({ name: n, done: 8 + i * 2, pending: 5 - i }));
  const dept = [
    { name: "Eng", value: 35 }, { name: "Design", value: 22 },
    { name: "PM", value: 18 }, { name: "Marketing", value: 15 }, { name: "Ops", value: 10 },
  ];
  const colors = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];
  const trend = Array.from({ length: 8 }, (_, i) => ({ w: `W${i + 1}`, team: 60 + i * 3 + Math.round(Math.sin(i) * 5) }));
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card className="glass">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Workload distribution by member</CardTitle>
          <Button size="sm" variant="outline" onClick={() => toast.success("Exported")}><Download className="h-3 w-3 mr-1" /> Export</Button>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={team}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Bar dataKey="done" stackId="a" fill="var(--color-chart-1)" />
              <Bar dataKey="pending" stackId="a" fill="var(--color-chart-4)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader><CardTitle className="text-sm">AI usage by department</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={dept} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                {dept.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="glass md:col-span-2">
        <CardHeader><CardTitle className="text-sm">Team productivity trend</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="w" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Line type="monotone" dataKey="team" stroke="var(--color-chart-1)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="glass md:col-span-2">
        <CardHeader><CardTitle className="text-sm">Bottlenecks & time saved</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-3 text-sm">
          <div className="p-4 rounded-xl bg-accent/40">
            <div className="text-xs text-muted-foreground">Bottleneck</div>
            <div className="text-lg font-semibold">Design review</div>
            <div className="text-xs text-muted-foreground mt-1">Avg wait 2.3 days</div>
          </div>
          <div className="p-4 rounded-xl bg-accent/40">
            <div className="text-xs text-muted-foreground">Team time saved</div>
            <div className="text-lg font-semibold">47h this week</div>
          </div>
          <div className="p-4 rounded-xl bg-accent/40">
            <div className="text-xs text-muted-foreground">Pending vs completed</div>
            <div className="text-lg font-semibold">28 / 92</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
