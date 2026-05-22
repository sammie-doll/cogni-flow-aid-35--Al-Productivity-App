import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({ component: ForgotPage });

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl glass p-8 shadow-soft space-y-4">
        <h1 className="text-2xl font-bold">Reset your password</h1>
        {sent ? (
          <p className="text-sm text-muted-foreground">
            If <strong>{email}</strong> is registered, we've sent a reset link.
          </p>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); if (!email) return; setSent(true); toast.success("Reset link sent (demo)"); }}
            className="space-y-3"
          >
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <Button type="submit" className="w-full gradient-primary text-primary-foreground">Send reset link</Button>
          </form>
        )}
        <Link to="/login" className="block text-center text-sm text-primary hover:underline">Back to login</Link>
      </div>
    </div>
  );
}
