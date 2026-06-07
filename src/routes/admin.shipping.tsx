import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Trash2, Save, Plus } from "lucide-react";

export const Route = createFileRoute("/admin/shipping")({
  component: ShippingPage,
});

type Zone = {
  id: string;
  name: string;
  region: string | null;
  fee: number;
  free_over: number | null;
  sort_order: number;
  is_active: boolean;
};

function ShippingPage() {
  const qc = useQueryClient();
  const [draft, setDraft] = useState({ name: "", region: "", fee: "", free_over: "" });

  const { data: zones = [], isLoading } = useQuery({
    queryKey: ["admin-shipping-zones"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shipping_zones")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Zone[];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      if (!draft.name.trim()) throw new Error("Name is required");
      const fee = Number(draft.fee || 0);
      if (Number.isNaN(fee) || fee < 0) throw new Error("Fee must be a positive number");
      const free_over = draft.free_over ? Number(draft.free_over) : null;
      const { error } = await supabase.from("shipping_zones").insert({
        name: draft.name.trim(),
        region: draft.region.trim() || null,
        fee,
        free_over,
        sort_order: (zones.at(-1)?.sort_order ?? 0) + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Zone added");
      setDraft({ name: "", region: "", fee: "", free_over: "" });
      qc.invalidateQueries({ queryKey: ["admin-shipping-zones"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: async (z: Zone) => {
      const { error } = await supabase
        .from("shipping_zones")
        .update({
          name: z.name,
          region: z.region,
          fee: z.fee,
          free_over: z.free_over,
          is_active: z.is_active,
          sort_order: z.sort_order,
        })
        .eq("id", z.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["admin-shipping-zones"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("shipping_zones").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin-shipping-zones"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif">Shipping zones</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Set delivery fees by region or city. Customers pick their location at checkout and the matching fee is applied.
          Set a "free over" amount to offer free shipping above a cart subtotal for that zone.
        </p>
      </div>

      <Card className="p-5 space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><Plus className="h-4 w-4" /> Add a zone</h2>
        <div className="grid gap-3 md:grid-cols-4">
          <div className="space-y-1 md:col-span-2">
            <Label>Zone name</Label>
            <Input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="e.g. Nairobi CBD & suburbs"
            />
          </div>
          <div className="space-y-1">
            <Label>Region / Country</Label>
            <Input
              value={draft.region}
              onChange={(e) => setDraft({ ...draft, region: e.target.value })}
              placeholder="Kenya"
            />
          </div>
          <div className="space-y-1">
            <Label>Delivery fee (KSh)</Label>
            <Input
              type="number"
              min="0"
              value={draft.fee}
              onChange={(e) => setDraft({ ...draft, fee: e.target.value })}
              placeholder="800"
            />
          </div>
          <div className="space-y-1">
            <Label>Free over (KSh, optional)</Label>
            <Input
              type="number"
              min="0"
              value={draft.free_over}
              onChange={(e) => setDraft({ ...draft, free_over: e.target.value })}
              placeholder="50000"
            />
          </div>
          <div className="md:col-span-4">
            <Button onClick={() => create.mutate()} disabled={create.isPending}>
              {create.isPending ? "Adding..." : "Add zone"}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="font-semibold mb-4">Your zones</h2>
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading...</p>
        ) : zones.length === 0 ? (
          <p className="text-muted-foreground text-sm">No zones yet. Add one above.</p>
        ) : (
          <div className="space-y-3">
            {zones.map((z) => (
              <ZoneRow key={z.id} zone={z} onSave={(next) => update.mutate(next)} onDelete={() => remove.mutate(z.id)} saving={update.isPending} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function ZoneRow({ zone, onSave, onDelete, saving }: { zone: Zone; onSave: (z: Zone) => void; onDelete: () => void; saving: boolean }) {
  const [z, setZ] = useState(zone);
  const dirty = JSON.stringify(z) !== JSON.stringify(zone);
  return (
    <div className="grid gap-2 md:grid-cols-12 items-end border rounded-md p-3">
      <div className="md:col-span-4">
        <Label className="text-xs">Name</Label>
        <Input value={z.name} onChange={(e) => setZ({ ...z, name: e.target.value })} />
      </div>
      <div className="md:col-span-2">
        <Label className="text-xs">Region</Label>
        <Input value={z.region ?? ""} onChange={(e) => setZ({ ...z, region: e.target.value })} />
      </div>
      <div className="md:col-span-2">
        <Label className="text-xs">Fee (KSh)</Label>
        <Input type="number" min="0" value={z.fee} onChange={(e) => setZ({ ...z, fee: Number(e.target.value) })} />
      </div>
      <div className="md:col-span-2">
        <Label className="text-xs">Free over</Label>
        <Input type="number" min="0" value={z.free_over ?? ""} onChange={(e) => setZ({ ...z, free_over: e.target.value ? Number(e.target.value) : null })} placeholder="—" />
      </div>
      <div className="md:col-span-1 flex items-center gap-2">
        <Switch checked={z.is_active} onCheckedChange={(c) => setZ({ ...z, is_active: c })} />
        <span className="text-xs text-muted-foreground">Active</span>
      </div>
      <div className="md:col-span-1 flex gap-2 justify-end">
        <Button size="sm" variant="outline" disabled={!dirty || saving} onClick={() => onSave(z)}>
          <Save className="h-3.5 w-3.5" />
        </Button>
        <Button size="sm" variant="ghost" onClick={onDelete} className="text-destructive">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
