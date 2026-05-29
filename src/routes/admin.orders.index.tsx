import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search } from "lucide-react";
import { formatKsh } from "@/lib/shop";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STATUSES = ["all", "pending", "processing", "shipped", "delivered", "cancelled"] as const;

export const Route = createFileRoute("/admin/orders/")({
  component: OrdersListPage,
});

function OrdersListPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");

  const { data: orders } = useQuery({
    queryKey: ["admin-orders", status],
    queryFn: async () => {
      let query = supabase.from("orders").select("id,order_number,customer_name,customer_phone,total,status,payment_status,created_at").order("created_at", { ascending: false });
      if (status !== "all") query = query.eq("status", status as "pending" | "processing" | "shipped" | "delivered" | "cancelled");
      const { data } = await query;
      return data ?? [];
    },
  });

  const filtered = (orders ?? []).filter((o) =>
    !q ||
    o.order_number.toLowerCase().includes(q.toLowerCase()) ||
    o.customer_name.toLowerCase().includes(q.toLowerCase()) ||
    (o.customer_phone ?? "").includes(q)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif">Orders</h1>
        <p className="text-sm text-muted-foreground">{filtered.length} orders</p>
      </div>

      <Card className="p-4">
        <div className="flex gap-3 mb-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Order #, customer, phone..." className="pl-9" />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground border-b">
              <tr><th className="py-2">Order</th><th>Customer</th><th>Phone</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="py-3"><Link to="/admin/orders/$id" params={{ id: o.id }} className="text-primary hover:underline font-medium">{o.order_number}</Link></td>
                  <td>{o.customer_name}</td>
                  <td className="text-muted-foreground">{o.customer_phone}</td>
                  <td>{formatKsh(Number(o.total))}</td>
                  <td><span className="inline-block px-2 py-0.5 rounded-full text-xs bg-muted capitalize">{o.payment_status}</span></td>
                  <td><span className="inline-block px-2 py-0.5 rounded-full text-xs bg-muted capitalize">{o.status}</span></td>
                  <td className="text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
