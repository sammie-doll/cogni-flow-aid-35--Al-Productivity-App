import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Sparkles, Trash2 } from "lucide-react";
import { chatReply } from "@/lib/mock-ai";
import { lsGet, lsSet } from "@/lib/storage";

export const Route = createFileRoute("/_app/chat")({ component: ChatPage });

interface Msg { role: "user" | "assistant"; content: string }

const prompts = ["Plan my day", "Draft an email", "Summarise my workload", "Suggest next task", "Research a topic"];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>(() => lsGet("cogniflow.chat", [] as Msg[]));
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { lsSet("cogniflow.chat", messages); scrollRef.current?.scrollTo({ top: 9e9, behavior: "smooth" }); }, [messages]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setInput("");
    setMessages((m) => {
      const next = [...m, { role: "user" as const, content: t }];
      setTimeout(() => setMessages((cur) => [...cur, { role: "assistant", content: chatReply(t, cur) }]), 400);
      return next;
    });
  };

  return (
    <Card className="glass max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> <span className="font-semibold">AI Chat Assistant</span></div>
        <Button variant="ghost" size="sm" onClick={() => setMessages([])}><Trash2 className="h-4 w-4 mr-1" /> Clear</Button>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-10">
            Ask anything productivity-related. I can plan, summarise, draft, prioritise, brainstorm.
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${m.role === "user" ? "gradient-primary text-primary-foreground rounded-br-sm" : "bg-accent rounded-bl-sm"}`}>
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 pb-2 flex flex-wrap gap-1.5">
        {prompts.map((p) => (
          <button key={p} onClick={() => send(p)} className="text-xs px-2.5 py-1 rounded-full bg-accent/50 hover:bg-accent border border-border">
            {p}
          </button>
        ))}
      </div>
      <div className="p-3 border-t border-border flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(input)} placeholder="Message CogniFlow…" />
        <Button onClick={() => send(input)} className="gradient-primary text-primary-foreground"><Send className="h-4 w-4" /></Button>
      </div>
    </Card>
  );
}
