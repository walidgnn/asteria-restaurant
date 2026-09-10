"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/admin-auth-context";

type Category = { id: string; name: string };
type CustomizationGroup = { id: string; name: string };

type DishData = {
  id?: string;
  name: string;
  description: string;
  price: string;
  categoryId: string;
  imageUrl: string;
  isAvailable: boolean;
  isFeatured: boolean;
  customizationGroupIds: string[];
};

export function DishForm({ initial }: { initial?: Partial<DishData> & { id: string } }) {
  const router = useRouter();
  const { token } = useAdminAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [groups, setGroups] = useState<CustomizationGroup[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<DishData>({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    price: initial?.price ?? "",
    categoryId: initial?.categoryId ?? "",
    imageUrl: initial?.imageUrl ?? "",
    isAvailable: initial?.isAvailable ?? true,
    isFeatured: initial?.isFeatured ?? false,
    customizationGroupIds: initial?.customizationGroupIds ?? [],
  });

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:3001/admin/menu/categories", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then(setCategories);
    fetch("http://localhost:3001/admin/menu/customizations", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setGroups(data.map((g: any) => ({ id: g.id, name: g.name }))));
  }, [token]);

  function toggleGroup(id: string) {
    setForm((f) => ({
      ...f,
      customizationGroupIds: f.customizationGroupIds.includes(id)
        ? f.customizationGroupIds.filter((g) => g !== id)
        : [...f.customizationGroupIds, id],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.categoryId) {
      setError("Please select a category.");
      return;
    }
    setSubmitting(true);

    const payload = {
      name: form.name,
      description: form.description || undefined,
      price: parseFloat(form.price),
      categoryId: form.categoryId,
      imageUrl: form.imageUrl || undefined,
      isAvailable: form.isAvailable,
      isFeatured: form.isFeatured,
      customizationGroupIds: form.customizationGroupIds,
    };

    try {
      const url = initial?.id
        ? `http://localhost:3001/admin/menu/dishes/${initial.id}`
        : "http://localhost:3001/admin/menu/dishes";
      const res = await fetch(url, {
        method: initial?.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Failed to save dish.");
      }
      router.push("/admin/menu/dishes");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      {error && (
        <p className="mb-6 border border-terracotta/40 bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
          {error}
        </p>
      )}

      <div>
        <label className="text-xs font-medium tracking-wide text-stone">NAME</label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none"
        />
      </div>

      <div className="mt-6">
        <label className="text-xs font-medium tracking-wide text-stone">DESCRIPTION</label>
        <textarea
          rows={2}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="mt-2 w-full border border-border bg-transparent px-3 py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none"
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-medium tracking-wide text-stone">PRICE (€)</label>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-medium tracking-wide text-stone">CATEGORY</label>
          <select
            required
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none"
          >
            <option value="">Select a category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-6">
        <label className="text-xs font-medium tracking-wide text-stone">IMAGE URL</label>
        <input
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          placeholder="/images/dish-name.jpg or https://..."
          className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm text-charcoal placeholder:text-stone/60 focus:border-charcoal focus:outline-none"
        />
        <p className="mt-1.5 text-xs italic text-stone">
          No file upload yet — paste a path or URL. File uploads are a future improvement.
        </p>
      </div>

      <div className="mt-6 flex gap-8">
        <label className="flex items-center gap-2 text-sm text-charcoal">
          <input
            type="checkbox"
            checked={form.isAvailable}
            onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
          />
          Available
        </label>
        <label className="flex items-center gap-2 text-sm text-charcoal">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
          />
          Featured
        </label>
      </div>

      {groups.length > 0 && (
        <div className="mt-6">
          <label className="text-xs font-medium tracking-wide text-stone">CUSTOMIZATION GROUPS</label>
          <div className="mt-2 space-y-2 border border-border p-4">
            {groups.map((g) => (
              <label key={g.id} className="flex items-center gap-2 text-sm text-charcoal">
                <input
                  type="checkbox"
                  checked={form.customizationGroupIds.includes(g.id)}
                  onChange={() => toggleGroup(g.id)}
                />
                {g.name}
              </label>
            ))}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-8 bg-olive px-8 py-3.5 text-sm font-medium tracking-wide text-white hover:bg-olive-dark disabled:opacity-60"
      >
        {submitting ? "SAVING..." : initial?.id ? "SAVE CHANGES" : "CREATE DISH"}
      </button>
    </form>
  );
}