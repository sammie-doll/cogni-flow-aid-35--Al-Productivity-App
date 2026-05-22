import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Copy, Trash2, FileText } from "lucide-react";
import { deleteItem, getSaved, type SavedItem } from "@/lib/storage";
import { toast } from "sonner";

export function SavedList({ title }: { title: string }) {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [q, setQ] = useState("");
  const [type, setType] = useState<string>("all");

  const refresh = () => setItems(getSaved());
  useEffect(refresh, []);

  const filtered = items.filter((i) =>
    (type === "all" || i.type === type) &&
    (q === "" || i.title.toLowerCase().includes(q.toLowerCase()) || i.content.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> {title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["all", "email", "summary", "plan", "research", "report", "chat"].map((t) => (
                <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <Card className="glass"><CardContent className="p-10 text-center text-sm text-muted-foreground">No items yet. Generate something and click Save.</CardContent></Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {filtered.map((i) => (
            <Card key={i.id} className="glass">
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-sm">{i.title}</CardTitle>
                  <div className="text-[11px] text-muted-foreground mt-1">{new Date(i.createdAt).toLocaleString()}</div>
                </div>
                <Badge variant="secondary" className="capitalize">{i.type}</Badge>
              </CardHeader>
              <CardContent className="text-sm">
                <pre className="whitespace-pre-wrap font-sans text-xs bg-accent/30 p-3 rounded-lg max-h-40 overflow-y-auto">{i.content.slice(0, 800)}</pre>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(i.content); toast.success("Copied"); }}>
                    <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { deleteItem(i.id); refresh(); toast.success("Deleted"); }}>
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
