import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateEmail } from "@/lib/mock-ai";
import { saveItem } from "@/lib/storage";
import { toast } from "sonner";
import { Mail, Copy, RefreshCw, Save, Trash2 } from "lucide-react";
import { ResponsibleNotice } from "@/components/responsible-ai";

export const Route = createFileRoute("/_app/email")({ component: EmailPage });

function EmailPage() {
  const [tone, setTone] = useState("professional");
  const [audience, setAudience] = useState("client");
  const [purpose, setPurpose] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [length, setLength] = useState<"short" | "medium" | "detailed">("medium");
  const [out, setOut] = useState<{ subject: string; body: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!purpose) return toast.error("Add a purpose / subject");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setOut(generateEmail({ tone, audience, purpose, keyPoints, length }));
    setLoading(false);
  };

  const prompt = `Write a ${length} ${tone} email to a ${audience} about: ${purpose}. Key points: ${keyPoints || "(none)"}`;

  return (
    <div className="grid lg:grid-cols-2 gap-4 max-w-7xl mx-auto">
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5 text-primary" /> Smart Email Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["formal", "professional", "friendly", "persuasive", "apologetic"].map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["client", "manager", "team", "recruiter", "customer"].map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Purpose / subject</Label>
            <Input value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="e.g. Project status update" />
          </div>
          <div className="space-y-1.5">
            <Label>Key points (one per line)</Label>
            <Textarea rows={5} value={keyPoints} onChange={(e) => setKeyPoints(e.target.value)} placeholder="Milestones hit&#10;Blockers&#10;Next steps" />
          </div>
          <div className="space-y-1.5">
            <Label>Length</Label>
            <Select value={length} onValueChange={(v) => setLength(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="detailed">Detailed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={run} disabled={loading} className="gradient-primary text-primary-foreground">
              {loading ? "Generating…" : "Generate Email"}
            </Button>
            <Button variant="outline" onClick={run} disabled={loading}><RefreshCw className="h-4 w-4 mr-1" /> Regenerate</Button>
            <Button variant="ghost" onClick={() => { setPurpose(""); setKeyPoints(""); setOut(null); }}>
              <Trash2 className="h-4 w-4 mr-1" /> Clear
            </Button>
          </div>
          <div className="text-xs text-muted-foreground p-2 rounded-lg bg-accent/40">
            <span className="font-medium">Prompt:</span> {prompt}
          </div>
          <ResponsibleNotice />
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader><CardTitle>Generated Email</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {!out ? (
            <div className="text-sm text-muted-foreground p-8 text-center border border-dashed border-border rounded-xl">
              Your email will appear here.
            </div>
          ) : (
            <>
              <div>
                <Label className="text-xs">Subject</Label>
                <div className="font-medium">{out.subject}</div>
              </div>
              <div>
                <Label className="text-xs">Body</Label>
                <pre className="whitespace-pre-wrap text-sm bg-accent/30 p-3 rounded-lg font-sans">{out.body}</pre>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => { navigator.clipboard.writeText(`${out.subject}\n\n${out.body}`); toast.success("Copied"); }}>
                  <Copy className="h-4 w-4 mr-1" /> Copy
                </Button>
                <Button variant="outline" onClick={() => { saveItem({ type: "email", title: out.subject, content: out.body }); toast.success("Saved"); }}>
                  <Save className="h-4 w-4 mr-1" /> Save
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
