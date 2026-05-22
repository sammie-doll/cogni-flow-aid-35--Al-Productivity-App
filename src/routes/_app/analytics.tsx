import { createFileRoute } from "@tanstack/react-router";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export const Route = createFileRoute("/_app/analytics")({ component: AnalyticsPage });

const colors = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

function AnalyticsPage() {
  const trend = Array.from({ length: 14 }, (_, i) => ({ d: i + 1, score: 60 + Math.round(Math.sin(i / 2) * 10 + i) }));
  const completion = ["Mon", "Tue", "Wed", "Thu", "Fri"].map((d, i) => ({ d, done: 6 + i, missed: 5 - i > 0 ? 5 - i : 1 }));
  const saved = [
    { name: "Email", value: 4.2 }, { name: "Meetings", value: 3.1 },
    { name: "Planning", value: 2.4 }, { name: "Research", value: 1.5 }, { name: "Chat", value: 0.8 },
  ];
  const usage = ["Email", "Summarizer", "Planner", "Research", "Chat"].map((f, i) => ({ f, v: 60 - i * 8 + 10 }));
  const workload = Array.from({ length: 7 }, (_, i) => ({ d: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i], h: 4 + Math.round(Math.cos(i) * 2 + i / 2) }));

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold flex items-center gap-2"><BarChart3 className="h-6 w-6 text-primary" /> Analytics</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="glass">
          <CardHeader><CardTitle className="text-sm">Productivity trend (14d)</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="d" fontSize={11} /><YAxis fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Area dataKey="score" stroke="var(--color-chart-1)" fill="url(#ag)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader><CardTitle className="text-sm">Task completion</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completion}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="d" fontSize={11} /><YAxis fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="done" fill="var(--color-chart-3)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="missed" fill="var(--color-chart-5)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader><CardTitle className="text-sm">Time saved breakdown (h)</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={saved} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                  {saved.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader><CardTitle className="text-sm">Feature usage</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usage} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis type="number" fontSize={11} /><YAxis dataKey="f" type="category" fontSize={11} width={80} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="v" fill="var(--color-chart-2)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass md:col-span-2">
          <CardHeader><CardTitle className="text-sm">Workload distribution (hours/day)</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={workload}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="d" fontSize={11} /><YAxis fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Line dataKey="h" stroke="var(--color-chart-1)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
