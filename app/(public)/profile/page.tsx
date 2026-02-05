"use client";

import React, {
  useEffect,
  useState,
  useRef,
  ChangeEvent,
  FormEvent,
  useCallback,
} from "react";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { type User as UserType } from "@/lib/store/authSlice";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Phone,
  Mail,
  Shield,
  ArrowRight,
  Camera,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { buildProfileAPIURL } from "@/lib/utils";

function ProfilePageContent() {
  const { isAuthenticated, isAuthReady, fetchProfile, logout } =
    useUserAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<UserType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const initialLoadDone = useRef(false);

  const getToken = useCallback((): string | undefined => {
    if (typeof window === "undefined") return undefined;
    let token = Cookies.get("user_token");
    if (!token) {
      try {
        token = window.localStorage.getItem("user_token") || undefined;
      } catch {
        token = undefined;
      }
    }
    return token;
  }, []);

  const loadProfileData = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetchProfile();
      if (res.ok && res.user) {
        setProfile(res.user);
        setName(res.user.name || "");
        setEmail(res.user.email || "");
      } else {
        setError(res.error || "Failed to load profile");
      }
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error ? e.message : "Failed to load profile";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, fetchProfile]);

  // Only run initial load once when auth is ready so name/email aren't constantly reset (which blocks typing)
  useEffect(() => {
    if (!isAuthReady) return;
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;
    loadProfileData();
  }, [isAuthReady, loadProfileData]);

  const handleSaveProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    const token = getToken();
    if (!token) {
      setError("No authentication token found");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Same as Zoro: PUT /user/profile with { name, email } (use profile API base if set, e.g. Zoro/credszone)
      const url = buildProfileAPIURL("/api/v1/user/profile");
      const requestBody: { name: string; email?: string } = {
        name: name.trim(),
      };
      if (email.trim()) {
        requestBody.email = email.trim();
      }

      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      let data: { message?: string; error?: string; user?: UserType; data?: { user?: UserType } } = {};
      const resContentType = res.headers.get("content-type");
      if (resContentType && resContentType.includes("application/json")) {
        try {
          data = await res.json();
        } catch {
          // ignore JSON parse error
        }
      }

      if (!res.ok) {
        const msg = data?.message || data?.error || `Request failed (${res.status})`;
        setError(msg);
        return;
      }

      // Update local state from response if backend returns user (Zoro-style)
      const updatedUser = data?.user ?? data?.data?.user;
      if (updatedUser && typeof updatedUser === "object" && "phone" in updatedUser) {
        setProfile(updatedUser as UserType);
        setName(updatedUser.name ?? name);
        setEmail(updatedUser.email ?? email);
      }
      setError(null);
      await loadProfileData();
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error
          ? e.message
          : "Something went wrong while saving profile";
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return;

    const token = getToken();
    if (!token) {
      setError("No authentication token found");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const url = buildProfileAPIURL("/api/v1/user/profile-picture");
      const formData = new FormData();
      formData.append("image", avatarFile);

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      let data: { message?: string } = {};
      const resContentType = res.headers.get("content-type");
      if (resContentType && resContentType.includes("application/json")) {
        try {
          data = await res.json();
        } catch {
          // ignore JSON parse error
        }
      }
      if (!res.ok) {
        setError(data?.message || "Failed to upload avatar");
      } else {
        await loadProfileData();
        setAvatarFile(null);
        setAvatarPreview(null);
      }
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error
          ? e.message
          : "Something went wrong while uploading avatar";
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  // Loading state (auth is ready and user is authenticated by ProtectedRoute)
  if (loading) {
    return (
      <div className="min-h-screen bg-goblin-bg flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-goblin-green animate-spin" />
      </div>
    );
  }

  // Profile not loaded or failed to load
  if (!profile) {
    return (
      <div className="min-h-screen bg-goblin-bg flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-6 bg-goblin-bg-card border-goblin-border text-center space-y-4">
          <h1 className="text-xl font-bold text-goblin-fg">
            {error ? "Failed to load profile" : "Profile not available"}
          </h1>
          {error && (
            <p className="text-sm text-goblin-muted">{error}</p>
          )}
          {!error && (
            <p className="text-sm text-goblin-muted">
              Please try again in a moment.
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button
              onClick={() => loadProfileData()}
              className="bg-goblin-green hover:bg-goblin-green/90 text-black font-semibold"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                logout();
                window.location.href = "/";
              }}
              className="border-goblin-border text-goblin-fg"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Main profile view
  const displayName = profile.name || "Player";
  const avatarUrl = avatarPreview || profile.profilePicture || null;
  const isDataUrl =
    typeof avatarUrl === "string" && avatarUrl.startsWith("data:");

  return (
    <div className="min-h-screen bg-goblin-bg py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-goblin-fg mb-6">
          My Profile
        </h1>

        {error && (
          <Card className="mb-4 p-3 bg-red-500/10 border-red-500/40 text-sm text-red-300">
            {error}
          </Card>
        )}

        <div className="grid gap-4 sm:gap-6">
          {/* Avatar + editable info */}
          <Card className="p-4 sm:p-6 bg-goblin-bg-card border-goblin-border space-y-4">
            <div className="flex items-center gap-4 mb-2">
              <div className="relative h-16 w-16 rounded-full border border-goblin-green/50 bg-goblin-bg flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                  isDataUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <Image
                      src={avatarUrl}
                      alt="Avatar"
                      fill
                      className="object-cover"
                      unoptimized={!avatarUrl.startsWith("http")}
                    />
                  )
                ) : (
                  <span className="text-xl font-bold text-goblin-green">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                )}
                <label className="absolute bottom-0 right-0 mb-[-4px] mr-[-4px]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <div className="h-7 w-7 rounded-full bg-goblin-bg-card border border-goblin-border flex items-center justify-center cursor-pointer hover:bg-goblin-green/20">
                    <Camera className="h-3.5 w-3.5 text-goblin-fg" />
                  </div>
                </label>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-goblin-fg flex items-center gap-2">
                  {displayName}
                  {profile.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-goblin-green/10 px-2 py-0.5 text-[11px] font-semibold text-goblin-green">
                      <Shield className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                </h2>
                <p className="text-xs text-goblin-muted">
                  Role: {profile.role || "user"}
                </p>
              </div>
            </div>

            {avatarFile && (
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  onClick={handleUploadAvatar}
                  disabled={uploading}
                  className="bg-goblin-green hover:bg-goblin-green/90 text-black font-semibold text-xs"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />{" "}
                      Uploading…
                    </>
                  ) : (
                    "Save Avatar"
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setAvatarFile(null);
                    setAvatarPreview(null);
                  }}
                  className="text-goblin-muted hover:text-goblin-fg text-xs"
                >
                  Cancel
                </Button>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 mt-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-goblin-muted">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-goblin-border bg-goblin-bg px-3 py-2 text-sm text-goblin-fg placeholder:text-goblin-muted focus:outline-none focus:border-goblin-green focus:ring-2 focus:ring-goblin-green/20"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-goblin-muted">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-goblin-border bg-goblin-bg px-3 py-2 text-sm text-goblin-fg placeholder:text-goblin-muted focus:outline-none focus:border-goblin-green focus:ring-2 focus:ring-goblin-green/20"
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-goblin-fg">
                  <Phone className="h-4 w-4 text-goblin-green" />
                  <span>
                    {profile.phone ? `+91 ${profile.phone}` : "Phone not set"}
                  </span>
                </div>
                {profile.email && (
                  <div className="flex items-center gap-2 text-goblin-fg">
                    <Mail className="h-4 w-4 text-goblin-green" />
                    <span>{profile.email}</span>
                  </div>
                )}
              </div>
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-goblin-green hover:bg-goblin-green/90 text-black font-semibold text-sm px-5"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving…
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>

            {/* Quick Links */}
            <div className="pt-4 border-t border-goblin-border/60 mt-4 space-y-2">
              <Link href="/orders">
                <Button className="w-full bg-goblin-green hover:bg-goblin-green/90 text-black font-semibold text-sm flex items-center justify-center gap-2">
                  View Orders
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <div className="pt-3">
                <Button
                  onClick={() => {
                    logout();
                    window.location.href = "/";
                  }}
                  className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold text-sm flex items-center justify-center gap-2 border border-red-500/40"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  );
}
