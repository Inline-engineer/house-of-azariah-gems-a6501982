import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ProductForm, type ProductFormValue } from "@/components/admin/ProductForm";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin/products/$id")({
  component: EditProductPage,
});

function EditProductPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-product", id],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("*").eq("id", id).single();
      return data;
    },
  });

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;
  if (!data) return <p className="text-muted-foreground">Product not found.</p>;

  const initial: ProductFormValue = {
    id: data.id,
    name: data.name, slug: data.slug, description: data.description ?? "",
    details: (data.details ?? []).join("\n"),
    price: Number(data.price), sale_price: data.sale_price ? Number(data.sale_price) : null,
    category_id: data.category_id,
    tags: (data.tags ?? []).join(", "),
    stock: data.stock, low_stock_threshold: data.low_stock_threshold,
    is_active: data.is_active, is_featured: data.is_featured,
    badge: data.badge ?? "", primary_image: data.primary_image ?? "",
  };

  const onSubmit = async (v: ProductFormValue) => {
    setSubmitting(true);
    const { error } = await supabase.from("products").update({
      name: v.name, slug: v.slug, description: v.description,
      details: v.details.split("\n").map((s) => s.trim()).filter(Boolean),
      price: v.price, sale_price: v.sale_price,
      category_id: v.category_id,
      tags: v.tags.split(",").map((s) => s.trim()).filter(Boolean),
      stock: v.stock, low_stock_threshold: v.low_stock_threshold,
      is_active: v.is_active, is_featured: v.is_featured,
      badge: v.badge || null, primary_image: v.primary_image || null,
    }).eq("id", id);
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Product updated");
    navigate({ to: "/admin/products" });
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <Link to="/admin/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" /> Back to products</Link>
      <h1 className="text-2xl md:text-3xl font-serif">Edit product</h1>
      <ProductForm initial={initial} onSubmit={onSubmit} submitting={submitting} />
    </div>
  );
}
