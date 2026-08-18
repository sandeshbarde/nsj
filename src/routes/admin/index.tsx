import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const authenticated = localStorage.getItem(
        "nsj_admin_authenticated",
      );

      if (authenticated !== "true") {
        throw redirect({
          to: "/admin/login",
        });
      }
    }
  },

  component: AdminIndex,
});

function AdminIndex() {
  return null;
}