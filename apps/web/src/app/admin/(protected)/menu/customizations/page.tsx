"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth-context";

type Option = { id: string; name: string; priceModifier: string; isAvailable: boolean };
type Group = {
  id: string;
  name: string;
  isRequired: boolean;
  allowMultiple: boolean;
  isActive: boolean;
  options: Option[];
  dishes: { dishId: string }[];
};

export default function AdminCustomizationsPage() {
  const { token, hasPermission } = useAdminAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [showNewOptionFor, setShowNewOptionFor] = useState<string | null>(null);
  const canManage = hasPermission("menu.manage");

  async function load() {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    const res = await fetch(`http://192.168.100.10:3001/admin/menu/customizations?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setGroups(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    if (!token) return;
    load();
  }, [token, search]);

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleCreateGroup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await fetch("http://192.168.100.10:3001/admin/menu/customizations", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name: form.get("name"),
        isRequired: form.get("isRequired") === "on",
        allowMultiple: form.get("allowMultiple") === "on",
      }),
    });
    setShowNewGroup(false);
    await load();
  }

  async function handleAddOption(groupId: string, e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await fetch(`http://192.168.100.10:3001/admin/menu/customizations/${groupId}/options`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name: form.get("name"),
        priceModifier: parseFloat(form.get("priceModifier") as string) || 0,
      }),
    });
    setShowNewOptionFor(null);
    await load();
  }

  async function toggleOptionAvailable(option: Option) {
    await fetch(`http://192.168.100.10:3001/admin/menu/customizations/options/${option.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ isAvailable: !option.isAvailable }),
    });
    await load();
  }

  async function handleDeleteOption(option: Option) {
    if (!confirm(`Delete option "${option.name}"?`)) return;
    const res = await fetch(`http://192.168.100.10:3001/admin/menu/customizations/options/${option.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      alert(err?.message || "Failed to delete option.");
    }
    await load();
  }

  async function handleDeleteGroup(group: Group) {
    if (!confirm(`Delete group "${group.name}"?`)) return;
    const res = await fetch(`http://192.168.100.10:3001/admin/menu/customizations/${group.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      alert(err?.message || "Failed to delete group.");
    }
    await load();
  }

  function ruleText(group: Group) {
    if (group.isRequired && !group.allowMultiple) return "Choose exactly 1";
    if (!group.isRequired && group.allowMultiple) return "Choose up to " + group.options.length;
    if (group.isRequired && group.allowMultiple) return "Choose 1 or more";
    return "Optional";
  }

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-4xl text-charcoal">Customizations</h1>
          <p className="mt-2 text-stone">Manage the options guests can add or select with their dishes.</p>
        </div>
        {canManage && (
          <button
            onClick={() => setShowNewGroup(true)}
            className="bg-olive px-6 py-3 text-sm font-medium tracking-wide text-white hover:bg-olive-dark"
          >
            + NEW CUSTOMIZATION GROUP
          </button>
        )}
      </div>

      {showNewGroup && (
        <form onSubmit={handleCreateGroup} className="mt-6 flex flex-wrap items-end gap-4 border border-border p-6">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-medium tracking-wide text-stone">GROUP NAME</label>
            <input name="name" required className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none" />
          </div>
          <label className="flex items-center gap-2 text-sm text-charcoal">
            <input type="checkbox" name="isRequired" /> Required
          </label>
          <label className="flex items-center gap-2 text-sm text-charcoal">
            <input type="checkbox" name="allowMultiple" /> Allow multiple
          </label>
          <button type="submit" className="bg-olive px-6 py-2.5 text-sm font-medium tracking-wide text-white hover:bg-olive-dark">
            CREATE
          </button>
          <button type="button" onClick={() => setShowNewGroup(false)} className="text-sm font-medium tracking-wide text-charcoal">
            CANCEL
          </button>
        </form>
      )}

      <div className="relative mt-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customization groups or options..."
          className="w-full border border-border bg-transparent py-2.5 pl-9 pr-3 text-sm text-charcoal focus:border-charcoal focus:outline-none"
        />
      </div>

      <div className="mt-6 space-y-4">
        {groups.map((group) => {
          const isOpen = expanded.has(group.id);
          return (
            <div key={group.id} className="border border-border">
              <div className="flex items-center justify-between px-6 py-5">
                <button onClick={() => toggleExpand(group.id)} className="flex items-center gap-4 text-left">
                  {isOpen ? <ChevronUp size={18} className="text-charcoal" /> : <ChevronDown size={18} className="text-charcoal" />}
                  <div>
                    <p className="font-serif text-xl text-charcoal">{group.name.toUpperCase()}</p>
                    <p className="mt-1 flex items-center gap-2 text-xs text-stone">
                      <span className={`px-2 py-0.5 ${group.isActive ? "bg-[#E8ECE3]" : "bg-mist"}`}>
                        {group.isActive ? "Active" : "Inactive"}
                      </span>
                      · {group.options.length} options · Used by {group.dishes.length} dishes · {ruleText(group)}
                    </p>
                  </div>
                </button>
                {canManage && (
                  <button onClick={() => handleDeleteGroup(group)} className="text-xs font-medium tracking-wide text-terracotta">
                    DELETE GROUP
                  </button>
                )}
              </div>

              {isOpen && (
                <div className="border-t border-border">
                  {group.options.map((opt) => (
                    <div key={opt.id} className="flex items-center justify-between border-b border-border px-6 py-4 last:border-0">
                      <span className="text-charcoal">{opt.name}</span>
                      <div className="flex items-center gap-6">
                        <span className="text-terracotta">
                          {Number(opt.priceModifier) > 0 ? `+€${Number(opt.priceModifier).toFixed(2)}` : "+€0.00"}
                        </span>
                        <button
                          onClick={() => canManage && toggleOptionAvailable(opt)}
                          className="flex items-center gap-1.5 text-sm text-charcoal"
                        >
                          <span className={`h-2 w-2 rounded-full ${opt.isAvailable ? "bg-olive" : "bg-stone"}`} />
                          {opt.isAvailable ? "Available" : "Unavailable"}
                        </button>
                        {canManage && (
                          <button onClick={() => handleDeleteOption(opt)} className="text-xs text-terracotta">
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {canManage && (
                    <div className="px-6 py-4">
                      {showNewOptionFor === group.id ? (
                        <form onSubmit={(e) => handleAddOption(group.id, e)} className="flex flex-wrap items-end gap-4">
                          <input name="name" required placeholder="Option name" className="border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none" />
                          <input name="priceModifier" type="number" step="0.01" placeholder="Price (+€)" className="w-32 border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none" />
                          <button type="submit" className="bg-olive px-4 py-2 text-xs font-medium tracking-wide text-white hover:bg-olive-dark">
                            ADD
                          </button>
                          <button type="button" onClick={() => setShowNewOptionFor(null)} className="text-xs font-medium tracking-wide text-charcoal">
                            CANCEL
                          </button>
                        </form>
                      ) : (
                        <button onClick={() => setShowNewOptionFor(group.id)} className="text-xs font-medium tracking-wide text-terracotta">
                          + ADD OPTION
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}