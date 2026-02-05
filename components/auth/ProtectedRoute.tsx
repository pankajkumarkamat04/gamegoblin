"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Wraps pages that require authentication.
 * Shows loading until auth is ready, then redirects to /login if not authenticated.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isAuthReady } = useUserAuth();

  useEffect(() => {
    if (!isAuthReady) return;
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthReady, isAuthenticated, router]);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-goblin-bg flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-goblin-green animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirecting to /login
  }

  return <>{children}</>;
}
