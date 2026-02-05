"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, User, Wallet, ArrowRight } from "lucide-react";
import { buildAPIURL, getAPIHeaders } from "@/lib/utils";

const COIN_PACKS = [250, 500, 1000, 1500, 2000, 2500];

export default function WalletTopupPage() {
  const router = useRouter();
  const { user, isAuthenticated, openAuthModal, fetchProfile } = useUserAuth();

  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const walletBalance = (user?.walletBalance ?? 0) as number;

  const effectiveAmount =
    selectedAmount !== null ? selectedAmount : parseInt(customAmount || "0", 10);

  const handleCreateTopup = async () => {
    setError(null);

    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    if (!effectiveAmount || isNaN(effectiveAmount) || effectiveAmount < 1) {
      setError("Please enter a valid amount (minimum 1).");
      return;
    }

    if (typeof window === "undefined") return;

    let token: string | undefined;
    try {
      token = window.localStorage.getItem("user_token") || undefined;
    } catch {
      token = undefined;
    }

    setLoading(true);
    try {
      // Onetopup wallet top-up endpoint (proxied via Onetopup API)
      const url = buildAPIURL("/api/v1/wallet/add");
      const res = await fetch(url, {
        method: "POST",
        headers: {
          ...getAPIHeaders(false),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          amount: effectiveAmount,
          redirectUrl: `${window.location.origin}/profile`,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        setError(data?.message || "Failed to create wallet top-up. Please try again.");
        return;
      }

      const paymentUrl =
        data.transaction?.paymentUrl ||
        data.data?.transaction?.paymentUrl ||
        data.data?.paymentUrl;

      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        // No redirect URL – just refresh profile so balance updates
        await fetchProfile();
        router.push("/profile");
      }
    } catch (e: any) {
      setError(e?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-goblin-bg flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-6 bg-goblin-bg-card border-goblin-border text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-goblin-bg">
            <User className="h-6 w-6 text-goblin-green" />
          </div>
          <h1 className="text-xl font-bold text-goblin-fg mb-2">
            Login to add wallet balance
          </h1>
          <p className="text-sm text-goblin-muted mb-4">
            Sign in to top up your GameGoblin wallet and use it for instant orders.
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

  return (
    <div className="min-h-screen bg-goblin-bg py-8">
      <div className="container mx-auto px-4 max-w-4xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-goblin-fg mb-1">
              Add Wallet Balance
            </h1>
            <p className="text-sm text-goblin-muted">
              Top up your GameGoblin wallet and pay instantly for diamond packs.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-goblin-bg-card border border-goblin-border px-3 py-1.5">
            <Wallet className="h-4 w-4 text-goblin-green" />
            <span className="text-xs text-goblin-muted">Current Balance</span>
            <span className="text-sm font-semibold text-goblin-green">
              ₹{walletBalance.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[2fr,1.3fr]">
          <Card className="p-4 sm:p-6 bg-goblin-bg-card border-goblin-border space-y-4">
            <h2 className="text-sm font-semibold text-goblin-fg mb-1">
              Quick Amounts
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {COIN_PACKS.map((amount) => {
                const selected = selectedAmount === amount;
                return (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount(String(amount));
                    }}
                    className={`rounded-xl border px-4 py-3 text-left transition-all ${
                      selected
                        ? "border-goblin-green bg-goblin-green/10 text-goblin-green"
                        : "border-goblin-border bg-goblin-bg hover:border-goblin-green/60 hover:bg-goblin-bg-alt text-goblin-fg"
                    }`}
                  >
                    <div className="text-xs text-goblin-muted">Add</div>
                    <div className="text-lg font-bold">
                      ₹{amount.toLocaleString("en-IN")}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-goblin-border/60 space-y-3">
              <label className="text-sm font-semibold text-goblin-fg">
                Custom amount
              </label>
              <input
                type="number"
                min={1}
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                placeholder="Enter amount (min 1)"
                className="w-full rounded-lg border border-goblin-border bg-goblin-bg px-3 py-2 text-sm text-goblin-fg placeholder:text-goblin-muted focus:outline-none focus:ring-2 focus:ring-goblin-green/40 focus:border-goblin-green"
              />
              <p className="text-[11px] text-goblin-muted">
                Minimum top-up is <span className="font-semibold">₹1</span>. You’ll be
                redirected to a secure payment page.
              </p>
            </div>
          </Card>

          <Card className="p-4 sm:p-5 bg-goblin-bg-card border-goblin-border flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-goblin-green" />
                  <span className="text-sm font-semibold text-goblin-fg">
                    Wallet Summary
                  </span>
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-goblin-muted">Current balance</span>
                  <span className="font-semibold text-goblin-fg">
                    ₹{walletBalance.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-goblin-muted">Top-up amount</span>
                  <span className="font-semibold text-goblin-green">
                    ₹{(Number.isFinite(effectiveAmount) && effectiveAmount > 0
                      ? effectiveAmount
                      : 0
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {error && (
              <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/40 rounded-md px-3 py-2">
                {error}
              </div>
            )}

            <Button
              onClick={handleCreateTopup}
              disabled={loading}
              className="w-full bg-goblin-green hover:bg-goblin-green/90 text-black font-semibold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  Add Money
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

