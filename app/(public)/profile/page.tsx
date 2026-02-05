"use client";

import React, {
  useEffect,
  useState,
  ChangeEvent,
  FormEvent,
  useCallback,
} from "react";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { type User as UserType } from "@/lib/store/authSlice";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  User,
  Phone,
  Mail,
  Shield,
  Wallet,
  ArrowRight,
  Camera,
} from "lucide-react";
import { buildAPIURL, getAPIHeaders } from "@/lib/utils";

export default function ProfilePage() {
  const { isAuthenticated, isAuthReady, openAuthModal, fetchProfile } =
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

  useEffect(() => {
    if (!isAuthReady) return;
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
      const url = buildAPIURL("/api/v1/user/profile");
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          ...getAPIHeaders(false),
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || "Failed to update profile");
      } else {
        await loadProfileData();
      }
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
      const url = buildAPIURL("/api/v1/user/profile-picture");
      const formData = new FormData();
      formData.append("image", avatarFile);

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
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

  // Loading state
  if (!isAuthReady || loading) {
    return (
      <div className="min-h-screen bg-goblin-bg flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-goblin-green animate-spin" />
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-goblin-bg flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-6 bg-goblin-bg-card border-goblin-border text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-goblin-bg">
            <User className="h-6 w-6 text-goblin-green" />
          </div>
          <h1 className="text-xl font-bold text-goblin-fg mb-2">
            Login to manage your profile
          </h1>
          <p className="text-sm text-goblin-muted mb-4">
            Update your name, email, and avatar, and view your wallet balance in
            one place.
          </p>
          <Button
            className="w-full bg-goblin-green hover:bg-goblin-green/90 text-black font-semibold"
            onClick={openAuthModal}
          >
            Login / Sign Up
          </Button>
        </Card>
      </div>
    );
  }

  // Profile not loaded
  if (!profile) {
    return (
      <div className="min-h-screen bg-goblin-bg flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-6 bg-goblin-bg-card border-goblin-border text-center">
          <h1 className="text-xl font-bold text-goblin-fg mb-2">
            {error ? "Failed to load profile" : "Profile not available"}
          </h1>
          {error && (
            <p className="text-sm text-goblin-muted mb-4">{error}</p>
          )}
          {!error && (
            <p className="text-sm text-goblin-muted mb-4">
              Please try again in a moment.
            </p>
          )}
        </Card>
      </div>
    );
  }

  // Main profile view
  const displayName = profile.name || "Player";
  const walletBalance = profile.walletBalance ?? 0;
  const avatarUrl = avatarPreview || profile.profilePicture || null;

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

        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {/* Left: Avatar + editable info */}
          <Card className="md:col-span-2 p-4 sm:p-6 bg-goblin-bg-card border-goblin-border space-y-4">
            <div className="flex items-center gap-4 mb-2">
              <div className="relative h-16 w-16 rounded-full border border-goblin-green/50 bg-goblin-bg flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
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
                  <span>+91 {profile.phone}</span>
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
          </Card>

          {/* Right: Wallet + quick links */}
          <Card className="p-4 sm:p-5 bg-goblin-bg-card border-goblin-border flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-goblin-green" />
                  <span className="text-sm font-semibold text-goblin-fg">
                    Wallet Balance
                  </span>
                </div>
              </div>
              <p className="text-2xl font-bold text-goblin-green mb-1">
                ₹{walletBalance.toLocaleString("en-IN")}
              </p>
              <p className="text-[11px] text-goblin-muted">
                Use your wallet for instant orders. Top up from the wallet page
                any time.
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <Link href="/wallet">
                <Button className="w-full bg-goblin-green/10 hover:bg-goblin-green/20 text-goblin-green font-semibold text-sm flex items-center justify-center gap-2 border border-goblin-green/40">
                  Add Money
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/orders">
                <Button className="w-full bg-goblin-green hover:bg-goblin-green/90 text-black font-semibold text-sm flex items-center justify-center gap-2">
                  View Orders
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
