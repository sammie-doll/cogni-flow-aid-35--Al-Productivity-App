import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Search, Save } from "lucide-react";
import { research } from "@/lib/mock-ai";
import { saveItem } from "@/lib/storage";
import { toast } from "sonner";
import { ResponsibleNotice } from "@/components/responsible-ai";

export const Route = createFileRoute("/_app/research")({ component: ResearchPage });

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [article, setArticle] = useState("");
  const [out, setOut] = useState<ReturnType<typeof research> | null>(null);

  return (
    <div className="grid lg:grid-cols-2 gap-4 max-w-7xl mx-auto">
      <Card className="glass">
        <CardHeader><CardTitle className="flex items-center gap-2"><Search className="h-5 w-5 text-primary" /> Research Assistant</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic e.g. AI in healthcare" />
          <Textarea rows={8} value={article} onChange={(e) => setArticle(e.target.value)} placeholder="Optional: paste article text…" />
          <Button onClick={() => setOut(research(topic || "this topic"))} disabled={!topic && !article} className="gradient-primary text-primary-foreground">Research</Button>
          <ResponsibleNotice />
        </CardContent>
      </Card>
      <Card className="glass">
        <CardHeader><CardTitle>Findings</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          {!out ? (
            <div className="text-muted-foreground p-8 text-center border border-dashed rounded-xl">Findings will appear here.</div>
          ) : (
            <>
              <Section title="Summary"><p>{out.summary}</p></Section>
              <Section title="Simplified"><p className="text-muted-foreground">{out.simple}</p></Section>
              <Section title="Key insights"><ul className="list-disc pl-5 space-y-1">{out.insights.map((x, i) => <li key={i}>{x}</li>)}</ul></Section>
              <Section title="Recommendations"><ul className="list-disc pl-5 space-y-1">{out.recommendations.map((x, i) => <li key={i}>{x}</li>)}</ul></Section>
              <div className="grid grid-cols-2 gap-2">
                <Section title="Pros"><ul className="list-disc pl-5 space-y-0.5 text-success">{out.pros.map((x, i) => <li key={i} className="text-foreground">{x}</li>)}</ul></Section>
                <Section title="Cons"><ul className="list-disc pl-5 space-y-0.5 text-destructive">{out.cons.map((x, i) => <li key={i} className="text-foreground">{x}</li>)}</ul></Section>
              </div>
              <Section title="Sources"><ul className="text-xs space-y-1">{out.sources.map((s, i) => <li key={i}>• <a href={s.url} className="text-primary hover:underline">{s.title}</a></li>)}</ul></Section>
              <Button variant="outline" onClick={() => { saveItem({ type: "research", title: topic || "Research", content: JSON.stringify(out, null, 2) }); toast.success("Saved"); }}>
                <Save className="h-4 w-4 mr-1" /> Save
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="font-semibold mb-1">{title}</div>
      {children}
    </section>
  );
}
