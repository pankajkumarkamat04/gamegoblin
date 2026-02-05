"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Loader2,
  Wallet,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  History,
} from "lucide-react";
import { buildAPIURL, getAPIHeaders } from "@/lib/utils";
import Cookies from "js-cookie";

const COIN_PACKS = [250, 500, 1000, 1500, 2000, 2500];

interface WalletTransaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
  status: string;
  balanceBefore?: number;
  balanceAfter?: number;
  reference?: string;
  referenceType?: string;
}

interface LedgerTransaction {
  _id: string;
  transactionType: "credit" | "debit";
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  reference: string;
  referenceType: string;
  description: string;
  status: string;
  createdAt: string;
}

interface LedgerResponse {
  success: boolean;
  data: {
    transactions: LedgerTransaction[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

function WalletPageContent() {
  const router = useRouter();
  const { user, fetchProfile } = useUserAuth();
  const [activeTab, setActiveTab] = useState("controller");

  // Wallet Controller state
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Wallet Transaction state
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [transactionError, setTransactionError] = useState<string | null>(null);
  const [transactionPage, setTransactionPage] = useState(1);
  const [hasMoreTransactions, setHasMoreTransactions] = useState(false);

  const walletBalance = (user?.walletBalance ?? 0) as number;

  const effectiveAmount =
    selectedAmount !== null ? selectedAmount : parseInt(customAmount || "0", 10);

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

  const handleCreateTopup = async () => {
    setError(null);

    if (!effectiveAmount || isNaN(effectiveAmount) || effectiveAmount < 1) {
      setError("Please enter a valid amount (minimum 1).");
      return;
    }

    if (typeof window === "undefined") return;

    const token = getToken();
    if (!token) {
      setError("No authentication token found");
      return;
    }

    setLoading(true);
    try {
      const url = buildAPIURL("/api/v1/wallet/add");
      const res = await fetch(url, {
        method: "POST",
        headers: {
          ...getAPIHeaders(false),
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: effectiveAmount,
          redirectUrl: `${window.location.origin}/wallet`,
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
        await fetchProfile();
        await fetchWalletTransactions();
        setActiveTab("transaction");
      }
    } catch (e: any) {
      setError(e?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletTransactions = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setTransactionError("No authentication token found");
      return;
    }

    setLoadingTransactions(true);
    setTransactionError(null);

    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59
      );

      const queryParams = new URLSearchParams({
        page: transactionPage.toString(),
        limit: "10",
        startDate: startOfMonth.toISOString(),
        endDate: endOfMonth.toISOString(),
      });

      const url = buildAPIURL(`/api/v1/wallet/ledger?${queryParams.toString()}`);
      const res = await fetch(url, {
        method: "GET",
        headers: {
          ...getAPIHeaders(false),
          Authorization: `Bearer ${token}`,
        },
      });

      const data: LedgerResponse = await res.json();

      if (!res.ok || !data?.success) {
        setTransactionError("Failed to load transactions");
        return;
      }

      const transformed: WalletTransaction[] = data.data.transactions.map(
        (tx: LedgerTransaction) => ({
          id: tx._id,
          type: tx.transactionType,
          amount: tx.amount,
          description: tx.description,
          date: tx.createdAt,
          status: tx.status,
          balanceBefore: tx.balanceBefore,
          balanceAfter: tx.balanceAfter,
          reference: tx.reference,
          referenceType: tx.referenceType,
        })
      );

      if (transactionPage === 1) {
        setTransactions(transformed);
      } else {
        setTransactions((prev) => [...prev, ...transformed]);
      }

      setHasMoreTransactions(
        data.data.pagination.page < data.data.pagination.pages
      );
    } catch (e: any) {
      setTransactionError(e?.message || "Failed to load transactions");
    } finally {
      setLoadingTransactions(false);
    }
  }, [transactionPage, getToken]);

  useEffect(() => {
    if (activeTab === "transaction") {
      setTransactionPage(1);
      fetchWalletTransactions();
    }
  }, [activeTab]);

  const loadMoreTransactions = () => {
    setTransactionPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (transactionPage > 1 && activeTab === "transaction") {
      fetchWalletTransactions();
    }
  }, [transactionPage]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-goblin-bg py-8">
      <div className="container mx-auto px-4 max-w-4xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-goblin-fg mb-1">
              Wallet
            </h1>
            <p className="text-sm text-goblin-muted">
              Manage your wallet balance and view transaction history
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 gap-3 p-3 bg-goblin-bg-card border border-goblin-border rounded-lg h-auto min-h-12">
            <TabsTrigger
              value="controller"
              className="data-[state=active]:bg-goblin-green data-[state=active]:text-black px-5 py-3.5 rounded-md text-sm font-medium"
            >
              <Wallet className="h-4 w-4 mr-2 shrink-0" />
              Wallet Controller
            </TabsTrigger>
            <TabsTrigger
              value="transaction"
              className="data-[state=active]:bg-goblin-green data-[state=active]:text-black px-5 py-3.5 rounded-md text-sm font-medium"
            >
              <History className="h-4 w-4 mr-2 shrink-0" />
              Wallet Transaction
            </TabsTrigger>
          </TabsList>

          {/* Wallet Controller Tab */}
          <TabsContent value="controller" className="mt-6">
            <Card className="p-4 sm:p-6 bg-goblin-bg-card border-goblin-border space-y-4 max-w-2xl mx-auto">
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
                  Minimum top-up is <span className="font-semibold">₹1</span>.
                  You'll be redirected to a secure payment page.
                </p>
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
          </TabsContent>

          {/* Wallet Transaction Tab */}
          <TabsContent value="transaction" className="mt-6">
            <Card className="p-4 sm:p-6 bg-goblin-bg-card border-goblin-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-goblin-fg">
                  Transaction History
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTransactionPage(1);
                    fetchWalletTransactions();
                  }}
                  disabled={loadingTransactions}
                  className="border-goblin-border"
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${
                      loadingTransactions ? "animate-spin" : ""
                    }`}
                  />
                  Refresh
                </Button>
              </div>

              {transactionError && (
                <div className="mb-4 text-xs text-red-300 bg-red-500/10 border border-red-500/40 rounded-md px-3 py-2">
                  {transactionError}
                </div>
              )}

              {loadingTransactions && transactions.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 text-goblin-green animate-spin" />
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-12">
                  <History className="h-12 w-12 text-goblin-muted mx-auto mb-3" />
                  <p className="text-goblin-fg font-medium mb-1">
                    No transactions found
                  </p>
                  <p className="text-sm text-goblin-muted">
                    Your wallet transaction history will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-4 rounded-lg border border-goblin-border/30 bg-goblin-bg hover:border-goblin-border/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div
                            className={`mt-1 p-2 rounded-lg ${
                              tx.type === "credit"
                                ? "bg-green-500/10"
                                : "bg-red-500/10"
                            }`}
                          >
                            {tx.type === "credit" ? (
                              <ArrowDownRight className="h-4 w-4 text-green-400" />
                            ) : (
                              <ArrowUpRight className="h-4 w-4 text-red-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-goblin-fg mb-1">
                              {tx.description || "Wallet Transaction"}
                            </p>
                            <p className="text-xs text-goblin-muted">
                              {formatDate(tx.date)}
                            </p>
                            {tx.reference && (
                              <p className="text-xs text-goblin-muted mt-1 font-mono">
                                Ref: {tx.reference}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p
                            className={`text-lg font-bold ${
                              tx.type === "credit"
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {tx.type === "credit" ? "+" : "-"}₹
                            {tx.amount.toLocaleString("en-IN")}
                          </p>
                          <p className="text-xs text-goblin-muted mt-1 capitalize">
                            {tx.status}
                          </p>
                          {tx.balanceAfter !== undefined && (
                            <p className="text-xs text-goblin-muted mt-1">
                              Balance: ₹{tx.balanceAfter.toLocaleString("en-IN")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {hasMoreTransactions && (
                    <div className="flex justify-center pt-4">
                      <Button
                        onClick={loadMoreTransactions}
                        disabled={loadingTransactions}
                        variant="outline"
                        className="border-goblin-border"
                      >
                        {loadingTransactions ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          "Load More"
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function WalletTopupPage() {
  return (
    <ProtectedRoute>
      <WalletPageContent />
    </ProtectedRoute>
  );
}
