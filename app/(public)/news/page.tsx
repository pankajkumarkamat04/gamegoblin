"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Megaphone, ArrowLeft, Pin } from "lucide-react";
import { getNewsList, type NewsItem } from "@/lib/api/news";
import { useUserAuth } from "@/contexts/UserAuthContext";

export default function NewsPage() {
  const { isAuthenticated } = useUserAuth();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      const res = await getNewsList(1, 20);
      if (!res.success || !res.data) {
        setError(res.error || "Failed to load news");
        setNews([]);
      } else {
        // Pinned first, then newest first
        const sorted = [...res.data.news].sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        setNews(sorted);
      }
      setLoading(false);
    };
    load();
  }, []);

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const formatDate = (value: string) =>
    new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-goblin-bg py-16">
      <div className="container mx-auto px-4 max-w-4xl space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-goblin-muted hover:text-goblin-fg hover:bg-goblin-bg-card"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-goblin-fg flex items-center gap-2">
                <Megaphone className="w-6 h-6 text-goblin-green" />
                News & Announcements
              </h1>
              <p className="text-sm text-goblin-muted">
                Latest updates, fixes, and promo drops from the Goblin bunker.
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <Card className="bg-goblin-bg-card border-goblin-border py-16 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-goblin-green animate-spin" />
          </Card>
        ) : error ? (
          <Card className="bg-goblin-bg-card border-red-500/40 py-10 px-6 text-center space-y-3">
            <p className="text-red-300 font-semibold">Failed to load news</p>
            <p className="text-sm text-goblin-muted">{error}</p>
          </Card>
        ) : news.length === 0 ? (
          <Card className="bg-goblin-bg-card border-goblin-border py-12 px-6 text-center space-y-3">
            <Megaphone className="w-10 h-10 mx-auto text-goblin-muted/50" />
            <p className="text-goblin-fg font-semibold">No announcements yet</p>
            <p className="text-sm text-goblin-muted">
              When the Goblin has something to say, it will show up here.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {news.map((item) => {
              const isOpen = expanded.has(item._id);
              const showBody = isOpen || item.summary.length <= 160;
              return (
                <Card
                  key={item._id}
                  className="bg-goblin-bg-card border-goblin-border/70 hover:border-goblin-green/50 transition-colors cursor-pointer"
                  onClick={() => toggleExpanded(item._id)}
                >
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase tracking-wide text-goblin-muted">
                          {item.category || "update"}
                        </span>
                        {item.isPinned && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-goblin-green/10 border border-goblin-green/40 px-2 py-0.5 text-[10px] font-semibold text-goblin-green">
                            <Pin className="w-3 h-3" />
                            Pinned
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-goblin-muted">
                        {formatDate(item.publishedAt || item.createdAt)}
                      </span>
                    </div>
                    <h2 className="text-sm sm:text-base font-semibold text-goblin-fg">
                      {item.title}
                    </h2>
                    <p className="text-sm text-goblin-muted leading-relaxed">
                      {showBody
                        ? item.summary
                        : `${item.summary.slice(0, 160)}…`}
                    </p>
                    {!showBody && (
                      <p className="text-xs text-goblin-green mt-1">
                        Read more
                      </p>
                    )}
                    {isOpen && item.content && (
                      <div className="pt-3 border-t border-goblin-border/40 text-sm text-goblin-fg/90">
                        {item.contentType === "html" ? (
                          <div
                            className="prose prose-invert prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: item.content }}
                          />
                        ) : (
                          <p className="whitespace-pre-line">{item.content}</p>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {!isAuthenticated && (
          <p className="text-[11px] text-goblin-muted text-center">
            Some promos may only appear when you are logged in.
          </p>
        )}
      </div>
    </div>
  );
}

