import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ProductForm, emptyProduct, type ProductFormValue } from "@/components/admin/ProductForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin/products/new")({
  component: NewProductPage,
});

function NewProductPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (v: ProductFormValue) => {
    setSubmitting(true);
    const { error } = await supabase.from("products").insert({
      name: v.name, slug: v.slug, description: v.description,
      details: v.details.split("\n").map((s) => s.trim()).filter(Boolean),
      price: v.price, sale_price: v.sale_price,
      category_id: v.category_id,
      tags: v.tags.split(",").map((s) => s.trim()).filter(Boolean),
      stock: v.stock, low_stock_threshold: v.low_stock_threshold,
      is_active: v.is_active, is_featured: v.is_featured,
      badge: v.badge || null, primary_image: v.primary_image || null,
    });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Product created");
    navigate({ to: "/admin/products" });
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <Link to="/admin/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" /> Back to products</Link>
      <h1 className="text-2xl md:text-3xl font-serif">New product</h1>
      <ProductForm initial={emptyProduct} onSubmit={onSubmit} submitting={submitting} />
    </div>
  );
}
