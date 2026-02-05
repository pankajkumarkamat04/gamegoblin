"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Trophy, 
  Crown, 
  Medal, 
  TrendingUp, 
  Loader2,
  Zap
} from "lucide-react";
import { getLeaderboard, getUserStats, maskPhoneNumber, formatCurrency } from "@/lib/api/leaderboard";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { motion, AnimatePresence } from "framer-motion";

type Period = 'all-time' | 'month' | 'week' | 'today';

export function LeaderboardSection() {
  const { user, isAuthenticated } = useUserAuth();
  const [period, setPeriod] = useState<Period>('all-time');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userStatsLoading, setUserStatsLoading] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserStats();
    }
  }, [period, isAuthenticated, user]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    const result = await getLeaderboard(period, 5);
    if (result.success && result.data) {
      setLeaderboard(result.data.leaderboard);
    }
    setLoading(false);
  };

  const fetchUserStats = async () => {
    if (!user) return;
    setUserStatsLoading(true);
    const result = await getUserStats((user as any)._id, period);
    if (result.success && result.data) {
      setUserStats(result.data);
    }
    setUserStatsLoading(false);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 3:
        return <Medal className="w-5 h-5 text-orange-400" />;
      default:
        return null;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-br from-yellow-500 to-yellow-600 text-black";
      case 2:
        return "bg-gradient-to-br from-gray-300 to-gray-400 text-black";
      case 3:
        return "bg-gradient-to-br from-orange-400 to-orange-500 text-black";
      default:
        return "bg-goblin-bg-alt text-goblin-muted";
    }
  };

  const periods = [
    { value: 'all-time' as Period, label: 'All Time', icon: TrendingUp },
    { value: 'month' as Period, label: 'This Month', icon: Trophy },
    { value: 'week' as Period, label: 'This Week', icon: Zap },
  ];

  return (
    <section className="py-12 sm:py-16 px-4 bg-gradient-to-b from-goblin-bg via-goblin-bg-alt to-goblin-bg">
      <div className="container mx-auto max-w-6xl">
        <div className="border-t border-goblin-border/60 mt-12 sm:mt-16 pt-10 sm:pt-14">
          <div className="flex items-center justify-center gap-3 text-[10px] sm:text-xs uppercase tracking-[0.4em] text-goblin-muted mb-6">
            <span className="h-px w-10 sm:w-16 bg-goblin-border/50" />
            <span>Leaderboard Drop</span>
            <span className="h-px w-10 sm:w-16 bg-goblin-border/50" />
          </div>
          {/* Header */}
          <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-goblin-fg mb-3">
            Goblin's Fav Children
          </h2>
          <p className="text-goblin-muted text-sm sm:text-base max-w-2xl mx-auto">
            Just the loudest top-up flexers. Keep your crown or lose it tomorrow.
          </p>
        </div>

        {/* Period Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {periods.map((p) => {
            const Icon = p.icon;
            return (
              <Button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                variant={period === p.value ? "default" : "outline"}
                className={`${
                  period === p.value
                    ? "bg-goblin-green hover:bg-goblin-green/90 text-black"
                    : "bg-goblin-bg-card hover:bg-goblin-bg-alt text-goblin-fg border-goblin-border"
                } transition-all duration-200`}
                size="sm"
              >
                <Icon className="w-4 h-4 mr-1.5" />
                {p.label}
              </Button>
            );
          })}
        </div>

        {/* User's Rank Card (if logged in) */}
        {isAuthenticated && userStats && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="bg-goblin-bg-alt border border-goblin-border/70 p-4 shadow-none">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-goblin-muted">You rn</p>
                  <p className="text-3xl font-black text-goblin-fg">#{userStats.rank}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-goblin-muted">Spent so far</p>
                  <p className="text-2xl font-semibold text-goblin-green">
                    {formatCurrency(userStats.totalSpent)}
                  </p>
                  <p className="text-xs text-goblin-muted">{userStats.totalOrders} orders logged</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Leaderboard Table */}
        <Card className="bg-goblin-bg-card border-goblin-border shadow-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-goblin-green animate-spin" />
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-goblin-muted">
              <Trophy className="w-16 h-16 mb-4 opacity-20" />
              <p>No data for this period yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-goblin-border bg-goblin-bg-alt/50">
                    <th className="text-left p-4 text-xs font-semibold text-goblin-muted uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="text-left p-4 text-xs font-semibold text-goblin-muted uppercase tracking-wider">
                      Player
                    </th>
                    <th className="text-right p-4 text-xs font-semibold text-goblin-muted uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="text-right p-4 text-xs font-semibold text-goblin-muted uppercase tracking-wider">
                      Total Spent
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {leaderboard.slice(0, 5).map((entry, index) => (
                      <motion.tr
                        key={entry.userId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className={`border-b border-goblin-border/50 hover:bg-goblin-bg-alt/30 transition-colors ${
                          entry.rank <= 3 ? 'bg-goblin-bg-alt/20' : ''
                        }`}
                      >
                        {/* Rank */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${getRankBadgeColor(
                                entry.rank
                              )}`}
                            >
                              {entry.rank <= 3 ? getRankIcon(entry.rank) : entry.rank}
                            </div>
                          </div>
                        </td>

                        {/* Player Info */}
                        <td className="p-4">
                          <div>
                            <p className="font-semibold text-goblin-fg text-sm sm:text-base">
                              {entry.name || 'Anonymous Goblin'}
                            </p>
                            <p className="text-xs text-goblin-muted font-mono">
                              {maskPhoneNumber(entry.phone)}
                            </p>
                          </div>
                        </td>

                        {/* Orders */}
                        <td className="p-4 text-right">
                          <p className="text-goblin-fg font-semibold">{entry.totalOrders}</p>
                        </td>

                        {/* Total Spent */}
                        <td className="p-4 text-right">
                          <p
                            className={`font-bold text-sm sm:text-base ${
                              entry.rank <= 3 ? 'text-goblin-green' : 'text-goblin-fg'
                            }`}
                          >
                            {formatCurrency(entry.totalSpent)}
                          </p>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Bottom CTA */}
        <div className="text-center mt-6">
          <Link href="/leaderboard">
            <Button
              variant="outline"
              className="bg-goblin-bg-card hover:bg-goblin-green/10 text-goblin-fg border-goblin-border hover:border-goblin-green"
            >
              <Trophy className="w-4 h-4 mr-2" />
              View Full Leaderboard
            </Button>
          </Link>
        </div>
        </div>
      </div>
    </section>
  );
}
