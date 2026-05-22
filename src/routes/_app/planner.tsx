import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ListChecks, Play, Pause, RotateCcw, Plus, Trash2, AlertTriangle } from "lucide-react";
import { planTasks, type TaskInput } from "@/lib/mock-ai";
import { lsGet, lsSet, saveItem } from "@/lib/storage";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/planner")({ component: PlannerPage });

interface Task extends TaskInput { id: string }

function PlannerPage() {
  const [tasks, setTasks] = useState<Task[]>(() => lsGet("cogniflow.tasks", [] as Task[]));
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskInput["priority"]>("medium");
  const [estMins, setEstMins] = useState(30);
  const [plan, setPlan] = useState<ReturnType<typeof planTasks> | null>(null);

  useEffect(() => { lsSet("cogniflow.tasks", tasks); }, [tasks]);

  const add = () => {
    if (!title) return;
    setTasks((t) => [...t, { id: crypto.randomUUID(), title, priority, estMins }]);
    setTitle("");
  };

  const remove = (id: string) => setTasks((t) => t.filter((x) => x.id !== id));

  return (
    <div className="grid lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
      <Card className="glass lg:col-span-1">
        <CardHeader><CardTitle className="flex items-center gap-2"><ListChecks className="h-5 w-5 text-primary" /> Tasks</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" />
            <div className="grid grid-cols-2 gap-2">
              <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["urgent", "high", "medium", "low"].map((p) => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input type="number" min={5} max={480} value={estMins} onChange={(e) => setEstMins(Number(e.target.value))} />
            </div>
            <Button onClick={add} className="w-full"><Plus className="h-4 w-4 mr-1" /> Add task</Button>
          </div>
          <div className="space-y-1">
            {tasks.map((t) => (
              <div key={t.id} className="flex items-center gap-2 p-2 rounded-lg bg-accent/30 text-sm">
                <Badge variant={t.priority === "urgent" || t.priority === "high" ? "destructive" : "secondary"} className="capitalize">{t.priority}</Badge>
                <span className="flex-1 truncate">{t.title}</span>
                <span className="text-xs text-muted-foreground">{t.estMins}m</span>
                <button onClick={() => remove(t.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            ))}
            {tasks.length === 0 && <div className="text-xs text-muted-foreground text-center py-3">No tasks yet.</div>}
          </div>
          <Button
            onClick={() => { const p = planTasks(tasks); setPlan(p); saveItem({ type: "plan", title: "Daily plan", content: JSON.stringify(p, null, 2) }); toast.success("Plan generated & saved"); }}
            disabled={!tasks.length}
            className="w-full gradient-primary text-primary-foreground"
          >
            Generate AI plan
          </Button>
        </CardContent>
      </Card>

      <div className="lg:col-span-2 space-y-4">
        {plan && (
          <>
            <Card className="glass">
              <CardHeader><CardTitle className="text-sm">Time-blocked schedule</CardTitle></CardHeader>
              <CardContent className="space-y-1">
                {plan.blocks.map((b, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-accent/30 text-sm">
                    <div className="font-mono text-primary w-14">{b.time}</div>
                    <div className="flex-1">{b.task}</div>
                    <Badge variant="outline">{b.mins}m</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <Card className="glass"><CardHeader><CardTitle className="text-sm">Suggested next</CardTitle></CardHeader><CardContent>{plan.next}</CardContent></Card>
              <Card className="glass"><CardHeader><CardTitle className="text-sm">Workload</CardTitle></CardHeader><CardContent>
                {plan.workloadWarning ? <span className="text-destructive flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> {plan.workloadWarning}</span> : "Workload looks healthy."}
              </CardContent></Card>
            </div>
            <Card className="glass">
              <CardHeader><CardTitle className="text-sm">Urgency × Importance matrix</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-2 text-xs">
                {[
                  ["Do now (urgent+important)", plan.matrix.urgentImportant],
                  ["Schedule (important)", plan.matrix.important],
                  ["Delegate (urgent)", plan.matrix.delegate],
                  ["Drop / later", plan.matrix.schedule],
                ].map(([label, items]: any) => (
                  <div key={label} className="p-3 rounded-lg bg-accent/30 min-h-[80px]">
                    <div className="font-semibold mb-1">{label}</div>
                    <ul className="space-y-0.5">{(items as Task[]).map((t) => <li key={t.id}>• {t.title}</li>)}</ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
        <FocusTimer />
      </div>
    </div>
  );
}

function FocusTimer() {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const i = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : (setRunning(false), toast.success("Focus session done!"), 0))), 1000);
    return () => clearInterval(i);
  }, [running]);
  const m = Math.floor(seconds / 60), s = seconds % 60;
  return (
    <Card className="glass">
      <CardHeader><CardTitle className="text-sm">Pomodoro / Focus timer</CardTitle></CardHeader>
      <CardContent className="flex items-center gap-4">
        <div className="text-4xl font-bold font-mono text-gradient">{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}</div>
        <Button onClick={() => setRunning((r) => !r)} variant="outline">{running ? <><Pause className="h-4 w-4 mr-1" /> Pause</> : <><Play className="h-4 w-4 mr-1" /> Start</>}</Button>
        <Button onClick={() => { setRunning(false); setSeconds(25 * 60); }} variant="ghost"><RotateCcw className="h-4 w-4 mr-1" /> Reset</Button>
      </CardContent>
    </Card>
  );
}
