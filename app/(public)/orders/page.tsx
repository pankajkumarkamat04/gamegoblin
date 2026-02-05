"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, Clock, CheckCircle, XCircle, RefreshCw, ChevronRight, Loader2, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { buildAPIURL, getAPIHeaders } from "@/lib/utils";
import { getActiveGames } from "@/lib/games-data";
import Cookies from "js-cookie";
import { OrderCardSkeleton } from "@/components/ui/skeletons";
import { 
  formatPackageWithQuantity, 
  calculateTotalItems, 
  calculateUnitPrice,
  isPartialFulfillment,
  parsePartialFulfillment
} from "@/lib/order-utils";

interface Order {
  _id: string;
  userId: string;
  gameId: string;
  gameName: string;
  packageName: string;
  orderNumber: string;
  quantity?: number; // Order quantity (defaults to 1 if not present)
  
  // Order & Payment Status
  status: "pending" | "processing" | "completed" | "failed" | "refunded";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod?: string;
  
  // Pricing
  totalPrice: number;
  costPrice: number;
  profit: number;
  
  // Player Details
  playerDetails: {
    playerId: string;
    zoneId?: string;
    playerName?: string;
    serverName?: string;
  };
  
  // Reseller Info
  reseller: string;
  resellerProductId: string;
  
  // Contact
  customerEmail?: string;
  customerPhone?: string;
  
  // Payment Details
  payerUpi?: string;
  txnId?: string;
  utr?: string;
  oneGatewayOrderId?: string;
  paymentUrl?: string;
  paymentCompletedAt?: string;
  paymentExpiresAt?: string;
  
  // Error Info
  errorMessage?: string | null;
  
