import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Edit, Trash2, Plus, Search } from "lucide-react";
import { formatKsh } from "@/lib/shop";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/products/")({
  component: ProductsListPage,
});

function ProductsListPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");

  const { data: products } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data } = await supabase.from("products")
        .select("id,name,price,sale_price,stock,is_active,primary_image,categories(name)")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Product deleted"); qc.invalidateQueries({ queryKey: ["admin-products"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = (products ?? []).filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif">Products</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} items</p>
        </div>
        <Link to="/admin/products/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-90">
          <Plus className="h-4 w-4" /> Add product
        </Link>
      </div>

      <Card className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products..." className="pl-9" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground border-b">
              <tr><th className="py-2">Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      {p.primary_image && <img src={p.primary_image} alt="" className="h-10 w-10 rounded object-cover" />}
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td>{(p.categories as { name: string } | null)?.name ?? "—"}</td>
                  <td>{formatKsh(Number(p.sale_price ?? p.price))}</td>
                  <td>
                    <span className={p.stock <= 5 ? "text-amber-600 font-medium" : ""}>{p.stock}</span>
                  </td>
                  <td>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${p.is_active ? "bg-emerald-500/10 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                      {p.is_active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link to="/admin/products/$id" params={{ id: p.id }} className="p-2 rounded hover:bg-muted"><Edit className="h-4 w-4" /></Link>
                      <Button variant="ghost" size="sm" onClick={() => { if (confirm(`Delete ${p.name}?`)) del.mutate(p.id); }}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
