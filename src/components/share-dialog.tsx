import { useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { copyLink, shareUrls, nativeShare } from "@/lib/share";
import { Copy, Share2, MessageCircle, Linkedin, Twitter, Send, Mail } from "lucide-react";

export function ShareDialog({
  trigger,
  title = "Check this out",
  text = "Shared from CogniFlow",
  url,
}: {
  trigger: ReactNode;
  title?: string;
  text?: string;
  url?: string;
}) {
  const [open, setOpen] = useState(false);
  const targetUrl = url || (typeof location !== "undefined" ? location.href : "");
  const links = shareUrls({ title, text, url: targetUrl });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="glass">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Share2 className="h-4 w-4 text-primary" /> Share</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Title</Label>
            <Input defaultValue={title} readOnly />
          </div>
          <div className="space-y-1">
            <Label>Message</Label>
            <Textarea defaultValue={text} readOnly rows={3} />
          </div>
          <div className="flex items-center gap-2">
            <Input value={targetUrl} readOnly />
            <Button size="icon" variant="outline" onClick={() => copyLink(targetUrl)} aria-label="Copy link"><Copy className="h-4 w-4" /></Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <a href={links.whatsapp} target="_blank" rel="noreferrer"><Button variant="outline" className="w-full justify-start"><MessageCircle className="h-4 w-4 mr-2 text-green-500" /> WhatsApp</Button></a>
            <a href={links.x} target="_blank" rel="noreferrer"><Button variant="outline" className="w-full justify-start"><Twitter className="h-4 w-4 mr-2 text-sky-500" /> X / Twitter</Button></a>
            <a href={links.linkedin} target="_blank" rel="noreferrer"><Button variant="outline" className="w-full justify-start"><Linkedin className="h-4 w-4 mr-2 text-blue-600" /> LinkedIn</Button></a>
            <a href={links.telegram} target="_blank" rel="noreferrer"><Button variant="outline" className="w-full justify-start"><Send className="h-4 w-4 mr-2 text-sky-400" /> Telegram</Button></a>
            <a href={links.email}><Button variant="outline" className="w-full justify-start"><Mail className="h-4 w-4 mr-2" /> Email</Button></a>
            <Button variant="outline" onClick={() => nativeShare({ title, text, url: targetUrl })}><Share2 className="h-4 w-4 mr-2" /> More…</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
