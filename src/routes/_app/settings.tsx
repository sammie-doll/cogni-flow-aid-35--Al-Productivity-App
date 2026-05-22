import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { clearSaved } from "@/lib/storage";
import { toast } from "sonner";
import { Settings as SettingsIcon, LogOut, Trash2 } from "lucide-react";
import { ResponsibleAIDialog } from "@/components/responsible-ai";

export const Route = createFileRoute("/_app/settings")({ component: SettingsPage });

function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold flex items-center gap-2"><SettingsIcon className="h-6 w-6 text-primary" /> Settings</h1>

      <Card className="glass">
        <CardHeader><CardTitle className="text-sm">Profile</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1"><Label>Name</Label><Input defaultValue={user?.name} /></div>
          <div className="space-y-1"><Label>Email</Label><Input defaultValue={user?.email} /></div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader><CardTitle className="text-sm">Preferences</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Row label="Dark mode" desc="Switch the workspace appearance.">
            <Switch checked={theme === "dark"} onCheckedChange={(v) => setTheme(v ? "dark" : "light")} />
          </Row>
          <Row label="Email notifications" desc="Daily AI productivity summary."><Switch defaultChecked /></Row>
          <Row label="In-app suggestions" desc="Show AI suggestion chips."><Switch defaultChecked /></Row>
          <Row label="Concise AI replies" desc="Prefer shorter outputs by default."><Switch /></Row>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader><CardTitle className="text-sm">Data & privacy</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-muted-foreground">Your generated content is stored locally in your browser.</p>
          <div className="flex gap-2 flex-wrap">
            <ResponsibleAIDialog>
              <Button variant="outline">View Responsible AI notice</Button>
            </ResponsibleAIDialog>
            <Button variant="outline" onClick={() => { clearSaved(); toast.success("Saved work cleared"); }}><Trash2 className="h-4 w-4 mr-1" /> Clear saved work</Button>
            <Button variant="destructive" onClick={() => { clearSaved(); logout(); navigate({ to: "/" }); toast.success("Account deleted (demo)"); }}>Delete account</Button>
            <Button variant="ghost" onClick={() => { logout(); navigate({ to: "/login" }); }}><LogOut className="h-4 w-4 mr-1" /> Log out</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-accent/30">
      <div>
        <div className="font-medium text-sm">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      {children}
    </div>
  );
}
