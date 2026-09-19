"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth-context";
import { API_URL } from "@/lib/config";

export function ImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const { token } = useAdminAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/admin/upload/image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Upload failed.");
      }
      const data = await res.json();
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <label className="text-xs font-medium tracking-wide text-stone">IMAGE</label>

      {value ? (
        <div className="relative mt-2 aspect-square w-32 overflow-hidden border border-border">
          <Image src={value} alt="Uploaded" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-1 top-1 rounded-full bg-cream/90 p-1"
          >
            <X size={14} className="text-charcoal" />
          </button>
        </div>
      ) : (
        <label className="mt-2 flex aspect-square w-32 cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-border text-stone hover:border-charcoal">
          <Upload size={20} />
          <span className="text-xs">{uploading ? "Uploading..." : "Upload"}</span>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
        </label>
      )}

      {error && <p className="mt-2 text-xs text-terracotta">{error}</p>}
    </div>
  );
}