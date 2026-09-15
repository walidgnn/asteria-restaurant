"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "@/lib/admin-auth-context";

type Staff = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  lastLoginAt: string | null;
  role: string;
  roleId: string | null;
};
type Role = { id: string; name: string; permissions: { permission: { id: string; name: string } }[] };
type Permission = { id: string; name: string };

const AREAS = ["dashboard", "orders", "reservations", "menu", "tables", "customers", "restaurant", "staff"];

export default function StaffSettingsPage() {
  const { token, staff: me, hasPermission } = useAdminAuth();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [showInvite, setShowInvite] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isManager = me?.roles.includes("Manager") ?? false;

  async function load() {
    const [staffRes, rolesRes, permsRes] = await Promise.all([
      fetch("http://localhost:3001admin/staff", { headers: { Authorization: `Bearer ${token}` } }),
      fetch("http://localhost:3001admin/staff/roles", { headers: { Authorization: `Bearer ${token}` } }),
      fetch("http://localhost:3001admin/staff/permissions", { headers: { Authorization: `Bearer ${token}` } }),
    ]);
    const staffData = await staffRes.json();
    const rolesData = await rolesRes.json();
    const permsData = await permsRes.json();
    setStaff(staffData);
    setRoles(rolesData);
    setPermissions(permsData);
    if (!selectedRoleId && rolesData.length) setSelectedRoleId(rolesData[0].id);
  }

  useEffect(() => {
    if (!token) return;
    load();
  }, [token]);

  const selectedRole = roles.find((r) => r.id === selectedRoleId);
  const rolePermissionNames = new Set(selectedRole?.permissions.map((p) => p.permission.name) ?? []);

  async function handleInvite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await fetch("http://localhost:3001admin/staff/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        firstName: form.get("firstName"),
        lastName: form.get("lastName"),
        email: form.get("email"),
        roleId: form.get("roleId"),
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      setError(err?.message || "Failed to invite staff member.");
      return;
    }
    setShowInvite(false);
    await load();
  }

  async function handleResend(id: string) {
    await fetch(`http://localhost:3001admin/staff/${id}/resend`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    await load();
  }

  async function togglePermission(permissionId: string) {
    if (!selectedRole) return;
    const has = rolePermissionNames.has(permissions.find((p) => p.id === permissionId)?.name ?? "");
    const currentIds = selectedRole.permissions.map((p) => p.permission.id);
    const nextIds = has ? currentIds.filter((id) => id !== permissionId) : [...currentIds, permissionId];

    await fetch(`http://localhost:3001admin/staff/roles/${selectedRole.id}/permissions`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ permissionIds: nextIds }),
    });
    await load();
  }

  function findPermId(area: string, action: "view" | "manage") {
    return permissions.find((p) => p.name === `${area}.${action}`)?.id;
  }

  function hasPerm(area: string, action: "view" | "manage") {
    return rolePermissionNames.has(`${area}.${action}`);
  }

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-4xl text-charcoal">Staff &amp; Permissions</h1>
          <p className="mt-2 text-stone">Manage your restaurant team and control access to Asteria.</p>
        </div>
        {isManager && (
          <button onClick={() => setShowInvite(true)} className="bg-olive px-6 py-3 text-sm font-medium tracking-wide text-white hover:bg-olive-dark">
            + INVITE STAFF
          </button>
        )}
      </div>

      {showInvite && (
        <div className="mt-6 border border-border p-6">
          {error && <p className="mb-4 text-sm text-terracotta">{error}</p>}
          <form onSubmit={handleInvite} className="flex flex-wrap items-end gap-4">
            <input name="firstName" required placeholder="First Name" className="border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none" />
            <input name="lastName" required placeholder="Last Name" className="border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none" />
            <input name="email" type="email" required placeholder="Email" className="border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none" />
            <select name="roleId" required className="border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none">
              {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <button type="submit" className="bg-olive px-6 py-2.5 text-sm font-medium tracking-wide text-white hover:bg-olive-dark">
              SEND INVITE
            </button>
            <button type="button" onClick={() => setShowInvite(false)} className="text-sm font-medium tracking-wide text-charcoal">
              CANCEL
            </button>
          </form>
        </div>
      )}

      <div className="mt-8 flex gap-10">
        <div>
          <p className="font-serif text-2xl text-charcoal">{staff.length}</p>
          <p className="text-xs tracking-wide text-stone">TEAM MEMBERS</p>
        </div>
        <div>
          <p className="font-serif text-2xl text-charcoal">{staff.filter((s) => s.status === "ACTIVE").length}</p>
          <p className="text-xs tracking-wide text-stone">ACTIVE</p>
        </div>
        <div>
          <p className="font-serif text-2xl text-terracotta">{staff.filter((s) => s.status === "PENDING").length}</p>
          <p className="text-xs tracking-wide text-stone">PENDING INVITES</p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <h2 className="font-serif text-2xl text-charcoal">Staff Members</h2>
          <div className="mt-4 overflow-x-auto border border-border">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-mist">
                <tr className="text-xs tracking-wide text-stone">
                  <th className="px-4 py-3">STAFF MEMBER</th>
                  <th className="px-4 py-3">ROLE</th>
                  <th className="px-4 py-3">STATUS</th>
                  <th className="px-4 py-3">LAST ACTIVE</th>
                  {isManager && <th className="px-4 py-3">ACTION</th>}
                </tr>
              </thead>
              <tbody>
                {staff.map((s) => (
                  <tr key={s.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-4">
                      <p className="font-medium text-charcoal">{s.firstName} {s.lastName}</p>
                      <p className="text-xs text-stone">{s.email}</p>
                    </td>
                    <td className="px-4 py-4 text-charcoal">{s.role}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 text-xs font-medium tracking-wide ${s.status === "ACTIVE" ? "bg-[#E8ECE3] text-charcoal" : "bg-mist text-stone"}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-stone">
                      {s.status === "PENDING" ? "Invitation sent" : s.lastLoginAt ? new Date(s.lastLoginAt).toLocaleString() : "Never"}
                    </td>
                    {isManager && (
                      <td className="px-4 py-4">
                        {s.status === "PENDING" ? (
                          <button onClick={() => handleResend(s.id)} className="text-xs font-medium tracking-wide text-terracotta">
                            RESEND
                          </button>
                        ) : (
                          <span className="text-xs font-medium tracking-wide text-charcoal">VIEW →</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border border-border px-6 py-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-charcoal">Role &amp; Permissions</h2>
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="border border-border bg-transparent px-3 py-1.5 text-xs text-charcoal focus:border-charcoal focus:outline-none"
            >
              {roles.map((r) => <option key={r.id} value={r.id}>ROLE: {r.name}</option>)}
            </select>
          </div>

          <div className="mt-4 space-y-1">
            <div className="grid grid-cols-[1fr_60px_60px] gap-2 border-b border-border pb-2 text-xs tracking-wide text-stone">
              <span>AREA</span>
              <span className="text-center">VIEW</span>
              <span className="text-center">MANAGE</span>
            </div>
            {AREAS.map((area) => {
              const viewId = findPermId(area, "view");
              const manageId = findPermId(area, "manage");
              return (
                <div key={area} className="grid grid-cols-[1fr_60px_60px] items-center gap-2 border-b border-border py-2 text-sm">
                  <span className="capitalize text-charcoal">{area === "restaurant" ? "Restaurant" : area}</span>
                  <span className="text-center">
                    {viewId ? (
                      <input
                        type="checkbox"
                        checked={hasPerm(area, "view")}
                        onChange={() => isManager && togglePermission(viewId)}
                        disabled={!isManager}
                      />
                    ) : "—"}
                  </span>
                  <span className="text-center">
                    {manageId ? (
                      <input
                        type="checkbox"
                        checked={hasPerm(area, "manage")}
                        onChange={() => isManager && togglePermission(manageId)}
                        disabled={!isManager}
                      />
                    ) : "—"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}