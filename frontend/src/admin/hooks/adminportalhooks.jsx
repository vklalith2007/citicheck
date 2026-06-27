import { useState } from "react";
import { apiFetch, clearToken } from "../../utils/apiFetch.js";

export const useAdminPortal = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* =========================
     FETCH ADMIN PROFILE
  ========================= */
  const fetchProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiFetch("/api/auth/profile");

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Not authenticated");
      }

      // API returns { success: true, user: { ... } }
      return data.user || data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     FETCH PENDING STAFF COUNT
  ========================= */
  const fetchPendingStaffCount = async () => {
    try {
      const res = await apiFetch("/api/admin/staff?approvalStatus=pending&limit=1");
      if (!res.ok) return 0;
      const data = await res.json();
      if (data.success && data.pagination) {
        return data.pagination.totalStaff || 0;
      }
      return 0;
    } catch (err) {
      console.error("Error fetching pending staff count:", err);
      return 0;
    }
  };

  /* =========================
     LOGOUT
  ========================= */
  const logoutAdmin = async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
      clearToken();
      return { success: true };
    } catch (err) {
      clearToken();
      return { success: false, error: err.message };
    }
  };

  return {
    loading,
    error,
    fetchProfile,
    fetchPendingStaffCount,
    logoutAdmin,
  };
};