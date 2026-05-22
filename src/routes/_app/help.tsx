import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LifeBuoy, MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/help")({ component: HelpPage });

const faqs = [
  { q: "How do I generate an email?", a: "Open Smart Email, pick tone & audience, add a purpose and key points, then click Generate Email." },
  { q: "Where are my saved items?", a: "Anything you click Save on appears in Documents and Saved Work." },
  { q: "Can I export reports?", a: "Yes — Weekly Reports has an Export PDF button that opens a print-ready view." },
  { q: "Is my data safe?", a: "Demo content is stored locally in your browser. Don't enter sensitive information." },
  { q: "How does the AI planner work?", a: "Add tasks with priority and time estimate; the planner builds a time-blocked schedule and urgency/importance matrix." },
];

function HelpPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold flex items-center gap-2"><LifeBuoy className="h-6 w-6 text-primary" /> Help & Support</h1>

      <Card className="glass">
        <CardHeader><CardTitle className="text-sm">FAQ</CardTitle></CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={String(i)}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader><CardTitle className="text-sm">Contact</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline"><Mail className="h-4 w-4 mr-1" /> support@cogniflow.ai</Button>
          <Button variant="outline" asChild><a href="https://wa.me/15551234567" target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4 mr-1" /> Chat on WhatsApp</a></Button>
        </CardContent>
      </Card>
    </div>
  );
}
