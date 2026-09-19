"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "@/lib/admin-auth-context";

export default function RestaurantInfoPage() {
  const { token, hasPermission } = useAdminAuth();
  const [data, setData] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  const canManage = hasPermission("restaurant.manage");

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/admin/restaurant/info`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then(setData);
  }, [token]);

  function update(field: string, value: any) {
    setData((d: any) => ({ ...d, [field]: value }));
  }

  async function handleSave() {
    await fetch(`${API_URL}/admin/restaurant/info`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name: data.name, tagline: data.tagline, cuisine: data.cuisine, description: data.description,
        phone: data.phone, email: data.email, website: data.website,
        address: data.address, city: data.city, state: data.state, postalCode: data.postalCode, country: data.country, locationNotes: data.locationNotes,
        instagramUrl: data.instagramUrl, facebookUrl: data.facebookUrl, pinterestUrl: data.pinterestUrl,
        reservationsEnabled: data.reservationsEnabled, orderingEnabled: data.orderingEnabled, pickupEnabled: data.pickupEnabled, deliveryEnabled: data.deliveryEnabled,
        heroTagline: data.heroTagline, storyTitle: data.storyTitle, storyText: data.storyText,
      }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function toggleOpen() {
    const res = await fetch(`${API_URL}/admin/restaurant/info`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ isOpen: !data.isOpen }),
    });
    setData(await res.json());
  }

  if (!data) return <p className="text-stone">Loading...</p>;

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-4xl text-charcoal">Restaurant Information</h1>
          <p className="mt-2 text-stone">Manage the information customers see across Asteria.</p>
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

      <div className="mt-6 flex items-center justify-between border border-border px-6 py-4">
        <p className="flex items-center gap-2 text-sm text-charcoal">
          <span className={`h-2 w-2 rounded-full ${data.isOpen ? "bg-olive" : "bg-terracotta"}`} />
          CURRENT STATUS: {data.isOpen ? "OPEN" : "CLOSED"}
        </p>
        {canManage && (
          <button onClick={toggleOpen} className="border border-border px-4 py-2 text-xs font-medium tracking-wide text-charcoal hover:border-charcoal">
            CHANGE STATUS
          </button>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="border border-border px-6 py-6">
            <p className="text-xs font-medium tracking-wide text-terracotta">PROFILE</p>
            <h2 className="mt-1 font-serif text-2xl text-charcoal">Core Identity</h2>
            <div className="mt-4 grid grid-cols-2 gap-5">
              <Field label="Restaurant Name" field="name" data={data} onChange={update} canManage={canManage} />
              <Field label="Tagline" field="tagline" data={data} onChange={update} canManage={canManage} />
            </div>
            <div className="mt-5">
              <Field label="Cuisine" field="cuisine" data={data} onChange={update} canManage={canManage} />
            </div>
            <div className="mt-5">
              <Field label="Short Description" field="description" textarea data={data} onChange={update} canManage={canManage} />
            </div>
          </div>

          <div className="border border-border px-6 py-6">
            <p className="text-xs font-medium tracking-wide text-terracotta">VENUE</p>
            <h2 className="mt-1 font-serif text-2xl text-charcoal">Location</h2>
            <div className="mt-4">
              <Field label="Street Address" field="address" data={data} onChange={update} canManage={canManage} />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-5">
              <Field label="City" field="city" data={data} onChange={update} canManage={canManage} />
              <Field label="State / Province" field="state" data={data} onChange={update} canManage={canManage} />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-5">
              <Field label="Postal Code" field="postalCode" data={data} onChange={update} canManage={canManage} />
              <Field label="Country" field="country" data={data} onChange={update} canManage={canManage} />
            </div>
            <div className="mt-5">
              <Field label="Location Notes (Internal)" field="locationNotes" data={data} onChange={update} canManage={canManage} />
            </div>
          </div>

          <div className="border border-border px-6 py-6">
            <p className="text-xs font-medium tracking-wide text-terracotta">WEBSITE DISPLAY</p>
            <h2 className="mt-1 font-serif text-2xl text-charcoal">Brand Story</h2>
            <div className="mt-4 grid grid-cols-2 gap-6">
              <div className="space-y-5">
                <Field label="Hero Tagline" field="heroTagline" data={data} onChange={update} canManage={canManage} />
                <Field label="Our Story Title" field="storyTitle" data={data} onChange={update} canManage={canManage} />
              </div>
              <Field label="Our Story (Full Text)" field="storyText" textarea data={data} onChange={update} canManage={canManage} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-border px-6 py-6">
            <p className="text-xs font-medium tracking-wide text-terracotta">CONTACT</p>
            <h2 className="mt-1 font-serif text-xl text-charcoal">Reach Us</h2>
            <div className="mt-4 space-y-4">
              <Field label="Phone Number" field="phone" data={data} onChange={update} canManage={canManage} />
              <Field label="Email Address" field="email" data={data} onChange={update} canManage={canManage} />
              <Field label="Website" field="website" data={data} onChange={update} canManage={canManage} />
            </div>
          </div>

          <div className="border border-border px-6 py-6">
            <p className="text-xs font-medium tracking-wide text-terracotta">DIGITAL</p>
            <h2 className="mt-1 font-serif text-xl text-charcoal">Social Links</h2>
            <div className="mt-4 space-y-4">
              <Field label="Instagram" field="instagramUrl" data={data} onChange={update} canManage={canManage} />
              <Field label="Facebook" field="facebookUrl" data={data} onChange={update} canManage={canManage} />
              <Field label="Pinterest" field="pinterestUrl" data={data} onChange={update} canManage={canManage} />
            </div>
          </div>

          <div className="border border-border px-6 py-6">
            <p className="text-xs font-medium tracking-wide text-terracotta">OPERATIONS</p>
            <h2 className="mt-1 font-serif text-xl text-charcoal">Services</h2>
            <div className="mt-4 space-y-4">
              {[
                { label: "Reservations Enabled", field: "reservationsEnabled" },
                { label: "Ordering Enabled", field: "orderingEnabled" },
                { label: "Pickup Enabled", field: "pickupEnabled" },
                { label: "Delivery Enabled", field: "deliveryEnabled" },
              ].map(({ label, field }) => (
                <div key={field} className="flex items-center justify-between">
                  <span className="text-sm text-charcoal">{label}</span>
                  <button
                    onClick={() => canManage && update(field, !data[field])}
                    style={{ backgroundColor: data[field] ? "#4C5844" : "#E4E0D6" }}
                    className="relative h-6 w-11 rounded-full"
                  >
                    <span
                      style={{ left: data[field] ? "22px" : "2px" }}
                      className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all"
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  field,
  textarea,
  data,
  onChange,
  canManage,
}: {
  label: string;
  field: string;
  textarea?: boolean;
  data: any;
  onChange: (field: string, value: string) => void;
  canManage: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-medium tracking-wide text-stone">{label.toUpperCase()}</label>
      {textarea ? (
        <textarea
          value={data[field] ?? ""}
          onChange={(e) => onChange(field, e.target.value)}
          disabled={!canManage}
          rows={3}
          className="mt-2 w-full border border-border bg-transparent px-3 py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none"
        />
      ) : (
        <input
          value={data[field] ?? ""}
          onChange={(e) => onChange(field, e.target.value)}
          disabled={!canManage}
          className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none"
        />
      )}
    </div>
  );
}