import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

export type ProductFormValue = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  details: string;
  price: number;
  sale_price: number | null;
  category_id: string | null;
  tags: string;
  stock: number;
  low_stock_threshold: number;
  is_active: boolean;
  is_featured: boolean;
  badge: string;
  primary_image: string;
};

export const emptyProduct: ProductFormValue = {
  name: "", slug: "", description: "", details: "",
  price: 0, sale_price: null, category_id: null,
  tags: "", stock: 0, low_stock_threshold: 5,
  is_active: true, is_featured: false, badge: "", primary_image: "",
};

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function ProductForm({ initial, onSubmit, submitting }: {
  initial: ProductFormValue;
  onSubmit: (v: ProductFormValue) => Promise<void>;
  submitting?: boolean;
}) {
  const [v, setV] = useState<ProductFormValue>(initial);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("id,name,slug").order("sort_order");
      return data ?? [];
    },
  });

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from("product-images").upload(path, file, { cacheControl: "3600", upsert: false });
        if (error) throw error;
        const { data: pub } = supabase.storage.from("product-images").getPublicUrl(path);
        urls.push(pub.publicUrl);
      }
      setV((p) => ({ ...p, primary_image: p.primary_image || urls[0] }));
      toast.success(`Uploaded ${urls.length} image${urls.length > 1 ? "s" : ""}`);
      if (urls.length > 1 && initial.id) {
        await supabase.from("product_images").insert(urls.slice(1).map((u, i) => ({ product_id: initial.id, url: u, sort_order: i })));
      }
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!v.slug) v.slug = slugify(v.name);
    await onSubmit(v);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5 space-y-4">
            <h2 className="font-semibold">Basic info</h2>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input required value={v.name} onChange={(e) => setV({ ...v, name: e.target.value, slug: v.slug || slugify(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>URL slug</Label>
              <Input value={v.slug} onChange={(e) => setV({ ...v, slug: slugify(e.target.value) })} placeholder="auto-generated from name" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea rows={4} value={v.description} onChange={(e) => setV({ ...v, description: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Details (one per line)</Label>
              <Textarea rows={4} value={v.details} onChange={(e) => setV({ ...v, details: e.target.value })} placeholder="18k Gold&#10;Hand-set diamonds&#10;Free resizing" />
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <h2 className="font-semibold">Pricing & stock</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price (KSh)</Label>
                <Input type="number" min="0" required value={v.price} onChange={(e) => setV({ ...v, price: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Sale price (optional)</Label>
                <Input type="number" min="0" value={v.sale_price ?? ""} onChange={(e) => setV({ ...v, sale_price: e.target.value ? Number(e.target.value) : null })} />
              </div>
              <div className="space-y-2">
                <Label>Stock quantity</Label>
                <Input type="number" min="0" required value={v.stock} onChange={(e) => setV({ ...v, stock: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Low stock alert</Label>
                <Input type="number" min="0" value={v.low_stock_threshold} onChange={(e) => setV({ ...v, low_stock_threshold: Number(e.target.value) })} />
              </div>
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <h2 className="font-semibold">Images</h2>
            {v.primary_image && (
              <div className="relative inline-block">
                <img src={v.primary_image} alt="" className="h-32 w-32 object-cover rounded-md border" />
                <button type="button" onClick={() => setV({ ...v, primary_image: "" })} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1">
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            <div>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => upload(e.target.files)} />
              <Button type="button" variant="outline" disabled={uploading} onClick={() => fileRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" /> {uploading ? "Uploading..." : "Upload images"}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">First image becomes the primary photo. Drag & drop multiple at once.</p>
            </div>
            <div className="space-y-2">
              <Label>Or paste image URL</Label>
              <Input value={v.primary_image} onChange={(e) => setV({ ...v, primary_image: e.target.value })} placeholder="https://..." />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5 space-y-4">
            <h2 className="font-semibold">Visibility</h2>
            <div className="flex items-center justify-between">
              <Label htmlFor="active">Active (visible in store)</Label>
              <Switch id="active" checked={v.is_active} onCheckedChange={(c) => setV({ ...v, is_active: c })} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="featured">Featured</Label>
              <Switch id="featured" checked={v.is_featured} onCheckedChange={(c) => setV({ ...v, is_featured: c })} />
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <h2 className="font-semibold">Organization</h2>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={v.category_id ?? "none"} onValueChange={(val) => setV({ ...v, category_id: val === "none" ? null : val })}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {(categories ?? []).map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tags (comma-separated)</Label>
              <Input value={v.tags} onChange={(e) => setV({ ...v, tags: e.target.value })} placeholder="emerald, gold, heirloom" />
            </div>
            <div className="space-y-2">
              <Label>Badge (optional)</Label>
              <Input value={v.badge} onChange={(e) => setV({ ...v, badge: e.target.value })} placeholder="Bestseller, New, Limited" />
            </div>
          </Card>

          <Button type="submit" disabled={submitting} className="w-full">{submitting ? "Saving..." : "Save product"}</Button>
        </div>
      </div>
    </form>
  );
}
