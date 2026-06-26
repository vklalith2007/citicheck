import { useState, useCallback } from "react";
import { apiFetch } from "../../utils/apiFetch.js";

export const useMyComplaints = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch User Profile
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/api/auth/profile");

      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }
      const data = await res.json();
      // API returns { success: true, user: { name, email, ... } }
      return data.user || data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Complaints with Server-Side Filtering
  const fetchMyComplaints = useCallback(
    async ({ status, category, search, page = 1, limit = 10 }) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (status && status !== "all") params.append("status", status);
        if (category && category !== "all") params.append("category", category);
        if (search) params.append("search", search);
        params.append("page", page);
        params.append("limit", limit);

        const res = await apiFetch(`/api/complaints/my-complaints?${params.toString()}`);

        if (!res.ok) {
          throw new Error("Failed to fetch complaints");
        }

        // Returns { complaints: [], total, page, pages } usually,
        // or just the array depending on strict backend return.
        // Returning full json to let component handle structure.
        return await res.json();
      } catch (err) {
        setError(err.message);
        return { complaints: [] }; // Return empty structure on fail to prevent map errors
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Fetch Single Complaint Detail
  const fetchComplaintById = useCallback(async (complaintId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch(`/api/complaints/${complaintId}`);

      if (!res.ok) {
        throw new Error("Failed to fetch complaint details");
      }

      return await res.json();
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fetchProfile,
    fetchMyComplaints,
    fetchComplaintById,
    loading,
    error,
  };
};