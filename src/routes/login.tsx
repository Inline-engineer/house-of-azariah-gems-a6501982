import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { bootstrapAdmins } from "@/lib/admin-bootstrap.functions";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in, House of Azariah Gems" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    try { await bootstrapAdmins(); } catch {}
    toast.success("Welcome back");
    navigate({ to: "/admin" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-16">
      <Card className="w-full max-w-md p-8">
        <Link to="/" className="block text-center text-2xl font-serif text-primary mb-1">House of Azariah Gems</Link>
        <h1 className="text-xl font-semibold text-center mb-6">Sign in</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </div>
          <Button type="submit" disabled={loading} className="w-full">{loading ? "Signing in..." : "Sign in"}</Button>
        </form>
        <div className="mt-4 flex justify-between text-sm">
          <Link to="/signup" className="text-muted-foreground hover:text-primary">Create account</Link>
          <Link to="/forgot-password" className="text-muted-foreground hover:text-primary">Forgot password?</Link>
        </div>
      </Card>
    </div>
  );
}
