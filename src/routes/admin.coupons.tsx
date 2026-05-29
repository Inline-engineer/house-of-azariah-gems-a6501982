import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/coupons")({
  component: CouponsPage,
});

function CouponsPage() {
  const qc = useQueryClient();
  const [code, setCode] = useState("");
  const [percent, setPercent] = useState<number | "">("");
  const [amount, setAmount] = useState<number | "">("");

  const { data: coupons } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: async () => {
      const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      if (!code) throw new Error("Code is required");
      const { error } = await supabase.from("coupons").insert({
        code: code.toUpperCase(),
        discount_percent: percent === "" ? null : Number(percent),
        discount_amount: amount === "" ? null : Number(amount),
      });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Coupon created"); setCode(""); setPercent(""); setAmount(""); qc.invalidateQueries({ queryKey: ["admin-coupons"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggle = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("coupons").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-coupons"] }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("coupons").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-coupons"] }); },
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif">Coupons</h1>
        <p className="text-sm text-muted-foreground">Create discount codes customers can apply at checkout.</p>
      </div>

      <Card className="p-5">
        <h2 className="font-semibold mb-4">Create new coupon</h2>
        <div className="grid md:grid-cols-4 gap-3 items-end">
          <div className="space-y-1">
            <Label>Code</Label>
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="WELCOME10" />
          </div>
          <div className="space-y-1">
            <Label>% off</Label>
            <Input type="number" min="0" max="100" value={percent} onChange={(e) => setPercent(e.target.value === "" ? "" : Number(e.target.value))} />
          </div>
          <div className="space-y-1">
            <Label>or KSh off</Label>
            <Input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))} />
          </div>
          <Button onClick={() => create.mutate()} disabled={create.isPending}>Add</Button>
        </div>
      </Card>

      <Card className="p-4">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground border-b">
            <tr><th className="py-2">Code</th><th>Discount</th><th>Uses</th><th>Active</th><th></th></tr>
          </thead>
          <tbody>
            {(coupons ?? []).map((c) => (
              <tr key={c.id} className="border-b last:border-0">
                <td className="py-3 font-mono font-medium">{c.code}</td>
                <td>{c.discount_percent ? `${c.discount_percent}%` : c.discount_amount ? `KSh ${c.discount_amount}` : "—"}</td>
                <td>{c.uses} / {c.max_uses ?? "∞"}</td>
                <td><Switch checked={c.is_active} onCheckedChange={(v) => toggle.mutate({ id: c.id, is_active: v })} /></td>
                <td className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => { if (confirm(`Delete ${c.code}?`)) del.mutate(c.id); }}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
            {(coupons ?? []).length === 0 && <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">No coupons yet.</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
