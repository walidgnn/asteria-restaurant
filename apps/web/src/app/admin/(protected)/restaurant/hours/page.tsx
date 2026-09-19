"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "@/lib/admin-auth-context";
import { API_URL } from "@/lib/config";

type Hour = { dayOfWeek: number; dayName: string; openTime: string; closeTime: string; isClosed: boolean };

export default function OpeningHoursPage() {
  const { token, hasPermission } = useAdminAuth();
  const [hours, setHours] = useState<Hour[]>([]);
  const [saved, setSaved] = useState(false);
  const [copyFromDay, setCopyFromDay] = useState<number | null>(null);
  const canManage = hasPermission("restaurant.manage");

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/admin/restaurant/hours`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then(setHours);
  }, [token]);

  function updateDay(dayOfWeek: number, field: string, value: any) {
    setHours((prev) => prev.map((h) => (h.dayOfWeek === dayOfWeek ? { ...h, [field]: value } : h)));
  }

  async function handleSave() {
    await fetch(`${API_URL}/admin/restaurant/hours`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(hours.map((h) => ({ dayOfWeek: h.dayOfWeek, openTime: h.openTime, closeTime: h.closeTime, isClosed: h.isClosed }))),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const today = new Date().getDay();
  const todayHours = hours.find((h) => h.dayOfWeek === today);

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-4xl text-charcoal">Opening Hours</h1>
          <p className="mt-2 text-stone">Manage when Asteria is open and available to customers.</p>
        </div>
        {canManage && (
          <div className="flex items-center gap-3">
            {saved && <span className="text-sm text-olive">Saved.</span>}
            <button onClick={handleSave} className="bg-olive px-6 py-3 text-sm font-medium tracking-wide text-white hover:bg-olive-dark">
              SAVE CHANGES
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="border border-border px-6 py-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium tracking-wide text-terracotta">WEEKLY HOURS</p>
          </div>
          <div className="mt-4 divide-y divide-border">
            {hours.map((h) => (
              <div key={h.dayOfWeek} className="flex items-center justify-between py-4">
                <span className="w-28 text-sm font-medium text-charcoal">{h.dayName}</span>
                {canManage && !h.isClosed && (
                  <button
                    type="button"
                    onClick={() => setCopyFromDay(h.dayOfWeek)}
                    className="text-xs font-medium tracking-wide text-terracotta"
                  >
                    COPY
                  </button>
                )}
                <button
                  onClick={() => canManage && updateDay(h.dayOfWeek, "isClosed", !h.isClosed)}
                  style={{ backgroundColor: !h.isClosed ? "#4C5844" : "#E4E0D6" }}
                  className="relative h-6 w-11 rounded-full"
                >
                  <span
                    style={{ left: !h.isClosed ? "22px" : "2px" }}
                    className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all"
                  />
                </button>
                {h.isClosed ? (
                  <span className="text-sm text-stone">CLOSED</span>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={h.openTime}
                      disabled={!canManage}
                      onChange={(e) => updateDay(h.dayOfWeek, "openTime", e.target.value)}
                      className="border border-border bg-transparent px-2 py-1.5 text-sm text-charcoal focus:border-charcoal focus:outline-none"
                    />
                    <span className="text-stone">—</span>
                    <input
                      type="time"
                      value={h.closeTime}
                      disabled={!canManage}
                      onChange={(e) => updateDay(h.dayOfWeek, "closeTime", e.target.value)}
                      className="border border-border bg-transparent px-2 py-1.5 text-sm text-charcoal focus:border-charcoal focus:outline-none"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="h-fit bg-mist px-6 py-6">
          <p className="flex items-center gap-2 text-sm text-charcoal">
            <span className="h-2 w-2 rounded-full bg-olive" />
            {todayHours && !todayHours.isClosed ? "OPEN NOW" : "CLOSED NOW"}
          </p>
          <p className="mt-2 font-serif text-2xl text-charcoal">{todayHours?.dayName}</p>
          {todayHours && !todayHours.isClosed && (
            <p className="mt-1 text-sm text-stone">{todayHours.openTime} — {todayHours.closeTime}</p>
          )}
        </div>
      </div>

      {copyFromDay !== null && (
        <CopyScheduleModal
          hours={hours}
          fromDay={copyFromDay}
          onClose={() => setCopyFromDay(null)}
          onApply={(targetDays) => {
            const source = hours.find((h) => h.dayOfWeek === copyFromDay)!;
            setHours((prev) =>
              prev.map((h) =>
                targetDays.includes(h.dayOfWeek)
                  ? { ...h, openTime: source.openTime, closeTime: source.closeTime, isClosed: false }
                  : h
              )
            );
            setCopyFromDay(null);
          }}
        />
      )}
    </div>
  );
}

function CopyScheduleModal({
  hours,
  fromDay,
  onClose,
  onApply,
}: {
  hours: Hour[];
  fromDay: number;
  onClose: () => void;
  onApply: (days: number[]) => void;
}) {
  const [selected, setSelected] = useState<number[]>([]);
  const source = hours.find((h) => h.dayOfWeek === fromDay)!;

  function toggle(day: number) {
    setSelected((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-cream px-8 py-8">
        <h2 className="font-serif text-2xl text-charcoal">Copy {source.dayName}&apos;s Hours</h2>
        <p className="mt-1 text-sm text-stone">{source.openTime} — {source.closeTime}</p>
        <p className="mt-4 text-xs font-medium tracking-wide text-stone">APPLY TO:</p>
        <div className="mt-3 space-y-2">
          {hours.filter((h) => h.dayOfWeek !== fromDay).map((h) => (
            <label key={h.dayOfWeek} className="flex items-center gap-3 text-sm text-charcoal">
              <input
                type="checkbox"
                checked={selected.includes(h.dayOfWeek)}
                onChange={() => toggle(h.dayOfWeek)}
              />
              {h.dayName}
            </label>
          ))}
        </div>
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => onApply(selected)}
            disabled={selected.length === 0}
            className="flex-1 bg-olive px-6 py-3 text-sm font-medium tracking-wide text-white hover:bg-olive-dark disabled:opacity-50"
          >
            APPLY
          </button>
          <button onClick={onClose} className="text-sm font-medium tracking-wide text-charcoal">
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}