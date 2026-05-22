import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const { login, loginGoogle, loginDemo } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Enter email and password");
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate({ to: "/dashboard" });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-between p-10 gradient-primary text-primary-foreground">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-white/15 flex items-center justify-center">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-semibold">CogniFlow</span>
        </Link>
        <div>
          <h2 className="text-3xl font-bold">Smarter work, on autopilot.</h2>
          <p className="mt-2 opacity-90 max-w-sm">
            Plan, draft, summarise, and research — your AI workspace is ready.
          </p>
        </div>
        <div className="text-xs opacity-80">© CogniFlow AI Workspace</div>
      </div>
      <div className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-sm space-y-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Log in to your workspace</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2"><Checkbox /> Remember me</label>
            <Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
          </div>
          <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground shadow-glow">
            {loading ? "Signing in…" : "Sign in"}
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={async () => { await loginGoogle(); toast.success("Signed in with Google"); navigate({ to: "/dashboard" }); }}>
            Continue with Google
          </Button>
          <Button type="button" variant="ghost" className="w-full" onClick={async () => { await loginDemo(); toast.success("Demo mode"); navigate({ to: "/dashboard" }); }}>
            Try demo mode
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            New here? <Link to="/signup" className="text-primary hover:underline">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
