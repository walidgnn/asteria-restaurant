"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";

type Preferences = {
  marketingOptIn: boolean;
  reservationReminders: boolean;
};

export default function SettingsPage() {
  const { token, logout } = useAuth();
  const [prefs, setPrefs] = useState<Preferences | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteNotice, setShowDeleteNotice] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:3001/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) =>
        setPrefs({
          marketingOptIn: data.marketingOptIn,
          reservationReminders: data.reservationReminders,
        })
      );
  }, [token]);

  async function updatePref(key: keyof Preferences, value: boolean) {
    setPrefs((p) => (p ? { ...p, [key]: value } : p));
    await fetch("http://localhost:3001/auth/me", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ [key]: value }),
    });
  }

  return (
    <div>
      <h1 className="font-serif text-4xl text-charcoal">Settings</h1>
      <p className="mt-3 text-stone">Manage your preferences and account security.</p>

      <div className="mt-10 border-t border-border pt-8">
        <h2 className="font-serif text-2xl text-charcoal">
          Communication Preferences
        </h2>

        <div className="mt-6 flex items-center justify-between border-b border-border py-5">
          <div>
            <p className="text-sm font-medium text-charcoal">ORDER UPDATES</p>
            <p className="mt-1 text-sm text-stone">
              Essential notifications about your dining experience.
            </p>
          </div>
          <span className="whitespace-nowrap text-sm italic text-stone">Always on</span>
        </div>

        <div className="flex items-center justify-between border-b border-border py-5">
          <div>
            <p className="text-sm font-medium text-charcoal">RESERVATION REMINDERS</p>
            <p className="mt-1 text-sm text-stone">
              Receive timely reminders before your scheduled visit.
            </p>
          </div>
          <Toggle
            checked={prefs?.reservationReminders ?? true}
            onChange={(v) => updatePref("reservationReminders", v)}
          />
        </div>

        <div className="flex items-center justify-between py-5">
          <div>
            <p className="text-sm font-medium text-charcoal">MARKETING EMAILS</p>
            <p className="mt-1 text-sm text-stone">
              Exclusive invitations, seasonal menus, and brand stories.
            </p>
          </div>
          <Toggle
            checked={prefs?.marketingOptIn ?? false}
            onChange={(v) => updatePref("marketingOptIn", v)}
          />
        </div>
      </div>

      <div className="mt-10 border-t border-border pt-8">
        <h2 className="font-serif text-2xl text-charcoal">Password &amp; Security</h2>
        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-charcoal">Account Password</p>
            <p className="mt-1 text-sm text-stone">Keep your account secure.</p>
          </div>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="bg-olive px-6 py-2.5 text-sm font-medium tracking-wide text-white hover:bg-olive-dark"
          >
            CHANGE PASSWORD
          </button>
        </div>
      </div>

      <div className="mt-10 border-t border-border pt-8">
        <h2 className="font-serif text-2xl text-charcoal">Current Session</h2>
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-stone">
            You&apos;re currently signed in on this device.
          </p>
          <button
            onClick={logout}
            className="border border-border px-6 py-2.5 text-sm font-medium tracking-wide text-charcoal hover:border-charcoal"
          >
            LOG OUT
          </button>
        </div>
      </div>

      <div className="mt-10 border-t border-border pt-8">
        {showDeleteNotice ? (
          <p className="text-sm text-stone">
            To delete your account, please contact us at{" "}
            <a href="mailto:hello@asteria-restaurant.com" className="text-terracotta">
              hello@asteria-restaurant.com
            </a>{" "}
            — we want to make sure your order and reservation history is
            handled properly.
          </p>
        ) : (
          <button
            onClick={() => setShowDeleteNotice(true)}
            className="text-sm font-medium tracking-wide text-terracotta hover:text-charcoal"
          >
            DELETE ACCOUNT
          </button>
        )}
      </div>

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        backgroundColor: checked ? "#4C5844" : "#E4E0D6",
        position: "relative",
        width: "44px",
        height: "24px",
        borderRadius: "9999px",
        flexShrink: 0,
      }}
      aria-pressed={checked}
    >
      <span
        style={{
          position: "absolute",
          top: "2px",
          left: checked ? "22px" : "2px",
          height: "20px",
          width: "20px",
          borderRadius: "9999px",
          backgroundColor: "white",
          transition: "left 0.15s ease",
        }}
      />
    </button>
  );
}