"use client";

import { useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth-context";

type Table = {
  id: string;
  number: string;
  capacity: number;
  status: string;
  currentPartySize: number | null;
  seatedAt: string | null;
  unavailableReason: string | null;
  reservations: { partySize: number; reservationDate: string; customer: { firstName: string; lastName: string } }[];
};

const TABS = ["ALL", "AVAILABLE", "OCCUPIED", "RESERVED", "UNAVAILABLE"];

const STATUS_DOT: Record<string, string> = {
  AVAILABLE: "bg-charcoal",
  OCCUPIED: "bg-charcoal",
  RESERVED: "bg-terracotta",
  UNAVAILABLE: "bg-stone",
};

export default function AdminTablesPage() {
  const { token, hasPermission } = useAdminAuth();
  const [tables, setTables] = useState<Table[]>([]);
  const [stats, setStats] = useState({ total: 0, available: 0, occupied: 0, reserved: 0, unavailable: 0 });
  const [tab, setTab] = useState("ALL");
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const [manageTable, setManageTable] = useState<Table | null>(null);
  const [showNew, setShowNew] = useState(false);
  const canManage = hasPermission("tables.manage");

  async function load() {
    const params = new URLSearchParams();
    if (tab !== "ALL") params.set("status", tab);
    const res = await fetch(`http://localhost:3001admin/tables?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTables(data.tables);
    setStats(data.stats);
  }

  useEffect(() => {
    if (!token) return;
    load();
  }, [token, tab]);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await fetch("http://localhost:3001admin/tables", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        number: form.get("number"),
        capacity: parseInt(form.get("capacity") as string),
      }),
    });
    setShowNew(false);
    await load();
  }

  async function handleDelete(table: Table) {
    if (!confirm(`Delete table ${table.number}?`)) return;
    const res = await fetch(`http://localhost:3001admin/tables/${table.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      alert(err?.message || "Failed to delete table.");
    }
    setMenuOpenFor(null);
    await load();
  }

  return (
    <div>
      <p className="mb-2 flex items-center gap-2 text-sm font-medium tracking-[0.2em] text-terracotta">
        <span className="h-px w-6 bg-terracotta" />
        MANAGEMENT
      </p>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-4xl text-charcoal">Tables</h1>
          <p className="mt-2 text-stone">Manage table availability, capacity, and assignments.</p>
        </div>
        {canManage && (
          <button
            onClick={() => setShowNew(true)}
            className="bg-olive px-6 py-3 text-sm font-medium tracking-wide text-white hover:bg-olive-dark"
          >
            + NEW TABLE
          </button>
        )}
      </div>

      {showNew && (
        <form onSubmit={handleCreate} className="mt-6 flex flex-wrap items-end gap-4 border border-border p-6">
          <div>
            <label className="text-xs font-medium tracking-wide text-stone">TABLE NUMBER</label>
            <input name="number" required placeholder="T13" className="mt-2 w-32 border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none" />
          </div>
          <div>
            <label className="text-xs font-medium tracking-wide text-stone">CAPACITY</label>
            <input name="capacity" type="number" min="1" required className="mt-2 w-32 border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none" />
          </div>
          <button type="submit" className="bg-olive px-6 py-2.5 text-sm font-medium tracking-wide text-white hover:bg-olive-dark">
            CREATE
          </button>
          <button type="button" onClick={() => setShowNew(false)} className="text-sm font-medium tracking-wide text-charcoal">
            CANCEL
          </button>
        </form>
      )}

      <p className="mt-6 text-sm text-charcoal">
        <span className="font-serif text-lg">{stats.total}</span> TABLES ·{" "}
        <span className="text-charcoal">● {stats.available} AVAILABLE</span> ·{" "}
        <span className="text-charcoal">● {stats.occupied} OCCUPIED</span> ·{" "}
        <span className="text-terracotta">● {stats.reserved} RESERVED</span>
      </p>

      <div className="mt-4 flex gap-8 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 text-sm font-medium tracking-wide ${
              tab === t ? "border-b-2 border-terracotta text-charcoal" : "text-stone hover:text-charcoal"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {tables.map((table) => {
          const isUnavailable = table.status === "UNAVAILABLE";
          const upcomingReservation = table.reservations[0];
          return (
            <div
              key={table.id}
              className={`relative border border-border p-6 ${isUnavailable ? "opacity-50" : ""}`}
            >
              <div className="flex items-start justify-between">
                <p className="font-serif text-2xl text-charcoal">{table.number}</p>
                {canManage && (
                  <button onClick={() => setMenuOpenFor(menuOpenFor === table.id ? null : table.id)}>
                    <MoreVertical size={16} className="text-charcoal" />
                  </button>
                )}
              </div>
              <p className="text-sm text-stone">{table.capacity} SEATS</p>

              <div className="mt-4 border-t border-border pt-4">
                <p className="flex items-center gap-2 text-sm text-charcoal">
                  <span className={`h-2 w-2 rounded-full ${STATUS_DOT[table.status]}`} />
                  {table.status}
                </p>
                {table.status === "OCCUPIED" && (
                  <div className="mt-2">
                    <p className="text-sm text-stone">{table.currentPartySize} guests</p>
                    {table.seatedAt && (
                      <p className="text-xs italic text-stone">
                        Seated {new Date(table.seatedAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                      </p>
                    )}
                  </div>
                )}
                {table.status === "RESERVED" && upcomingReservation && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-charcoal">
                      {upcomingReservation.customer.firstName.toUpperCase()} {upcomingReservation.customer.lastName.toUpperCase()}
                    </p>
                    <p className="text-xs text-stone">
                      {new Date(upcomingReservation.reservationDate).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })} · {upcomingReservation.partySize} guests
                    </p>
                  </div>
                )}
                {table.status === "UNAVAILABLE" && table.unavailableReason && (
                  <p className="mt-2 text-sm italic text-stone">{table.unavailableReason}</p>
                )}
              </div>

              {canManage && (
                <button
                  onClick={() => setManageTable(table)}
                  className="mt-4 block border-t border-border pt-4 text-sm font-medium tracking-wide text-charcoal"
                >
                  MANAGE →
                </button>
              )}

              {menuOpenFor === table.id && (
                <div className="absolute right-4 top-10 z-10 w-32 border border-border bg-cream shadow-md">
                  <button onClick={() => handleDelete(table)} className="block w-full px-4 py-2.5 text-left text-sm text-terracotta hover:bg-mist">
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {manageTable && (
        <ManageTableModal
          table={manageTable}
          token={token}
          onClose={() => setManageTable(null)}
          onSaved={() => {
            setManageTable(null);
            load();
          }}
        />
      )}
    </div>
  );
}

function ManageTableModal({
  table,
  token,
  onClose,
  onSaved,
}: {
  table: Table;
  token: string | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [status, setStatus] = useState(table.status);
  const [partySize, setPartySize] = useState(table.currentPartySize ?? table.capacity);
  const [reason, setReason] = useState(table.unavailableReason ?? "");

  async function handleSave() {
    await fetch(`http://localhost:3001admin/tables/${table.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        status,
        partySize: status === "OCCUPIED" ? partySize : undefined,
        reason: status === "UNAVAILABLE" ? reason : undefined,
      }),
    });
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-cream px-8 py-8">
        <h2 className="font-serif text-2xl text-charcoal">Manage Table {table.number}</h2>
        <p className="mt-1 text-sm text-stone">{table.capacity} seats</p>

        <div className="mt-6">
          <label className="text-xs font-medium tracking-wide text-stone">STATUS</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none"
          >
            <option value="AVAILABLE">Available</option>
            <option value="OCCUPIED">Occupied</option>
            <option value="UNAVAILABLE">Unavailable</option>
          </select>
        </div>

        {status === "OCCUPIED" && (
          <div className="mt-4">
            <label className="text-xs font-medium tracking-wide text-stone">PARTY SIZE</label>
            <input
              type="number"
              min={1}
              value={partySize}
              onChange={(e) => setPartySize(parseInt(e.target.value))}
              className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none"
            />
          </div>
        )}

        {status === "UNAVAILABLE" && (
          <div className="mt-4">
            <label className="text-xs font-medium tracking-wide text-stone">REASON</label>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Maintenance"
              className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm text-charcoal placeholder:text-stone/60 focus:border-charcoal focus:outline-none"
            />
          </div>
        )}

        <div className="mt-8 flex gap-4">
          <button onClick={handleSave} className="flex-1 bg-olive px-6 py-3 text-sm font-medium tracking-wide text-white hover:bg-olive-dark">
            SAVE
          </button>
          <button onClick={onClose} className="text-sm font-medium tracking-wide text-charcoal">
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}