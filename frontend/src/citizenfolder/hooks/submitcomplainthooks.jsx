import { useState } from "react";
import { apiFetch } from "../../utils/apiFetch.js";

export const useSubmitPortal = () => {
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // =========================
  // FETCH LOGGED-IN USER
  // =========================
  const fetchProfile = async () => {
    setApiLoading(true);
    setApiError(null);

    try {
      const res = await apiFetch("/api/auth/profile");

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Not authenticated");
      }

      return data.user;
    } catch (err) {
      setApiError(err.message);
      return null;
    } finally {
      setApiLoading(false);
    }
  };

  // =========================
  // SUBMIT COMPLAINT
  // Note: uses FormData (multipart) — apiFetch auto-skips Content-Type
  // so browser sets correct multipart/form-data boundary
  // =========================
  const submitComplaint = async ({ formData, image }) => {
    setApiLoading(true);
    setApiError(null);

    try {
      const payload = new FormData();

      // Required text fields
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("category", formData.category);

      // Auto-fetched location fields
      payload.append("state", formData.state);
      payload.append("district", formData.district);
      payload.append("pincode", formData.pincode);

      // Manual mandatory field
      payload.append("landmark", formData.landmark);

      // Required image
      payload.append("images", image);

      const res = await apiFetch("/api/complaints/submit", {
        method: "POST",
        body: payload, // FormData — apiFetch won't set Content-Type
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      return { success: true, data };
    } catch (err) {
      setApiError(err.message);
      return { success: false, error: err.message };
    } finally {
      setApiLoading(false);
    }
  };

  return {
    fetchProfile,
    submitComplaint,
    apiLoading,
    apiError,
  };
};