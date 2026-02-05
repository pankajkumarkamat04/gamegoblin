"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getFeaturedGames, getActiveGames, type Game } from "@/lib/games-data";

export function DirectTopupsSection() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(10);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      setLoading(true);
      const featuredGames = await getFeaturedGames();
      const allGames = await getActiveGames();

      // Combine: featured first, then other active games
      const combined = [
        ...featuredGames,
        ...allGames.filter(g => !g.isFeatured)
      ];

      // Sort by featured status, then by sort order
      const sorted = combined.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      });

      // Filter out games without IDs
      const validGames = sorted.filter(g => g._id);

      setGames(validGames);
    } catch (error) {
      console.error('Failed to load games:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-goblin-bg py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#4ecdc4]" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-goblin-bg py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-goblin-fg mb-2">
              Popular Games
            </h2>
            <p className="text-goblin-fg/60 text-sm sm:text-base">
              Quick recharge at best prices
            </p>
          </div>
          <Link
            href="/games"
            className="hidden sm:flex items-center gap-1 text-[#4ecdc4] hover:text-[#50fa7b] font-medium text-sm transition-colors"
          >
            Browse All Games
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Games Grid - No containers for transparent PNG logos */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-6 sm:gap-8">
          {games.slice(0, displayCount).filter(game => {
            // Filter out games with placeholder images
            const hasPlaceholderIcon = game.icon?.includes('3048357.png');
            return !hasPlaceholderIcon;
          }).map((game) => {
            return (
              <Link
                key={game._id} // Use ID as key
                href={`/games/${game._id}`} // Strictly use ID
                className="group flex flex-col items-center gap-3 transition-transform duration-200 hover:scale-105"
              >
                {/* Game Logo - No container, transparent PNG with special shape (397×429 aspect ratio) */}
                <div className="relative w-full aspect-[397/429]">
                  <Image
                    src={game.icon || '/game-placeholder.svg'}
                    alt={game.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 14vw"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/game-placeholder.svg";
                    }}
                  />
                </div>

                {/* Game Info */}
                <div className="w-full text-center">
                  <h3 className="text-xs sm:text-sm font-semibold text-goblin-fg/90 group-hover:text-goblin-fg line-clamp-2 mb-1 transition-colors leading-tight min-h-[2.5rem] flex items-center justify-center">
                    {game.name}
                  </h3>
                  <p className="text-xs text-[#4ecdc4]/80 font-medium">
                    Top Up Now
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Button - Mobile */}
        <div className="text-center mt-8 sm:hidden">
          <Button
            variant="outline"
            className="border-[#4ecdc4]/50 text-[#4ecdc4] hover:bg-[#4ecdc4]/10 hover:border-[#4ecdc4] px-8"
            asChild
          >
            <Link href="/games">
              Browse All Games
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}