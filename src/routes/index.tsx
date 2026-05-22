import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Sparkles, ArrowRight, Mail, FileText, ListChecks, Search, MessageSquare, BarChart3, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const { isAuthenticated, ready } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (ready && isAuthenticated) navigate({ to: "/dashboard" });
  }, [ready, isAuthenticated, navigate]);

  const features = [
    { icon: Mail, title: "Smart Email Generator", desc: "Draft tone-perfect emails in seconds." },
    { icon: FileText, title: "Meeting Summarizer", desc: "Turn notes into summaries, decisions & actions." },
    { icon: ListChecks, title: "AI Task Planner", desc: "Time-blocked daily and weekly plans." },
    { icon: Search, title: "Research Assistant", desc: "Summaries, insights, pros & cons." },
    { icon: MessageSquare, title: "AI Chat Assistant", desc: "Brainstorm, rewrite, prioritise." },
    { icon: BarChart3, title: "Analytics & Reports", desc: "Track productivity & time saved." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-semibold">CogniFlow</div>
            <div className="text-[11px] text-muted-foreground -mt-0.5">AI Workspace</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost"><Link to="/login">Log in</Link></Button>
          <Button asChild className="gradient-primary text-primary-foreground"><Link to="/signup">Get started</Link></Button>
        </div>
      </header>

      <section className="px-6 pt-16 pb-24 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs mb-6">
          <Sparkles className="h-3 w-3 text-primary" /> AI-powered productivity, ready to demo
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Your intelligent productivity <span className="text-gradient">assistant</span> for smarter work.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          Automate emails, summarise meetings, plan your day, run research, and chat with AI — all in one polished workspace.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="gradient-primary text-primary-foreground shadow-glow">
            <Link to="/signup">Start free <ArrowRight className="h-4 w-4 ml-1" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/login">Try demo mode</Link>
          </Button>
        </div>
        <div className="mt-4 text-xs text-muted-foreground flex items-center justify-center gap-1">
          <Shield className="h-3 w-3" /> Responsible AI — outputs to verify, never to replace your judgement.
        </div>
      </section>

      <section className="px-6 pb-24 max-w-6xl mx-auto grid md:grid-cols-3 gap-4">
        {features.map((f) => (
          <div key={f.title} className="rounded-2xl glass p-6 shadow-soft hover:shadow-glow transition">
            <div className="h-10 w-10 rounded-lg gradient-accent flex items-center justify-center mb-3">
              <f.icon className="h-5 w-5 text-white" />
            </div>
            <div className="font-semibold">{f.title}</div>
            <div className="text-sm text-muted-foreground mt-1">{f.desc}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
