import { createFileRoute, redirect } from "@tanstack/react-router";
import { requireAdmin } from "@/lib/admin";

export const Route = createFileRoute("/admin/")({
  beforeLoad: async () => {
    await requireAdmin();
    throw redirect({ to: "/admin/dashboard" });
  },

  component: AdminIndex,
});

function AdminIndex() {
  return null;
}
