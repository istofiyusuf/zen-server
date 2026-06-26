"use client";

import PageLayout from "@/components/layout/page-layout";
import { useAuthStore } from "@/lib/auth-store";
import { useToastStore } from "@/lib/toast-store";
import { FiClock, FiMail, FiShield, FiUser } from "react-icons/fi";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { addToast } = useToastStore();

  return (
    <PageLayout title="Profile">
      <div className="p-4 space-y-4">
        {/* Avatar */}
        <div className="card flex flex-col items-center py-8">
          <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center mb-4">
            <span className="text-3xl font-bold text-white">
              {user?.username?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>
          <h2 className="text-lg font-semibold text-primary">
            {user?.username || "User"}
          </h2>
          <p className="text-sm text-secondary">{user?.email || ""}</p>
          <span className="badge badge-info mt-2">{user?.role || "admin"}</span>
        </div>

        {/* Info */}
        <div className="card space-y-3">
          <InfoRow icon={FiUser} label="Username" value={user?.username || "-"} />
          <InfoRow icon={FiMail} label="Email" value={user?.email || "-"} />
          <InfoRow icon={FiShield} label="Role" value={user?.role || "admin"} />
          <InfoRow icon={FiClock} label="Joined" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"} />
        </div>
      </div>
    </PageLayout>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-secondary" />
        <span className="text-sm text-secondary">{label}</span>
      </div>
      <span className="text-sm font-medium text-primary">{value}</span>
    </div>
  );
}
