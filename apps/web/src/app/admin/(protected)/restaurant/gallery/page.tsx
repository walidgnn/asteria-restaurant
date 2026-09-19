"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Search, MoreVertical } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth-context";
import { ImageUpload } from "@/components/admin/ImageUpload";

type GalleryImage = { id: string; title: string | null; url: string; section: string; isActive: boolean };

const SECTIONS = ["all", "homepage", "menu", "our-story", "gallery", "restaurant"];

function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  if (url.startsWith("/")) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default function GalleryPage() {
  const { token, hasPermission } = useAdminAuth();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [section, setSection] = useState("all");
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const canManage = hasPermission("restaurant.manage");

  async function load() {
    const res = await fetch(`${API_URL}/admin/restaurant/gallery?section=${section}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setImages(await res.json());
  }

  useEffect(() => {
    if (!token) return;
    load();
  }, [token, section]);

  const filtered = images.filter((img) =>
    (img.title ?? "").toLowerCase().includes(search.toLowerCase())
  );

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await fetch(`${API_URL}/admin/restaurant/gallery`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        title: form.get("title"),
        url: form.get("url"),
        section: form.get("section"),
      }),
    });
    setShowUpload(false);
    await load();
  }

  async function toggleActive(img: GalleryImage) {
    await fetch(`${API_URL}/admin/restaurant/gallery/${img.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ isActive: !img.isActive }),
    });
    await load();
  }

  async function handleDelete(img: GalleryImage) {
    if (!confirm("Delete this image?")) return;
    await fetch(`${API_URL}/admin/restaurant/gallery/${img.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setMenuOpenFor(null);
    await load();
  }

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-4xl text-charcoal">Gallery</h1>
          <p className="mt-2 text-stone">Manage the photography used across the Asteria website.</p>
        </div>
        {canManage && (
          <button onClick={() => setShowUpload(true)} className="bg-olive px-6 py-3 text-sm font-medium tracking-wide text-white hover:bg-olive-dark">
            + UPLOAD PHOTOS
          </button>
        )}
      </div>

      {showUpload && (
        <UploadForm
          onCancel={() => setShowUpload(false)}
          onSubmit={async (data) => {
            await fetch(`${API_URL}/admin/restaurant/gallery`, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify(data),
            });
            setShowUpload(false);
            await load();
          }}
        />
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="relative min-w-[240px] flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search gallery..."
            className="w-full border border-border bg-transparent py-2.5 pl-9 pr-3 text-sm text-charcoal focus:border-charcoal focus:outline-none"
          />
        </div>
        <div className="flex gap-6 border-b border-border">
          {SECTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={`pb-2 text-xs font-medium tracking-wide capitalize ${section === s ? "border-b-2 border-terracotta text-charcoal" : "text-stone hover:text-charcoal"}`}
            >
              {s.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm text-stone">{filtered.length} PHOTOS</p>

      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((img) => (
          <div key={img.id} className={`relative border border-border ${!img.isActive ? "opacity-50" : ""}`}>
            <div className="relative aspect-square w-full bg-mist">
              {isValidImageUrl(img.url) ? (
                <Image src={img.url} alt={img.title ?? ""} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-stone">
                  Invalid image URL
                </div>
              )}
              {canManage && (
                <button
                  onClick={() => setMenuOpenFor(menuOpenFor === img.id ? null : img.id)}
                  className="absolute right-2 top-2 rounded-full bg-cream/90 p-1.5"
                >
                  <MoreVertical size={14} className="text-charcoal" />
                </button>
              )}
              {menuOpenFor === img.id && (
                <div className="absolute right-2 top-10 z-10 w-32 border border-border bg-cream shadow-md">
                  <button onClick={() => toggleActive(img)} className="block w-full px-4 py-2 text-left text-xs text-charcoal hover:bg-mist">
                    {img.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => handleDelete(img)} className="block w-full px-4 py-2 text-left text-xs text-terracotta hover:bg-mist">
                    Delete
                  </button>
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="font-serif text-lg text-charcoal">{img.title ?? "Untitled"}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="bg-mist px-2 py-0.5 text-xs capitalize text-charcoal">{img.section.replace("-", " ")}</span>
                <span className={`flex items-center gap-1 text-xs ${img.isActive ? "text-charcoal" : "text-stone"}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${img.isActive ? "bg-olive" : "bg-stone"}`} />
                  {img.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UploadForm({
  onCancel,
  onSubmit,
}: {
  onCancel: () => void;
  onSubmit: (data: { title: string; url: string; section: string }) => void;
}) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [section, setSection] = useState("gallery");

  return (
    <div className="mt-6 flex flex-wrap items-end gap-4 border border-border p-6">
      <ImageUpload value={url} onChange={setUrl} />
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none"
      />
      <select
        value={section}
        onChange={(e) => setSection(e.target.value)}
        className="border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none"
      >
        {SECTIONS.filter((s) => s !== "all").map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <button
        onClick={() => url && onSubmit({ title, url, section })}
        disabled={!url}
        className="bg-olive px-6 py-2.5 text-sm font-medium tracking-wide text-white hover:bg-olive-dark disabled:opacity-50"
      >
        ADD
      </button>
      <button onClick={onCancel} className="text-sm font-medium tracking-wide text-charcoal">
        CANCEL
      </button>
    </div>
  );
}