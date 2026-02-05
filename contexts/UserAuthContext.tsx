"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { buildAPIURL, getAPIHeaders } from "@/lib/utils";
import Cookies from "js-cookie";
import {
  initializeAuth,
  checkAuthSuccess,
  loginSuccess,
  logout as reduxLogout,
  type User,
} from "@/lib/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";

export interface UserAuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  login: (user: User, token?: string) => void;
  logout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  registerUser: (phone: string, otp?: string) => Promise<{ ok: boolean; user?: User; error?: string }>;
  loginUser: (phone: string, otp?: string, msg91Token?: string) => Promise<{ ok: boolean; user?: User; error?: string }>;
  verifyWidget: (accessToken: string, name?: string) => Promise<{ ok: boolean; user?: User; error?: string }>;
  fetchProfile: () => Promise<{ ok: boolean; user?: User; error?: string }>;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export function UserAuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    // Initialize Redux auth from Zoro-style storage
    dispatch(initializeAuth());

    // Hydrate Redux from any existing GamesGoblin user cookie/localStorage
    if (typeof window === "undefined") return;
    let storedUser = Cookies.get("user_auth");
    if (!storedUser) {
      try {
        storedUser = localStorage.getItem("user_auth") || undefined;
      } catch (e) {
        console.warn("localStorage access failed:", e);
      }
    }

    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        dispatch(checkAuthSuccess(parsedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
      }
    }

    setIsAuthReady(true);
  }, [dispatch]);

  const login = (userData: User, token?: string) => {
    const userStr = JSON.stringify(userData);

    // Save to Cookies (365 days) with mobile-friendly settings
    Cookies.set("user_auth", userStr, { expires: 365, path: '/', sameSite: 'lax' });

    // Save to localStorage (Backup)
    try {
      localStorage.setItem("user_auth", userStr);
    } catch (e) { }

    // Also save token if provided
    if (token) {
      persistToken(token);
      // Sync Redux auth slice (Zoro-style)
      dispatch(loginSuccess({ user: userData, token }));
    }
  };

  // Internal helper to persist token
  const persistToken = (token: string | null) => {
    if (token) {
      Cookies.set("user_token", token, { expires: 365, path: '/', sameSite: 'lax' });
      try {
        localStorage.setItem("user_token", token);
        // Also persist under Zoro-style key for shared auth
        localStorage.setItem("authToken", token);
      } catch (e) { }
    } else {
      Cookies.remove("user_token", { path: '/' });
      try {
        localStorage.removeItem("user_token");
        localStorage.removeItem("authToken");
      } catch (e) { }
    }
  };

  // Register against backend. OTP optional depending on backend flow.
  const registerUser = async (phone: string, otp?: string) => {
    if (typeof window === "undefined") return { ok: false, error: "client-only" };

    try {
      const url = buildAPIURL("/auth/user/register");
      // Backend expects 'identifier' and 'password' for Strapi auth
      const body: any = {
        identifier: phone,
        password: otp || ''
      };

      const res = await fetch(url, {
        method: "POST",
        headers: getAPIHeaders(false),
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data?.message || "register_failed" };
      }

      // Expecting { token, user }
      const { token, user: userData } = data;
      if (token && userData) {
        persistToken(token);
        const userStr = JSON.stringify(userData);
        Cookies.set("user_auth", userStr, { expires: 365, path: '/', sameSite: 'lax' });
        try { localStorage.setItem("user_auth", userStr); } catch (e) { }

        // Sync Redux auth
        dispatch(loginSuccess({ user: userData, token }));

        return { ok: true, user: userData };
      }

      return { ok: false, error: "invalid_response" };
    } catch (err: any) {
      console.error("loginUser error:", err);
      return { ok: false, error: err?.message || String(err) };
    }
  };

  const loginUser = async (phone: string, otp?: string, msg91Token?: string) => {
    if (typeof window === "undefined") return { ok: false, error: "client-only" };

    try {
      const url = buildAPIURL("/auth/user/login");
      // Backend expects 'identifier' and 'password' for Strapi auth
      const body: any = {
        identifier: phone,
        password: otp || ''
      };

      // Include MSG91 verification token if provided (for double verification)
      if (msg91Token) {
        body.msg91Token = msg91Token;
      }

      const res = await fetch(url, {
        method: "POST",
        headers: getAPIHeaders(false),
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data?.message || "login_failed" };
      }

      const { token, user: userData } = data;
      if (token && userData) {
        persistToken(token);
        Cookies.set("user_auth", JSON.stringify(userData));

        // Sync Redux auth
        dispatch(loginSuccess({ user: userData, token }));

        return { ok: true, user: userData };
      }

      return { ok: false, error: "invalid_response" };
    } catch (err: any) {
      console.error("loginUser error:", err);
      return { ok: false, error: err?.message || String(err) };
    }
  };

  const fetchProfile = async () => {
    if (typeof window === "undefined") return { ok: false, error: "client-only" };
    let token = Cookies.get("user_token");
    if (!token) {
      try { token = localStorage.getItem("user_token") || undefined; } catch (e) { }
    }
    if (!token) return { ok: false, error: "no_token" };

    try {
      // Onetopup profile endpoint
      const url = buildAPIURL("/api/v1/user/me");
      const res = await fetch(url, {
        method: "GET",
        headers: { ...getAPIHeaders(false), Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        // Handle 401 Unauthorized explicitly - clear auth
        if (res.status === 401) {
          logout();
          return { ok: false, error: "unauthorized" };
        }
        return { ok: false, error: data?.message || "fetch_failed" };
      }

      // Try to locate a user object in a variety of common shapes.
      const candidates: any[] = [
        data?.user,
        data?.data?.user,
        data?.data?.data?.user,
        data?.data,
        data?.profile,
        data,
      ];

      const normalizedUser =
        candidates.find(
          (u) =>
            u &&
            typeof u === "object" &&
            "phone" in u
        ) || null;

      if (normalizedUser) {
        const typedUser = normalizedUser as User;
        const userStr = JSON.stringify(typedUser);
        Cookies.set("user_auth", userStr, {
          expires: 365,
          path: "/",
          sameSite: "lax",
        });
        try {
          localStorage.setItem("user_auth", userStr);
        } catch (e) {}

        // Sync Redux with latest profile
        dispatch(checkAuthSuccess(typedUser));

        return { ok: true, user: typedUser };
      }

      return { ok: false, error: "fetch_failed" };
    } catch (err: any) {
      console.error("fetchProfile error:", err);
      return { ok: false, error: err?.message || String(err) };
    }
  };

  // Verify MSG91 Widget access token with backend
  const verifyWidget = async (accessToken: string, name?: string) => {
    if (typeof window === "undefined") return { ok: false, error: "client-only" };

    try {
      const url = buildAPIURL("/auth/user/verify-widget");
      const body: any = { accessToken };
      if (name) body.name = name;

      const res = await fetch(url, {
        method: "POST",
        headers: getAPIHeaders(false),
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data?.message || "verify_widget_failed" };
      }

      // Backend returns { success: true, data: { token, user } }
      const { token, user: userData } = data.data || data;
      if (token && userData) {
        persistToken(token);
        const userStr = JSON.stringify(userData);
        Cookies.set("user_auth", userStr, { expires: 365, path: '/', sameSite: 'lax' });
        try { localStorage.setItem("user_auth", userStr); } catch (e) { }

        // Sync Redux auth
        dispatch(loginSuccess({ user: userData, token }));

        return { ok: true, user: userData };
      }

      return { ok: false, error: "invalid_response" };
    } catch (err: any) {
      console.error("verifyWidget error:", err);
      return { ok: false, error: err?.message || String(err) };
    }
  };

  const logout = () => {
    dispatch(reduxLogout());
    Cookies.remove("user_auth", { path: '/' });
    Cookies.remove("user_token", { path: '/' });
    try {
      localStorage.removeItem("user_auth");
      localStorage.removeItem("user_token");
    } catch (e) { }
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <UserAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthReady,
        login,
        logout,
        openAuthModal,
        closeAuthModal,
        isAuthModalOpen,
        registerUser,
        loginUser,
        verifyWidget,
        fetchProfile,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const context = useContext(UserAuthContext);
  if (context === undefined) {
    throw new Error("useUserAuth must be used within a UserAuthProvider");
  }
  return context;
}
