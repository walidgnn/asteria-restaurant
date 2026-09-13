"use client";

import { useState } from "react";
import { useAdminAuth } from "@/lib/admin-auth-context";

export default function StaffProfilePage() {
  const { staff, token } = useAdminAuth();
  const [firstName, setFirstName] = useState(staff?.firstName ?? "");
  const [lastName, setLastName] = useState(staff?.lastName ?? "");
  const [saved, setSaved] = useState(false);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    await fetch("http://192.168.100.10:3001/admin/auth/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ firstName, lastName }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleChangePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPwError(null);
    const form = new FormData(e.currentTarget);
    const currentPassword = form.get("currentPassword") as string;
    const newPassword = form.get("newPassword") as string;
    const confirmPassword = form.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      setPwError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }

    const res = await fetch("http://192.168.100.10:3001/admin/auth/me/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      setPwError(err?.message || "Failed to change password.");
      return;
    }
    setPwSuccess(true);
    setShowPasswordForm(false);
    (e.target as HTMLFormElement).reset();
    setTimeout(() => setPwSuccess(false), 2500);
  }

  return (
    <div>
      <h1 className="font-serif text-4xl text-charcoal">Staff Profile</h1>
      <p className="mt-2 text-stone">Manage your personal information and account security.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <form onSubmit={handleSaveProfile} className="border border-border px-6 py-6">
            <p className="text-xs font-medium tracking-wide text-terracotta">PERSONAL INFORMATION</p>
            <div className="mt-4 grid grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-medium tracking-wide text-stone">FIRST NAME</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium tracking-wide text-stone">LAST NAME</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-5">
              <label className="text-xs font-medium tracking-wide text-stone">EMAIL ADDRESS</label>
              <input
                disabled
                value={staff?.email ?? ""}
                className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm text-stone"
              />
            </div>
            <div className="mt-6 flex items-center gap-3">
              {saved && <span className="text-sm text-olive">Saved.</span>}
              <button type="submit" className="bg-olive px-6 py-3 text-sm font-medium tracking-wide text-white hover:bg-olive-dark">
                SAVE CHANGES
              </button>
            </div>
          </form>

          <div className="bg-mist px-6 py-6">
            <p className="text-xs font-medium tracking-wide text-terracotta">PASSWORD &amp; SECURITY</p>
            <h3 className="mt-1 font-serif text-xl text-charcoal">Change Password</h3>

            {pwSuccess && <p className="mt-3 text-sm text-olive">Password updated successfully.</p>}

            {!showPasswordForm ? (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="mt-4 border border-border px-6 py-2.5 text-sm font-medium tracking-wide text-charcoal hover:border-charcoal"
              >
                CHANGE PASSWORD
              </button>
            ) : (
              <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
                {pwError && <p className="text-sm text-terracotta">{pwError}</p>}
                <input
                  name="currentPassword"
                  type="password"
                  required
                  placeholder="Current Password"
                  className="w-full border-b border-border bg-cream px-3 py-2 text-sm text-charcoal placeholder:text-stone/60 focus:border-charcoal focus:outline-none"
                />
                <input
                  name="newPassword"
                  type="password"
                  required
                  minLength={8}
                  placeholder="New Password"
                  className="w-full border-b border-border bg-cream px-3 py-2 text-sm text-charcoal placeholder:text-stone/60 focus:border-charcoal focus:outline-none"
                />
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="Confirm New Password"
                  className="w-full border-b border-border bg-cream px-3 py-2 text-sm text-charcoal placeholder:text-stone/60 focus:border-charcoal focus:outline-none"
                />
                <div className="flex gap-3">
                  <button type="submit" className="bg-olive px-6 py-2.5 text-sm font-medium tracking-wide text-white hover:bg-olive-dark">
                    SAVE NEW PASSWORD
                  </button>
                  <button type="button" onClick={() => setShowPasswordForm(false)} className="text-sm font-medium tracking-wide text-charcoal">
                    CANCEL
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="border border-border px-6 py-6">
          <p className="text-xs font-medium tracking-wide text-terracotta">ACCOUNT</p>
          <div className="mt-4 space-y-3 text-sm">
            <div>
              <p className="text-xs text-stone">ROLE</p>
              <p className="mt-1 text-charcoal">{staff?.roles?.[0] ?? "Staff"}</p>
            </div>
            <div>
              <p className="text-xs text-stone">PERMISSIONS</p>
              <p className="mt-1 text-charcoal">{staff?.permissions?.length ?? 0} granted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}