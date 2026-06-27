/**
 * apiFetch — Authenticated API helper
 *
 * Uses cookies (via credentials: 'include') for authentication.
 * Backend sets httpOnly cookies with sameSite: 'none' + secure: true
 * which works cross-origin (Vercel frontend ↔ backend).
 */

const API = import.meta.env.VITE_BACKEND_URL || '';

// No-op stubs kept for backward compatibility — cookies handle auth now
export const getToken = () => null;
export const setToken = () => {};
export const clearToken = () => {};

/**
 * apiFetch(path, options)
 * @param {string} path  - e.g. '/api/auth/profile'
 * @param {object} options - same as fetch options (method, body, headers, etc.)
 *
 * NOTE: If body is FormData, Content-Type is NOT set (browser sets it automatically
 *       with correct multipart boundary for file uploads).
 */
export const apiFetch = async (path, options = {}) => {
  const isFormData = options.body instanceof FormData;

  const headers = {
    // Don't set Content-Type for FormData — browser sets it with boundary
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
  };

  return fetch(`${API}${path}`, {
    ...options,
    headers,
    credentials: 'include', // sends httpOnly cookies cross-origin
  });
};
