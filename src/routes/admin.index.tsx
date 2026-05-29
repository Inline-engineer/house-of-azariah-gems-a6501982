import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Package, ShoppingBag, DollarSign, AlertTriangle, Users } from "lucide-react";
import { formatKsh } from "@/lib/shop";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [products, orders, lowStock, customers, revenue] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("products").select("id,name,stock,low_stock_threshold").order("stock", { ascending: true }).limit(5),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("total").eq("payment_status", "paid"),
      ]);
      const totalRevenue = (revenue.data ?? []).reduce((a, r) => a + Number(r.total), 0);
      const lowStockItems = (lowStock.data ?? []).filter((p) => p.stock <= p.low_stock_threshold);
      return {
        products: products.count ?? 0,
        orders: orders.count ?? 0,
        customers: customers.count ?? 0,
        revenue: totalRevenue,
        lowStockItems,
      };
    },
  });

  const { data: recentOrders } = useQuery({
    queryKey: ["admin-recent-orders"],
    queryFn: async () => {
      const { data } = await supabase.from("orders")
        .select("id,order_number,customer_name,total,status,created_at")
        .order("created_at", { ascending: false })
        .limit(6);
      return data ?? [];
    },
  });

  const cards = [
    { label: "Total Products", value: stats?.products ?? 0, icon: Package, color: "text-blue-500" },
    { label: "Total Orders", value: stats?.orders ?? 0, icon: ShoppingBag, color: "text-purple-500" },
    { label: "Revenue (Paid)", value: stats ? formatKsh(stats.revenue) : "KSh 0", icon: DollarSign, color: "text-emerald-500" },
    { label: "Customers", value: stats?.customers ?? 0, icon: Users, color: "text-amber-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, here's what's happening in your store.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/products/new" className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-90">+ Add Product</Link>
          <Link to="/admin/orders" className="inline-flex items-center px-4 py-2 rounded-md border text-sm hover:bg-muted">View Orders</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Card key={c.label} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{c.label}</p>
                <p className="text-2xl font-semibold mt-1">{c.value}</p>
              </div>
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent orders</h2>
            <Link to="/admin/orders" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground border-b">
                <tr><th className="py-2">Order</th><th>Customer</th><th>Total</th><th>Status</th></tr>
              </thead>
              <tbody>
                {(recentOrders ?? []).map((o) => (
                  <tr key={o.id} className="border-b last:border-0">
                    <td className="py-3"><Link to="/admin/orders/$id" params={{ id: o.id }} className="text-primary hover:underline">{o.order_number}</Link></td>
                    <td>{o.customer_name}</td>
                    <td>{formatKsh(Number(o.total))}</td>
                    <td><span className="inline-block px-2 py-0.5 rounded-full text-xs bg-muted capitalize">{o.status}</span></td>
                  </tr>
                ))}
                {(recentOrders ?? []).length === 0 && (
                  <tr><td colSpan={4} className="py-6 text-center text-muted-foreground">No orders yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-500" /> Low stock alerts</h2>
          <ul className="space-y-3">
            {(stats?.lowStockItems ?? []).map((p) => (
              <li key={p.id} className="flex items-center justify-between text-sm">
                <Link to="/admin/products/$id" params={{ id: p.id }} className="hover:text-primary truncate">{p.name}</Link>
                <span className="text-amber-600 font-medium">{p.stock} left</span>
              </li>
            ))}
            {(stats?.lowStockItems ?? []).length === 0 && (
              <li className="text-sm text-muted-foreground">All products well-stocked.</li>
            )}
          </ul>
        </Card>
      </div>
    </div>
  );
}
