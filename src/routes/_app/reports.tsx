import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileBarChart, Download, Sparkles, Save } from "lucide-react";
import { generateWeeklyReport } from "@/lib/mock-ai";
import { saveItem } from "@/lib/storage";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/reports")({ component: ReportsPage });

function ReportsPage() {
  const [r, setR] = useState<ReturnType<typeof generateWeeklyReport> | null>(null);

  const exportPdf = () => {
    if (!r) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>Weekly Report</title></head><body style="font-family:system-ui;padding:24px;max-width:720px;margin:auto"><h1>CogniFlow Weekly Report</h1><pre>${JSON.stringify(r, null, 2)}</pre></body></html>`);
    w.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <Card className="glass">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2"><FileBarChart className="h-5 w-5 text-primary" /> Weekly Productivity Report</CardTitle>
          <div className="flex gap-2">
            <Button onClick={() => setR(generateWeeklyReport())} className="gradient-primary text-primary-foreground"><Sparkles className="h-4 w-4 mr-1" /> Generate</Button>
            {r && <Button variant="outline" onClick={exportPdf}><Download className="h-4 w-4 mr-1" /> Export PDF</Button>}
            {r && <Button variant="outline" onClick={() => { saveItem({ type: "report", title: "Weekly report", content: JSON.stringify(r, null, 2) }); toast.success("Saved"); }}><Save className="h-4 w-4 mr-1" /> Save</Button>}
          </div>
        </CardHeader>
        {r && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
              {[
                { l: "Tasks completed", v: r.tasksCompleted },
                { l: "Emails generated", v: r.emailsGenerated },
                { l: "Meetings summarised", v: r.meetingsSummarized },
                { l: "Hours saved", v: r.hoursSaved },
                { l: "Productivity", v: `${r.productivityScore}%` },
              ].map((s) => (
                <div key={s.l} className="p-4 rounded-xl bg-accent/40">
                  <div className="text-xs text-muted-foreground">{s.l}</div>
                  <div className="text-2xl font-bold">{s.v}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="font-semibold mb-2 text-sm">AI usage breakdown</div>
              <div className="space-y-2">
                {r.breakdown.map((b) => (
                  <div key={b.feature}>
                    <div className="flex justify-between text-xs"><span>{b.feature}</span><span>{b.pct}%</span></div>
                    <Progress value={b.pct} />
                  </div>
                ))}
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-3 text-sm">
              <Section title="Strengths" items={r.strengths} variant="secondary" />
              <Section title="Areas to improve" items={r.improvements} variant="outline" />
              <Section title="Next week" items={r.nextWeek} variant="default" />
            </div>
          </CardContent>
        )}
        {!r && <CardContent className="text-sm text-muted-foreground p-10 text-center">Click Generate to create this week's report.</CardContent>}
      </Card>
    </div>
  );
}

function Section({ title, items, variant }: { title: string; items: string[]; variant: any }) {
  return (
    <div className="p-3 rounded-xl bg-accent/30 space-y-2">
      <div className="font-semibold">{title}</div>
      {items.map((t, i) => <Badge key={i} variant={variant} className="mr-1 mb-1">{t}</Badge>)}
    </div>
  );
}
