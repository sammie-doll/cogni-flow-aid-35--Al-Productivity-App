import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({ component: SignupPage });

function SignupPage() {
  const { signup, loginGoogle } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return toast.error("Fill all fields");
    if (password.length < 6) return toast.error("Password too short");
    setLoading(true);
    try {
      await signup(name, email, password);
      toast.success("Account created!");
      navigate({ to: "/dashboard" });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl glass p-8 shadow-soft">
        <div>
          <h1 className="text-2xl font-bold">Create your workspace</h1>
          <p className="text-sm text-muted-foreground">Get started with CogniFlow</p>
        </div>
        <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="space-y-2"><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground shadow-glow">
          {loading ? "Creating…" : "Create account"}
        </Button>
        <Button type="button" variant="outline" className="w-full" onClick={async () => { await loginGoogle(); navigate({ to: "/dashboard" }); }}>
          Continue with Google
        </Button>
        <p className="text-sm text-center text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link>
        </p>
      </form>
    </div>
  );
}
