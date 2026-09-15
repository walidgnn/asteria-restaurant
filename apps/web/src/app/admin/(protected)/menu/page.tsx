"use client";

import { useEffect, useState } from "react";
import { Search, MoreVertical } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth-context";

type Category = {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  _count: { dishes: number };
};

export default function AdminCategoriesPage() {
  const { token, hasPermission } = useAdminAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const canManage = hasPermission("menu.manage");

  async function load() {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    const res = await fetch(`http://localhost:3001admin/menu/categories?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCategories(await res.json());
  }

  useEffect(() => {
    if (!token) return;
    load();
  }, [token, search]);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const name = form.get("name") as string;
    const description = form.get("description") as string;

    const res = await fetch("http://localhost:3001admin/menu/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, description: description || undefined }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      setError(err?.message || "Failed to create category.");
      return;
    }
    setShowNew(false);
    await load();
  }

  async function toggleActive(cat: Category) {
    await fetch(`http://localhost:3001admin/menu/categories/${cat.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ isActive: !cat.isActive }),
    });
    await load();
  }

  async function handleDelete(cat: Category) {
    if (!confirm(`Delete category "${cat.name}"?`)) return;
    const res = await fetch(`http://localhost:3001admin/menu/categories/${cat.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      alert(err?.message || "Failed to delete category.");
    }
    setMenuOpenFor(null);
    await load();
  }

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-4xl text-charcoal">Categories</h1>
          <p className="mt-2 text-stone">Organize the dishes displayed on the Asteria menu.</p>
        </div>
        {canManage && (
          <button
            onClick={() => setShowNew(true)}
            className="bg-olive px-6 py-3 text-sm font-medium tracking-wide text-white hover:bg-olive-dark"
          >
            + NEW CATEGORY
          </button>
        )}
      </div>

      {showNew && (
        <div className="mt-6 border border-border p-6">
          {error && <p className="mb-4 text-sm text-terracotta">{error}</p>}
          <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-medium tracking-wide text-stone">NAME</label>
              <input name="name" required className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none" />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-medium tracking-wide text-stone">DESCRIPTION</label>
              <input name="description" className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none" />
            </div>
            <button type="submit" className="bg-olive px-6 py-2.5 text-sm font-medium tracking-wide text-white hover:bg-olive-dark">
              CREATE
            </button>
            <button type="button" onClick={() => setShowNew(false)} className="text-sm font-medium tracking-wide text-charcoal">
              CANCEL
            </button>
          </form>
        </div>
      )}

      <div className="relative mt-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories..."
          className="w-full border border-border bg-transparent py-2.5 pl-9 pr-3 text-sm text-charcoal focus:border-charcoal focus:outline-none"
        />
      </div>

      <div className="mt-6 overflow-x-auto border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-mist">
            <tr className="text-xs tracking-wide text-stone">
              <th className="px-4 py-3">ORDER</th>
              <th className="px-4 py-3">CATEGORY NAME</th>
              <th className="px-4 py-3">DESCRIPTION</th>
              <th className="px-4 py-3">DISH COUNT</th>
              <th className="px-4 py-3">STATUS</th>
              {canManage && <th className="px-4 py-3"></th>}
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, i) => (
              <tr key={cat.id} className="border-b border-border last:border-0">
                <td className="px-4 py-4 text-stone">{String(i + 1).padStart(2, "0")}</td>
                <td className="px-4 py-4 font-medium text-charcoal">{cat.name.toUpperCase()}</td>
                <td className="px-4 py-4 text-stone">{cat.description ?? "—"}</td>
                <td className="px-4 py-4 text-charcoal">{cat._count.dishes} dishes</td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => canManage && toggleActive(cat)}
                    className={`px-2 py-1 text-xs font-medium tracking-wide ${
                      cat.isActive ? "bg-[#E8ECE3] text-charcoal" : "bg-mist text-stone"
                    }`}
                  >
                    {cat.isActive ? "ACTIVE" : "INACTIVE"}
                  </button>
                </td>
                {canManage && (
                  <td className="relative px-4 py-4">
                    <button onClick={() => setMenuOpenFor(menuOpenFor === cat.id ? null : cat.id)}>
                      <MoreVertical size={16} className="text-charcoal" />
                    </button>
                    {menuOpenFor === cat.id && (
                      <div className="absolute right-4 top-10 z-10 w-32 border border-border bg-cream shadow-md">
                        <button
                          onClick={() => handleDelete(cat)}
                          className="block w-full px-4 py-2.5 text-left text-sm text-terracotta hover:bg-mist"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}