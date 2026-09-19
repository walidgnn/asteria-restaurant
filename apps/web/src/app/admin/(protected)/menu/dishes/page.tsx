"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Star, MoreVertical } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth-context";

type Category = { id: string; name: string };
type Dish = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  isAvailable: boolean;
  isFeatured: boolean;
  category: Category;
  images: { url: string }[];
  customizationGroups: { id: string }[];
};

export default function AdminDishesPage() {
  const { token, hasPermission } = useAdminAuth();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState("");
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const canManage = hasPermission("menu.manage");

  async function load() {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (categoryFilter) params.set("categoryId", categoryFilter);
    if (statusFilter) params.set("isAvailable", statusFilter);
    if (featuredFilter) params.set("isFeatured", featuredFilter);

    const res = await fetch(`${API_URL}/admin/menu/dishes?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setDishes(await res.json());
  }

  useEffect(() => {
    if (!token) return;
    load();
    fetch(`${API_URL}/admin/menu/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setCategories);
  }, [token, search, categoryFilter, statusFilter, featuredFilter]);

  async function toggleField(dish: Dish, field: "isAvailable" | "isFeatured") {
    await fetch(`${API_URL}/admin/menu/dishes/${dish.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ [field]: !dish[field] }),
    });
    await load();
  }

  async function handleDelete(dish: Dish) {
    if (!confirm(`Delete "${dish.name}"? This cannot be undone.`)) return;
    const res = await fetch(`${API_URL}/admin/menu/dishes/${dish.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      alert(err?.message || "Failed to delete dish.");
    }
    setMenuOpenFor(null);
    await load();
  }

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-4xl text-charcoal">Dishes</h1>
          <p className="mt-2 text-stone">Manage the dishes available on the Asteria menu.</p>
        </div>
        {canManage && (
          <Link
            href="/admin/menu/dishes/new"
            className="bg-olive px-6 py-3 text-sm font-medium tracking-wide text-white hover:bg-olive-dark"
          >
            + NEW DISH
          </Link>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes..."
            className="w-full border border-border bg-transparent py-2.5 pl-9 pr-3 text-sm text-charcoal focus:border-charcoal focus:outline-none"
          />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="border border-border bg-transparent py-2.5 px-3 text-sm text-charcoal focus:border-charcoal focus:outline-none">
          <option value="">Category: All</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-border bg-transparent py-2.5 px-3 text-sm text-charcoal focus:border-charcoal focus:outline-none">
          <option value="">Status: All</option>
          <option value="true">Available</option>
          <option value="false">Unavailable</option>
        </select>
        <select value={featuredFilter} onChange={(e) => setFeaturedFilter(e.target.value)} className="border border-border bg-transparent py-2.5 px-3 text-sm text-charcoal focus:border-charcoal focus:outline-none">
          <option value="">Featured: All</option>
          <option value="true">Featured</option>
          <option value="false">Not Featured</option>
        </select>
      </div>

      <div className="mt-6 overflow-x-auto border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-mist">
            <tr className="text-xs tracking-wide text-stone">
              <th className="px-4 py-3">IMAGE</th>
              <th className="px-4 py-3">DISH</th>
              <th className="px-4 py-3">CATEGORY</th>
              <th className="px-4 py-3">PRICE</th>
              <th className="px-4 py-3">AVAILABILITY</th>
              <th className="px-4 py-3">FEATURED</th>
              <th className="px-4 py-3">CUSTOMIZATIONS</th>
              <th className="px-4 py-3">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {dishes.map((dish) => (
              <tr key={dish.id} className={`border-b border-border last:border-0 ${!dish.isAvailable ? "opacity-50" : ""}`}>
                <td className="px-4 py-4">
                  <div className="relative h-14 w-14 overflow-hidden bg-mist">
                    {dish.images[0] && (
                      <Image src={dish.images[0].url} alt={dish.name} fill className="object-cover" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className={`font-serif text-lg text-charcoal ${!dish.isAvailable ? "line-through" : ""}`}>
                    {dish.name.toUpperCase()}
                  </p>
                  {dish.description && <p className="mt-0.5 max-w-xs text-xs text-stone">{dish.description}</p>}
                </td>
                <td className="px-4 py-4 text-charcoal">{dish.category.name}</td>
                <td className="px-4 py-4 text-terracotta">€{Number(dish.price).toFixed(2)}</td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => canManage && toggleField(dish, "isAvailable")}
                    className={`relative h-6 w-11 rounded-full transition-colors ${dish.isAvailable ? "bg-olive" : "bg-border"}`}
                  >
                    <span
                      className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all"
                      style={{ left: dish.isAvailable ? "22px" : "2px" }}
                    />
                  </button>
                </td>
                <td className="px-4 py-4">
                  <button onClick={() => canManage && toggleField(dish, "isFeatured")}>
                    <Star
                      size={18}
                      className={dish.isFeatured ? "fill-terracotta text-terracotta" : "text-stone"}
                    />
                  </button>
                </td>
                <td className="px-4 py-4 text-stone">
                  {dish.customizationGroups.length} option{dish.customizationGroups.length !== 1 ? "s" : ""}
                </td>
                <td className="relative px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/menu/dishes/${dish.id}`} className="text-xs font-medium tracking-wide text-charcoal">
                      EDIT →
                    </Link>
                    {canManage && (
                      <button onClick={() => setMenuOpenFor(menuOpenFor === dish.id ? null : dish.id)}>
                        <MoreVertical size={16} className="text-charcoal" />
                      </button>
                    )}
                  </div>
                  {menuOpenFor === dish.id && (
                    <div className="absolute right-4 top-12 z-10 w-32 border border-border bg-cream shadow-md">
                      <button
                        onClick={() => handleDelete(dish)}
                        className="block w-full px-4 py-2.5 text-left text-sm text-terracotta hover:bg-mist"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}