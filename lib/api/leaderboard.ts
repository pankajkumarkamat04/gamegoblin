import { buildAPIURL, getAPIHeaders } from "@/lib/utils";
import Cookies from "js-cookie";

export type Period = "all-time" | "month" | "week" | "today";

interface LeaderboardEntry {
  userId: string;
  name: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  rank: number;
}

interface LeaderboardResult {
  success: boolean;
  data?: {
    leaderboard: LeaderboardEntry[];
  };
  error?: string;
}

interface UserStatsResult {
  success: boolean;
  data?: {
    rank: number;
    totalOrders: number;
    totalSpent: number;
  };
  error?: string;
}

// Helper to get auth token the same way as other pages
function getAuthToken(): string | undefined {
  let token = Cookies.get("user_token");
  if (!token && typeof window !== "undefined") {
    try {
      token = window.localStorage.getItem("user_token") || undefined;
    } catch {
      token = undefined;
    }
  }
  return token;
}

// Fetch leaderboard from Onetopup backend (/api/v1/user/leaderboard)
export async function getLeaderboard(
  _period: Period,
  _limit: number
): Promise<LeaderboardResult> {
  const token = getAuthToken();
  if (!token) {
    return { success: false, error: "no_token" };
  }

  try {
    // Onetopup event leaderboard uses eventDate=event
    const url = buildAPIURL("/api/v1/user/leaderboard?eventDate=event");
    const res = await fetch(url, {
      method: "GET",
      headers: {
        ...getAPIHeaders(false),
        Authorization: `Bearer ${token}`,
      },
    });

    const raw = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: raw?.message || "failed_to_load_leaderboard",
      };
    }

    // Onetopup shape (event leaderboard):
    // { currentPeriod: { leaderboard: [...], walletAdders: [...] }, lastPeriod: { ... } }
    const current = raw?.currentPeriod?.leaderboard || [];

    const leaderboard: LeaderboardEntry[] = current.map(
      (entry: any, index: number) => ({
        userId: entry._id || entry.userId || String(index),
        name: entry.name || "Player",
        phone: entry.phone || entry.email || "",
        totalOrders: entry.purchaseCount ?? entry.totalOrders ?? 0,
        totalSpent: entry.totalPurchaseAmount ?? entry.totalSpent ?? 0,
        rank: index + 1,
      })
    );

    return {
      success: true,
      data: { leaderboard },
    };
  } catch (e: any) {
    return {
      success: false,
      error: e?.message || "leaderboard_error",
    };
  }
}

// Derive simple user stats from the same leaderboard list
export async function getUserStats(
  userId: string,
  period: Period
): Promise<UserStatsResult> {
  const lb = await getLeaderboard(period, 20);
  if (!lb.success || !lb.data) {
    return { success: false, error: lb.error || "no_leaderboard" };
  }

  const idx = lb.data.leaderboard.findIndex((e) => e.userId === userId);
  if (idx === -1) {
    return {
      success: true,
      data: {
        rank: lb.data.leaderboard.length + 1,
        totalOrders: 0,
        totalSpent: 0,
      },
    };
  }

  const entry = lb.data.leaderboard[idx];
  return {
    success: true,
    data: {
      rank: entry.rank,
      totalOrders: entry.totalOrders,
      totalSpent: entry.totalSpent,
    },
  };
}

// Utility: hide middle digits of phone number
export function maskPhoneNumber(phone: string): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length <= 4) return digits;
  const visibleStart = digits.slice(0, 2);
  const visibleEnd = digits.slice(-2);
  return `${visibleStart}${"*".repeat(Math.max(digits.length - 4, 0))}${visibleEnd}`;
}

// Utility: format INR currency
export function formatCurrency(amount: number): string {
  if (!Number.isFinite(amount)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

