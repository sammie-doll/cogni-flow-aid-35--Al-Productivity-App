import type { ReactNode } from "react";
import { Shield } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription,
} from "@/components/ui/dialog";

export function ResponsibleAIDialog({ children }: { children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" /> Responsible AI Use
          </DialogTitle>
          <DialogDescription>
            CogniFlow is designed to support, not replace, human judgement.
          </DialogDescription>
        </DialogHeader>
        <ul className="space-y-2 text-sm text-foreground/90">
          <li>• AI outputs may be inaccurate or incomplete — always verify important information.</li>
          <li>• Do not enter sensitive, confidential, or regulated data into prompts.</li>
          <li>• Use AI to assist with judgement; final decisions should be made by people.</li>
          <li>• Be aware of potential bias and limitations in generated content.</li>
          <li>• Review and edit suggestions before sending or sharing externally.</li>
        </ul>
      </DialogContent>
    </Dialog>
  );
}

export function ResponsibleNotice({ className = "" }: { className?: string }) {
  return (
    <div className={`text-xs text-muted-foreground flex items-start gap-2 ${className}`}>
      <Shield className="h-3.5 w-3.5 mt-0.5 shrink-0" />
      <span>
        AI-generated. Review for accuracy before sharing. Avoid entering confidential data.
      </span>
    </div>
  );
}
