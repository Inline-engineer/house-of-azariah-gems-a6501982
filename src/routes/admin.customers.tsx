import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search } from "lucide-react";

export const Route = createFileRoute("/admin/customers")({
  component: CustomersPage,
});

function CustomersPage() {
  const [q, setQ] = useState("");

  const { data: customers } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: async () => {
      const { data: profiles } = await supabase.from("profiles").select("id,full_name,email,phone,created_at").order("created_at", { ascending: false });
      const { data: orderCounts } = await supabase.from("orders").select("user_id,total");
      const totals = new Map<string, { count: number; total: number }>();
      for (const o of orderCounts ?? []) {
        if (!o.user_id) continue;
        const t = totals.get(o.user_id) ?? { count: 0, total: 0 };
        t.count++; t.total += Number(o.total);
        totals.set(o.user_id, t);
      }
      return (profiles ?? []).map((p) => ({ ...p, orders: totals.get(p.id)?.count ?? 0, spent: totals.get(p.id)?.total ?? 0 }));
    },
  });

  const filtered = (customers ?? []).filter((c) =>
    !q || (c.full_name ?? "").toLowerCase().includes(q.toLowerCase()) || (c.email ?? "").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif">Customers</h1>
        <p className="text-sm text-muted-foreground">{filtered.length} customers</p>
      </div>
      <Card className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or email..." className="pl-9" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground border-b">
              <tr><th className="py-2">Name</th><th>Email</th><th>Phone</th><th>Orders</th><th>Total spent</th><th>Joined</th></tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b last:border-0">
                  <td className="py-3 font-medium">{c.full_name ?? "—"}</td>
                  <td className="text-muted-foreground">{c.email}</td>
                  <td className="text-muted-foreground">{c.phone ?? "—"}</td>
                  <td>{c.orders}</td>
                  <td>KSh {c.spent.toLocaleString()}</td>
                  <td className="text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No customers yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