  // Notes
  notes?: string | null;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

type OrderStatus = "all" | "completed" | "pending" | "processing" | "failed" | "refunded";

// Map Zoro `/order/history` response into local Order shape
const mapZoroOrderToOrder = (raw: any): Order => {
  // Parse player info from description JSON if available
  let playerId = "";
  let zoneId: string | undefined;
  let playerName: string | undefined;
  let serverName: string | undefined;

  if (raw?.description) {
    try {
      const parsed = JSON.parse(raw.description);
      playerId = parsed.playerId || parsed.uid || "";
      zoneId = parsed.zoneId || parsed.zone || undefined;
      playerName = parsed.playerName || parsed.nickname || undefined;
      serverName = parsed.server || parsed.region || undefined;
    } catch {
      // Ignore parse errors; leave fields empty
    }
  }

  const firstItem = Array.isArray(raw.items) && raw.items.length > 0 ? raw.items[0] : null;

  // Normalise status to our internal set
  const statusRaw = String(raw.status || "").toLowerCase();
  let status: Order["status"] = "pending";
  if (statusRaw === "completed" || statusRaw === "success") status = "completed";
  else if (statusRaw === "processing") status = "processing";
  else if (statusRaw === "failed" || statusRaw === "cancelled") status = "failed";
  else if (statusRaw === "refunded") status = "refunded";

  // Derive payment status from order status
  let paymentStatus: Order["paymentStatus"] = "pending";
  if (status === "completed" || status === "refunded") paymentStatus = "paid";
  if (status === "failed") paymentStatus = "failed";

  const quantity = firstItem?.quantity && firstItem.quantity > 0 ? firstItem.quantity : 1;

  return {
    _id: raw._id || raw.id || "",
    userId: raw.userId || "",
    gameId: "", // Not provided by history endpoint
    gameName: raw.gameName || firstItem?.itemName || "Game",
    packageName: firstItem?.itemName || "Package",
    orderNumber: raw.orderId || raw.orderNumber || raw._id || "",
    quantity,
    status,
    paymentStatus,
    paymentMethod: raw.paymentMethod || "upi",
    totalPrice: Number(raw.amount || 0),
    costPrice: 0,
    profit: 0,
    playerDetails: {
      playerId: playerId || "",
      zoneId,
      playerName,
      serverName,
    },
    reseller: "",
    resellerProductId: "",
    customerEmail: undefined,
    customerPhone: undefined,
    payerUpi: undefined,
    txnId: undefined,
    utr: undefined,
    oneGatewayOrderId: undefined,
    paymentUrl: undefined,
    paymentCompletedAt: undefined,
    paymentExpiresAt: undefined,
    errorMessage: null,
    notes: null,
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || raw.createdAt || new Date().toISOString(),
  };
};

export default function OrdersPage() {
  const { user, isAuthenticated, openAuthModal } = useUserAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus>("all");
  const [gamesMap, setGamesMap] = useState<Record<string, { name: string; icon: string; slug: string }>>({});
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [checkingPayment, setCheckingPayment] = useState<Record<string, boolean>>({});

  // Fetch games data for icons
  useEffect(() => {
    const loadGames = async () => {
      try {
        const games = await getActiveGames();
        const mapping: Record<string, { name: string; icon: string; slug: string }> = {};
        games.forEach(game => {
          // Map by game name (case-insensitive)
          const key = game.name.toLowerCase().trim();
          mapping[key] = {
            name: game.name,
            icon: game.images?.icon || game.icon || '/game-placeholder.svg',
            slug: game.slug
          };
        });
        setGamesMap(mapping);
      } catch (err) {
        console.error("Failed to load games data:", err);
      }
    };
    loadGames();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchUserOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let token = Cookies.get("user_token");
      // Fallback to localStorage if cookie not found
      if (!token) {
        try {
          token = localStorage.getItem("user_token") || undefined;
        } catch (e) {}
      }
      
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      // Zoro backend: fetch current user's orders from history endpoint
      const queryParams = new URLSearchParams({
        page: "1",
        limit: "50",
      });

      const url = buildAPIURL(`/api/v1/order/history?${queryParams.toString()}`);
      const res = await fetch(url, {
        method: "GET",
        headers: {
          ...getAPIHeaders(false),
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      
      if (!res.ok) {
        // If backend endpoint doesn't exist, show empty state
        if (res.status === 404 || data?.message === "Route not found") {
          setOrders([]);
        } else {
          setError(data?.message || "Failed to fetch orders");
        }
      } else {
        // Backend returns Zoro-style history: { success, orders, pagination } or nested under data
        const rawOrders = data?.orders || data?.data?.orders || [];
        const mapped: Order[] = Array.isArray(rawOrders)
          ? rawOrders.map((o: any) => mapZoroOrderToOrder(o))
          : [];
        setOrders(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async (orderNumber: string) => {
    setCheckingPayment(prev => ({ ...prev, [orderNumber]: true }));
    
    try {
      const response = await fetch(buildAPIURL(`/api/v1/payments/status/${orderNumber}`), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const data = await response.json();
      
      if (data.success && data.data) {
        const { paymentStatus, orderStatus } = data.data;
        
        if (paymentStatus === 'paid' && orderStatus === 'completed') {
          alert(`✅ Payment verified! Your order is complete.`);
        } else if (paymentStatus === 'paid' && (orderStatus === 'processing' || orderStatus === 'pending')) {
          alert(`⏳ Payment confirmed but order is still processing. Please wait a few more minutes.`);
        } else if (paymentStatus === 'paid' && orderStatus === 'failed') {
          alert(`⚠️ Payment received but order fulfillment failed. Please contact support.`);
        } else if (paymentStatus === 'failed') {
          alert(`❌ Payment failed. Please try again or contact support.`);
        } else {
          alert(`⏳ Payment is still pending. Please complete the payment first.`);
        }
        
        // Refresh orders to get latest status
        await fetchUserOrders();
      } else {
        alert(`Unable to check payment status: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to check payment status:', error);
      alert('Failed to check payment status. Please try again.');
    } finally {
      setCheckingPayment(prev => ({ ...prev, [orderNumber]: false }));
    }
  };

  const filteredOrders = orders.filter((order: Order) => {
    const matchesSearch = searchQuery === "" || 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (order.gameName && order.gameName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", { 
      year: "numeric", 
      month: "short", 
      day: "numeric", 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  const statusCounts = {
    all: orders.length,
    completed: orders.filter((o: Order) => o.status === "completed").length,
    pending: orders.filter((o: Order) => o.status === "pending").length,
    processing: orders.filter((o: Order) => o.status === "processing").length,
    failed: orders.filter((o: Order) => o.status === "failed").length,
    refunded: orders.filter((o: Order) => o.status === "refunded").length
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { 
      icon: typeof CheckCircle, 
      label: string, 
      color: string, 
      bg: string 
    }> = {
      completed: { 
        icon: CheckCircle, 
        label: "Completed", 
        color: "text-[#50fa7b]", 
        bg: "bg-[#50fa7b]/10" 
      },
      pending: { 
        icon: Clock, 
        label: "Pending", 
        color: "text-yellow-400", 
        bg: "bg-yellow-400/10" 
      },
      processing: { 
        icon: RefreshCw, 
        label: "Processing", 
        color: "text-[#4ecdc4]", 
        bg: "bg-[#4ecdc4]/10" 
      },
      failed: { 
        icon: XCircle, 
        label: "Failed", 
        color: "text-red-400", 
        bg: "bg-red-400/10" 
      },
      refunded: { 
        icon: RefreshCw, 
        label: "Refunded", 
        color: "text-gray-400", 
        bg: "bg-gray-400/10" 
      }
    };
    return configs[status] || { 
      icon: Clock, 
      label: "Unknown", 
      color: "text-goblin-fg/50", 
      bg: "bg-goblin-fg/5" 
    };
  };

  const downloadReceipt = (order: Order) => {
    const receiptContent = `
╔════════════════════════════════════════╗
║         GAMESGOBLIN RECEIPT            ║
╚════════════════════════════════════════╝

Order Number: ${order.orderNumber}
Date: ${new Date(order.createdAt).toLocaleString('en-IN')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GAME DETAILS
Game: ${order.gameName}
Package: ${order.packageName}${order.quantity && order.quantity > 1 ? ` × ${order.quantity}` : ''}
${order.quantity && order.quantity > 1 ? `Total Items: ${calculateTotalItems(order.packageName, order.quantity)}` : ''}

PLAYER DETAILS  
Player ID: ${order.playerDetails.playerId}
${order.playerDetails.zoneId ? `Zone ID: ${order.playerDetails.zoneId}` : ''}
${order.playerDetails.playerName ? `Player Name: ${order.playerDetails.playerName}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAYMENT DETAILS
${order.quantity && order.quantity > 1 ? `Unit Price: ₹${calculateUnitPrice(order.totalPrice, order.quantity)}
Quantity: ${order.quantity}
` : ''}Amount Paid: ₹${order.totalPrice}
Payment Status: ${order.paymentStatus.toUpperCase()}
${order.payerUpi ? `UPI ID: ${order.payerUpi}` : ''}
${order.txnId ? `Transaction ID: ${order.txnId}` : ''}
${order.utr ? `UTR: ${order.utr}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ORDER STATUS: ${order.status.toUpperCase()}

Thank you for your purchase!
Visit us at gamesgoblin.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated: ${new Date().toLocaleString('en-IN')}
    `.trim();

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GameGoblin-Receipt-${order.orderNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-goblin-bg py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-goblin-fg mb-2">Orders</h1>
            <p className="text-goblin-fg/60">Track and manage your purchases</p>
          </div>
          {isAuthenticated && (
            <Button
              onClick={fetchUserOrders}
              variant="outline"
              className="border-[#4ecdc4] text-[#4ecdc4] hover:bg-[#4ecdc4]/10"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {(Object.entries(statusCounts) as [OrderStatus, number][]).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`flex-shrink-0 px-6 py-3 rounded-lg border transition-all ${
                statusFilter === status
                  ? "border-[#4ecdc4] bg-[#4ecdc4]/10 text-goblin-fg"
                  : "border-goblin-border/30 text-goblin-fg/60 hover:border-goblin-border/50"
              }`}
            >
              <div className="text-sm font-medium capitalize">{status}</div>
              <div className="text-xs text-goblin-fg/40 mt-0.5">{count} order{count !== 1 ? 's' : ''}</div>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-goblin-fg/40" />
            <Input
              placeholder="Search by order ID or game name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 bg-goblin-bg-card border-goblin-border/30 focus:border-[#4ecdc4] text-goblin-fg"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <OrderCardSkeleton key={i} />
            ))}
          </div>
        ) : !isAuthenticated ? (
          <div className="text-center py-20 border border-goblin-border/30 rounded-lg bg-goblin-bg-card">
            <User className="w-16 h-16 text-goblin-fg/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-goblin-fg mb-2">Login Required</h3>
            <p className="text-goblin-fg/60 mb-8">Please login to view your order history</p>
            <Button 
              onClick={openAuthModal}
              className="bg-[#4ecdc4] hover:bg-[#4ecdc4]/90 text-white h-12 px-8"
            >
              Login with Phone
            </Button>
          </div>
        ) : error ? (
          <div className="text-center py-20 border border-red-500/30 rounded-lg bg-red-500/5">
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-goblin-fg mb-2">Error Loading Orders</h3>
            <p className="text-goblin-fg/60 mb-8">{error}</p>
            <Button 
              onClick={fetchUserOrders}
              variant="outline"
              className="border-[#4ecdc4] text-[#4ecdc4] hover:bg-[#4ecdc4]/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order: Order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;
              
              // Get game icon from games map using game name
              const gameKey = order.gameName.toLowerCase().trim();
              const gameData = gamesMap[gameKey];
              const gameIcon = gameData?.icon || '/game-placeholder.svg';
              
              return (
                <div
                  key={order._id}
                  className="border border-goblin-border/30 rounded-lg bg-goblin-bg-card hover:border-goblin-border/50 transition-colors"
                >
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-goblin-border/30 flex-shrink-0">
                          <Image
                            src={gameIcon}
                            alt={order.gameName}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/game-placeholder.svg";
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-goblin-fg mb-1 truncate">
                            {order.gameName}
                          </h3>
                          <p className="text-sm text-goblin-fg/60 line-clamp-2 leading-tight">
                            {formatPackageWithQuantity(order.packageName, order.quantity || 1)}
                          </p>
                          {order.quantity && order.quantity > 1 && (
                            <p className="text-xs text-[#4ecdc4] mt-1">
                              Total: {calculateTotalItems(order.packageName, order.quantity)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xl sm:text-2xl font-bold text-[#50fa7b] whitespace-nowrap">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                        {order.quantity && order.quantity > 1 ? (
                          <p className="text-xs text-goblin-fg/40 mt-1 whitespace-nowrap">
                            ₹{calculateUnitPrice(order.totalPrice, order.quantity).toLocaleString('en-IN')} × {order.quantity}
                          </p>
                        ) : (
                          <p className="text-xs text-goblin-fg/40 mt-1 whitespace-nowrap">Total Amount</p>
                        )}
                      </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="min-w-0">
                        <p className="text-xs text-goblin-fg/40 mb-1">Order ID</p>
                        <p className="font-mono text-xs sm:text-sm text-goblin-fg truncate">{order.orderNumber}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-goblin-fg/40 mb-1">Player ID</p>
                        <p className="font-mono text-xs sm:text-sm text-goblin-fg/60 truncate">
                          {order.playerDetails?.playerId || "N/A"}
                          {order.playerDetails?.zoneId && ` (${order.playerDetails.zoneId})`}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-goblin-fg/40 mb-1">Payment Status</p>
                        <p className="text-sm font-semibold text-[#4ecdc4] capitalize">{order.paymentStatus}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-goblin-fg/40 mb-1">Date</p>
                        <p className="text-xs sm:text-sm text-goblin-fg/60">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>

                    {/* Error Message if Failed */}
                    {order.errorMessage && (
                      <div className={`mb-4 p-3 rounded-lg ${
                        isPartialFulfillment(order.errorMessage)
                          ? 'bg-yellow-500/10 border border-yellow-500/30'
                          : 'bg-red-500/10 border border-red-500/30'
                      }`}>
                        <p className={`text-sm ${
                          isPartialFulfillment(order.errorMessage) ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {isPartialFulfillment(order.errorMessage) ? '⚠️' : '❌'} {order.errorMessage}
                        </p>
                        {isPartialFulfillment(order.errorMessage) && (
                          <p className="text-xs text-yellow-400/80 mt-2">
                            Our team is working to complete the remaining items. You'll be notified once done.
                          </p>
                        )}
                      </div>
                    )}

                    {/* Status & Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-goblin-border/20">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${statusConfig.bg}`}>
                        <StatusIcon 
                          className={`h-4 w-4 ${statusConfig.color} ${
                            order.status === 'processing' ? 'animate-spin' : ''
                          }`} 
                        />
                        <span className={`text-sm font-medium ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        {order.status === "completed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadReceipt(order)}
                            className="flex-1 sm:flex-none border-goblin-border/30 hover:border-[#4ecdc4] hover:bg-[#4ecdc4]/5"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Receipt
                          </Button>
                        )}
                        {(order.status === "pending" || order.status === "processing") && order.paymentStatus === "paid" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => checkPaymentStatus(order.orderNumber)}
                            disabled={checkingPayment[order.orderNumber]}
                            className="flex-1 sm:flex-none border-yellow-500/30 hover:border-yellow-500 hover:bg-yellow-500/5 text-yellow-400"
                          >
                            {checkingPayment[order.orderNumber] ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Checking...
                              </>
                            ) : (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Check Status
                              </>
                            )}
                          </Button>
                        )}
                        {order.paymentUrl && order.paymentStatus === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => window.open(order.paymentUrl, '_blank')}
                            className="flex-1 sm:flex-none bg-[#4ecdc4] hover:bg-[#4ecdc4]/90 text-black"
                          >
                            Complete Payment
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                          className="flex-1 sm:flex-none border-goblin-border/30 hover:border-[#4ecdc4] hover:bg-[#4ecdc4]/5"
                        >
                          {expandedOrder === order._id ? 'Hide' : 'Details'}
                          <ChevronRight className={`h-4 w-4 ml-1 transition-transform ${
                            expandedOrder === order._id ? 'rotate-90' : ''
                          }`} />
                        </Button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedOrder === order._id && (
                      <div className="mt-4 pt-4 border-t border-goblin-border/20 space-y-3">
                        <h4 className="text-sm font-semibold text-goblin-fg mb-3">Order Details</h4>
                        
                        <div className="grid grid-cols-1 gap-3">
                          {/* Customer Info */}
                          {order.customerPhone && (
                            <div className="bg-goblin-bg/50 p-3 rounded-lg">
                              <p className="text-xs text-goblin-fg/40 mb-1">Contact</p>
                              <p className="text-sm text-goblin-fg/80 font-mono break-all">+{order.customerPhone}</p>
                            </div>
                          )}
                          
                          {/* Payment Info */}
                          {order.payerUpi && (
                            <div className="bg-goblin-bg/50 p-3 rounded-lg">
                              <p className="text-xs text-goblin-fg/40 mb-1">Paid via UPI</p>
                              <p className="text-sm text-[#4ecdc4] font-mono break-all">{order.payerUpi}</p>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Transaction ID */}
                            {order.txnId && (
                              <div className="bg-goblin-bg/50 p-3 rounded-lg">
                                <p className="text-xs text-goblin-fg/40 mb-1">Transaction ID</p>
                                <p className="text-sm text-goblin-fg/80 font-mono break-all">{order.txnId}</p>
                              </div>
                            )}
                            
                            {/* UTR Number */}
                            {order.utr && (
                              <div className="bg-goblin-bg/50 p-3 rounded-lg">
                                <p className="text-xs text-goblin-fg/40 mb-1">UTR Number</p>
                                <p className="text-sm text-goblin-fg/80 font-mono">{order.utr}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            {/* Payment Status */}
                            <div className="bg-goblin-bg/50 p-3 rounded-lg">
                              <p className="text-xs text-goblin-fg/40 mb-1">Payment Status</p>
                              <p className="text-sm text-goblin-fg/80 capitalize">{order.paymentStatus}</p>
                            </div>
                            
                            {/* Payment Completed */}
                            {order.paymentCompletedAt && (
                              <div className="bg-goblin-bg/50 p-3 rounded-lg">
                                <p className="text-xs text-goblin-fg/40 mb-1">Completed At</p>
                                <p className="text-xs text-goblin-fg/80">{formatDate(order.paymentCompletedAt)}</p>
                              </div>
                            )}
                          </div>
                          
                          {/* Player Details */}
                          <div className="bg-goblin-bg/50 p-3 rounded-lg">
                            <p className="text-xs text-goblin-fg/40 mb-2">Player Information</p>
                            <div className="space-y-1">
                              <p className="text-sm text-goblin-fg/80">
                                <span className="text-goblin-fg/60">Player ID:</span> {order.playerDetails.playerId}
                              </p>
                              {order.playerDetails.zoneId && (
                                <p className="text-sm text-goblin-fg/80">
                                  <span className="text-goblin-fg/60">Zone ID:</span> {order.playerDetails.zoneId}
                                </p>
                              )}
                              {order.playerDetails.playerName && (
                                <p className="text-sm text-goblin-fg/80">
                                  <span className="text-goblin-fg/60">Player Name:</span> {order.playerDetails.playerName}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 border border-goblin-border/30 rounded-lg bg-goblin-bg-card">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-goblin-fg mb-2">No orders found</h3>
            <p className="text-goblin-fg/60 mb-8">
              {searchQuery || statusFilter !== "all" 
                ? "Try adjusting your filters" 
                : "Start shopping to see your orders here"}
            </p>
            <Link href="/games">
              <Button className="bg-[#4ecdc4] hover:bg-[#4ecdc4]/90 text-white h-12 px-8">
                Browse Games
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}

        {/* Support CTA */}
        <div className="mt-12 p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-goblin-fg mb-1">Need help?</h3>
              <p className="text-sm text-goblin-fg/60">Contact support for assistance with your orders</p>
            </div>
            <Link href="/support">
              <Button
                variant="outline"
                className="border-[#4ecdc4] text-[#4ecdc4] hover:bg-[#4ecdc4]/10"
              >
                Contact Support
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}