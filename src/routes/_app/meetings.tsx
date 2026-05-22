import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Copy, Save, Download } from "lucide-react";
import { summarizeMeeting } from "@/lib/mock-ai";
import { saveItem } from "@/lib/storage";
import { toast } from "sonner";
import { ResponsibleNotice } from "@/components/responsible-ai";

export const Route = createFileRoute("/_app/meetings")({ component: MeetingsPage });

function MeetingsPage() {
  const [notes, setNotes] = useState("");
  const [out, setOut] = useState<ReturnType<typeof summarizeMeeting> | null>(null);

  const exportPdf = () => {
    if (!out) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<pre style="font-family:system-ui;padding:24px">${JSON.stringify(out, null, 2)}</pre>`);
    w.document.title = "Meeting Summary";
    w.print();
  };

  return (
    <div className="grid lg:grid-cols-2 gap-4 max-w-7xl mx-auto">
      <Card className="glass">
        <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Meeting Summarizer</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Textarea rows={14} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Paste meeting notes here…" />
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setOut(summarizeMeeting(notes))} className="gradient-primary text-primary-foreground">Summarize</Button>
            <Button variant="ghost" onClick={() => { setNotes(""); setOut(null); }}>Clear</Button>
          </div>
          <ResponsibleNotice />
        </CardContent>
      </Card>
      <Card className="glass">
        <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          {!out ? (
            <div className="text-muted-foreground p-8 text-center border border-dashed rounded-xl">Summary will appear here.</div>
          ) : (
            <>
              <section>
                <div className="font-semibold mb-1">Summary</div>
                <p className="text-muted-foreground">{out.summary}</p>
              </section>
              <section>
                <div className="font-semibold mb-1">Key points</div>
                <ul className="list-disc pl-5 space-y-1">{out.keyPoints.map((k, i) => <li key={i}>{k}</li>)}</ul>
              </section>
              <section>
                <div className="font-semibold mb-1">Decisions</div>
                <ul className="list-disc pl-5 space-y-1">{out.decisions.map((d, i) => <li key={i}>{d}</li>)}</ul>
              </section>
              <section>
                <div className="font-semibold mb-1">Action items</div>
                <div className="space-y-2">
                  {out.actionItems.map((a, i) => (
                    <div key={i} className="p-2 rounded-lg bg-accent/30 flex flex-wrap items-center gap-2">
                      <span className="flex-1">{a.task}</span>
                      <Badge variant="secondary">{a.owner}</Badge>
                      <Badge variant="outline">Due: {a.due}</Badge>
                    </div>
                  ))}
                </div>
              </section>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button variant="outline" onClick={() => { navigator.clipboard.writeText(JSON.stringify(out, null, 2)); toast.success("Copied"); }}><Copy className="h-4 w-4 mr-1" /> Copy</Button>
                <Button variant="outline" onClick={() => { saveItem({ type: "summary", title: "Meeting summary", content: JSON.stringify(out, null, 2) }); toast.success("Saved"); }}><Save className="h-4 w-4 mr-1" /> Save</Button>
                <Button variant="outline" onClick={exportPdf}><Download className="h-4 w-4 mr-1" /> Export PDF</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
