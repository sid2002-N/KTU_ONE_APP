"use client";

import { useState } from "react";
import { AdminLogin } from "@/features/admin/admin-login";
import { AdminDashboard } from "@/features/admin/admin-dashboard";

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState<string | null>(null);

  if (!adminKey) {
    return <AdminLogin onLogin={setAdminKey} />;
  }

  return (
    <AdminDashboard
      adminKey={adminKey}
      onLogout={() => setAdminKey(null)}
    />
  );
}
