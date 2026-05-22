import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const quick = ["I need help", "How do I use the AI planner?", "Contact support", "Report a problem"];

export function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ from: "user" | "bot"; text: string }[]>([
    { from: "bot", text: "Hi! I'm CogniFlow Support. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          from: "bot",
          text: "Thanks for reaching out! Our team typically responds within a few minutes. You can also tap “Chat on WhatsApp” to continue there.",
        },
      ]);
    }, 600);
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl glass shadow-soft overflow-hidden flex flex-col">
          <div className="px-4 py-3 gradient-primary text-primary-foreground flex items-center justify-between">
            <div>
              <div className="font-semibold text-sm">CogniFlow Support</div>
              <div className="text-[11px] opacity-80">Typically replies in minutes</div>
            </div>
            <button onClick={() => setOpen(false)} className="opacity-80 hover:opacity-100">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-3 max-h-72 overflow-y-auto space-y-2 bg-background/40">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    m.from === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="px-3 pb-2 flex flex-wrap gap-1">
            {quick.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="text-[11px] px-2 py-1 rounded-full border border-border hover:bg-accent transition"
              >
                {q}
              </button>
            ))}
          </div>
          <div className="p-2 border-t border-border flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Type a message…"
              className="h-9"
            />
            <Button size="icon" className="h-9 w-9" onClick={() => send(input)}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <a
            href="https://wa.me/15551234567"
            target="_blank"
            rel="noreferrer"
            onClick={() => toast.success("Opening WhatsApp…")}
            className="block text-center text-sm font-medium py-2 bg-[oklch(0.7_0.18_155)] text-white hover:opacity-90"
          >
            Chat on WhatsApp
          </a>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[oklch(0.7_0.18_155)] text-white flex items-center justify-center shadow-glow hover:scale-105 transition"
        aria-label="Open support chat"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </>
  );
}
