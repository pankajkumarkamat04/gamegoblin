"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Clock, XCircle, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buildAPIURL } from "@/lib/utils";

type OrderStatusType = "initiated" | "pending" | "processing" | "completed" | "failed" | "refunded";

interface OrderItem {
  itemId: string;
  itemName: string;
  quantity: number;
  price: number;
}

interface OrderStatusResponse {
  success: boolean;
  message?: string;
  order?: {
    _id: string;
    orderType: string;
    amount: number;
    currency: string;
    status: OrderStatusType;
    paymentMethod: string;
    items: OrderItem[];
    description?: string;
    createdAt: string;
  };
}

function OrderStatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  // Prefer explicit orderId param, otherwise fall back to client_txn_id
  const orderId =
    searchParams.get("orderId") ||
    searchParams.get("client_txn_id") ||
    "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderStatusResponse["order"] | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!orderId) {
        setError("Missing orderId in URL.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        if (typeof window === "undefined") return;

        const token =
          window.localStorage.getItem("user_token") ||
          window.localStorage.getItem("authToken") ||
          undefined;

        if (!token) {
          setError("No authentication token found. Please log in again.");
          setLoading(false);
          return;
        }

        const url = buildAPIURL(
          `/api/v1/order/order-status?orderId=${encodeURIComponent(orderId)}`
        );
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data: OrderStatusResponse = await res.json();

        if (!res.ok || !data.success || !data.order) {
          setError(data.message || "Failed to fetch order status.");
        } else {
          setOrder(data.order);
        }
      } catch (e: any) {
        setError(e?.message || "Something went wrong while fetching order status.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [orderId]);

  const parseDescription = () => {
    if (!order?.description) return null;
    try {
      const parsed = JSON.parse(order.description);
      return parsed as { text?: string; playerId?: string; server?: string };
    } catch {
      return null;
    }
  };

  const parsedDescription = parseDescription();

  const renderStatusBadge = () => {
    if (!order) return null;
    const status = order.status;

    if (status === "completed") {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-sm font-semibold">
          <CheckCircle className="w-4 h-4" />
          Completed
        </div>
      );
    }

    if (status === "failed" || status === "refunded") {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/40 text-red-300 text-sm font-semibold">
          <XCircle className="w-4 h-4" />
          {status === "failed" ? "Failed" : "Refunded"}
        </div>
      );
    }

    // initiated / pending / processing
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/40 text-yellow-300 text-sm font-semibold">
        <Clock className="w-4 h-4 animate-spin" />
        {status === "initiated" ? "Initiated" : status === "processing" ? "Processing" : "Pending"}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-goblin-bg py-12">
      <div className="container mx-auto px-4 max-w-xl">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-goblin-muted hover:text-goblin-fg text-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-goblin-fg">Order Status</h1>
          <p className="text-sm text-goblin-muted mt-1">
            Track the status of your recent purchase.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-8 h-8 text-goblin-green animate-spin" />
            <p className="text-sm text-goblin-muted">Fetching latest order status…</p>
          </div>
        ) : error ? (
          <div className="border border-red-500/40 bg-red-500/10 rounded-xl p-5 text-center">
            <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-sm text-red-300 mb-3">{error}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="border-red-400 text-red-300 hover:bg-red-500/10"
            >
              Retry
            </Button>
          </div>
        ) : order ? (
          <div className="border border-goblin-border/40 bg-goblin-bg-card rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-goblin-muted uppercase tracking-wide">
                  Order ID
                </p>
                <p className="font-mono text-sm text-goblin-fg break-all">
                  {orderId}
                </p>
              </div>
              {renderStatusBadge()}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mt-2">
              <div>
                <p className="text-xs text-goblin-muted mb-1">Amount</p>
                <p className="font-semibold text-goblin-green">
                  ₹{order.amount.toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <p className="text-xs text-goblin-muted mb-1">Payment Method</p>
                <p className="font-semibold text-goblin-fg capitalize">
                  {order.paymentMethod}
                </p>
              </div>
              <div>
                <p className="text-xs text-goblin-muted mb-1">Created At</p>
                <p className="text-xs text-goblin-fg/80">
                  {new Date(order.createdAt).toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {order.items && order.items.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-goblin-muted mb-1">Items</p>
                <div className="space-y-1.5 text-xs bg-goblin-bg/50 border border-goblin-border/40 rounded-lg p-3">
                    {order.items.map((item) => (
                    <div
                      key={item.itemId}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="text-goblin-fg/90">
                        {item.itemName}
                      </span>
                      <span className="text-goblin-muted">
                        ×{item.quantity} • ₹{item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {parsedDescription && (
              <div className="mt-2 bg-goblin-bg/40 border border-goblin-border/40 rounded-lg p-3 text-xs space-y-1.5">
                {parsedDescription.text && (
                  <p className="text-goblin-fg/90">{parsedDescription.text}</p>
                )}
                {(parsedDescription.playerId || parsedDescription.server) && (
                  <p className="text-goblin-muted">
                    Player ID:{" "}
                    <span className="font-mono text-goblin-fg/90">
                      {parsedDescription.playerId || "N/A"}
                    </span>
                    {parsedDescription.server && (
                      <>
                        {" "}
                        • Server:{" "}
                        <span className="font-mono text-goblin-fg/90">
                          {parsedDescription.server}
                        </span>
                      </>
                    )}
                  </p>
                )}
              </div>
            )}

            <div className="pt-3 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="/orders" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full border-goblin-border/40 text-goblin-fg/80 hover:bg-goblin-bg-alt"
                >
                  View All Orders
                </Button>
              </Link>
              <Link href="/support" className="w-full sm:w-auto">
                <Button className="w-full bg-goblin-green hover:bg-goblin-green/90 text-black font-semibold">
                  Need Help?
                </Button>
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function OrderStatusPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-goblin-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-goblin-green animate-spin" />
      </div>
    }>
      <OrderStatusContent />
    </Suspense>
  );
}

