import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatKsh } from "@/lib/shop";
import { ArrowLeft, Printer } from "lucide-react";
import { toast } from "sonner";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;
const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"] as const;

type OrderStatus = typeof STATUSES[number];
type PaymentStatus = typeof PAYMENT_STATUSES[number];

export const Route = createFileRoute("/admin/orders/$id")({
  component: OrderDetailPage,
});

function OrderDetailPage() {
  const { id } = Route.useParams();
  const qc = useQueryClient();

  const { data: order } = useQuery({
    queryKey: ["admin-order", id],
    queryFn: async () => {
      const { data } = await supabase.from("orders").select("*, order_items(*)").eq("id", id).single();
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async (patch: { status?: OrderStatus; payment_status?: PaymentStatus }) => {
      const { error } = await supabase.from("orders").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Order updated"); qc.invalidateQueries({ queryKey: ["admin-order", id] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!order) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6 max-w-5xl print:max-w-none">
      <div className="flex items-center justify-between flex-wrap gap-3 print:hidden">
        <Link to="/admin/orders" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" /> Back to orders</Link>
        <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="h-4 w-4 mr-2" />Print invoice</Button>
      </div>

      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif">{order.order_number}</h1>
          <p className="text-sm text-muted-foreground">Placed {new Date(order.created_at).toLocaleString()}</p>
        </div>
        <p className="text-2xl font-semibold">{formatKsh(Number(order.total))}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-5 lg:col-span-2">
          <h2 className="font-semibold mb-4">Items</h2>
          <div className="space-y-3">
            {(order.order_items as Array<{ id: string; product_name: string; product_image: string | null; quantity: number; unit_price: number; subtotal: number }>).map((it) => (
              <div key={it.id} className="flex items-center gap-4 pb-3 border-b last:border-0 last:pb-0">
                {it.product_image && <img src={it.product_image} alt="" className="h-14 w-14 rounded object-cover" />}
                <div className="flex-1">
                  <p className="font-medium">{it.product_name}</p>
                  <p className="text-sm text-muted-foreground">{it.quantity} × {formatKsh(Number(it.unit_price))}</p>
                </div>
                <p className="font-medium">{formatKsh(Number(it.subtotal))}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatKsh(Number(order.subtotal))}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{formatKsh(Number(order.shipping_fee))}</span></div>
            {Number(order.discount) > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-{formatKsh(Number(order.discount))}</span></div>}
            <div className="flex justify-between font-semibold text-base pt-2"><span>Total</span><span>{formatKsh(Number(order.total))}</span></div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="font-semibold mb-3">Customer</h2>
            <p className="font-medium">{order.customer_name}</p>
            <p className="text-sm text-muted-foreground">{order.customer_email}</p>
            <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
            {order.shipping_address && (
              <p className="text-sm text-muted-foreground mt-3">{order.shipping_address}{order.city ? `, ${order.city}` : ""}</p>
            )}
          </Card>

          <Card className="p-5 space-y-4 print:hidden">
            <h2 className="font-semibold">Update status</h2>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Order status</label>
              <Select value={order.status} onValueChange={(v) => updateStatus.mutate({ status: v as OrderStatus })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Payment status</label>
              <Select value={order.payment_status} onValueChange={(v) => updateStatus.mutate({ payment_status: v as PaymentStatus })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAYMENT_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">Cancelling an order automatically restores stock.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
