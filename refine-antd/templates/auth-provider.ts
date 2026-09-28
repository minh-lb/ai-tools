/**
 * Auth provider skeleton — localStorage-backed mock, swap the storage/API
 * calls for a real backend. Keep the method signatures/return shapes as-is;
 * they're what @refinedev/core's auth hooks and <Authenticated> expect.
 */
import type { AuthProvider } from "@refinedev/core";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    // Replace with a real API call.
    const isValid = email && password;
    if (isValid) {
      localStorage.setItem("auth", JSON.stringify({ email }));
      return { success: true, redirectTo: "/" };
    }
    return {
      success: false,
      error: { message: "Login failed", name: "Invalid email or password" },
    };
  },

  check: async () => {
    const user = localStorage.getItem("auth");
    if (user) return { authenticated: true };
    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
      error: { message: "Check failed", name: "Unauthorized" },
    };
  },

  logout: async () => {
    localStorage.removeItem("auth");
    return { success: true, redirectTo: "/login" };
  },

  onError: async (error) => {
    if (error?.status === 401 || error?.status === 403) {
      return { logout: true, redirectTo: "/login", error };
    }
    return {};
  },

  getPermissions: async () => {
    const user = localStorage.getItem("auth");
    return user ? JSON.parse(user).roles ?? null : null;
  },

  getIdentity: async () => {
    const user = localStorage.getItem("auth");
    return user ? JSON.parse(user) : null;
  },
};
