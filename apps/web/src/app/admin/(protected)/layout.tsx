import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { RequireAdminAuth } from "@/components/admin/RequireAdminAuth";

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAdminAuth>
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1">
          <AdminHeader />
          <main className="p-8">{children}</main>
        </div>
      </div>
    </RequireAdminAuth>
  );
}