"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Package2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { getActiveGames, CATEGORIES, type Game } from "@/lib/games-data";
import { GameCardSkeleton } from "@/components/ui/skeletons";

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      setLoading(true);
      const allGames = await getActiveGames();

      // Prefer games that have a valid ID; fall back to any others if needed
      const gamesWithId = allGames.filter((game) => game._id);
      const sourceGames = gamesWithId.length > 0 ? gamesWithId : allGames;

      // Sort: Featured games first, then by sort order
      const sorted = sourceGames.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return (a.sortOrder || 0) - (b.sortOrder || 0);
      });

      setGames(sorted);
    } catch (error) {
      console.error('Failed to load games:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGames = games.filter((game) => {
    const matchesCategory = selectedCategory === "All" || game.category === selectedCategory;
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-goblin-bg py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-8">
            <div className="h-10 w-48 bg-goblin-bg-card/50 rounded-lg animate-pulse mb-2" />
            <div className="h-5 w-64 bg-goblin-bg-card/30 rounded animate-pulse" />
          </div>
          
          <div className="mb-6 max-w-md">
            <div className="h-10 w-full bg-goblin-bg-card/50 rounded-lg animate-pulse" />
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 w-24 bg-goblin-bg-card/50 rounded-lg animate-pulse" />
            ))}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-6 sm:gap-8">
            {[...Array(14)].map((_, i) => (
              <GameCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-goblin-bg py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-goblin-fg mb-2">All Games</h1>
          <p className="text-goblin-fg/60">Choose your game and top up instantly</p>
        </div>

        <div className="mb-6 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-goblin-fg/40" />
            <Input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-goblin-bg-card border-goblin-border/30 text-goblin-fg"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={"px-4 py-2 rounded-lg text-sm font-medium transition-colors " + (selectedCategory === cat ? "bg-[#4ecdc4] text-white" : "bg-goblin-bg-card text-goblin-fg/70 hover:text-goblin-fg")}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredGames.length === 0 ? (
          <Card className="p-20 text-center bg-goblin-bg-card border-goblin-border">
            <Package2 className="w-20 h-20 mx-auto mb-6 text-goblin-muted" />
            <h3 className="text-xl font-bold text-goblin-fg mb-2">No Games Found</h3>
            <p className="text-goblin-muted mb-6">
              {searchQuery 
                ? `No games match "${searchQuery}". Try a different search term.`
                : `No games available in the ${selectedCategory} category.`}
            </p>
            {(searchQuery || selectedCategory !== "All") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="px-6 py-2 bg-[#4ecdc4] hover:bg-[#4ecdc4]/90 text-white rounded-lg font-semibold transition-colors"
              >
                Clear Filters
              </button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-6 sm:gap-8">
          {filteredGames.map((game) => {
            // Use game ID for routing when available, otherwise fall back to slug
            const gameId = game._id || game.slug;

            // All active games are available (no hardcoded checks)
            // Use isActive flag from backend to determine availability
            const isComingSoon = !game.isActive;
            
            if (isComingSoon) {
              return (
                <div
                  key={gameId}
                  className="group flex flex-col items-center gap-3 cursor-not-allowed opacity-75"
                >
                  {/* Game Logo */}
                  <div className="relative w-full aspect-[397/429]">
                    <Image
                      src={game.icon || "/game-placeholder.svg"}
                      alt={game.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 14vw"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative bg-gradient-to-br from-[#4ecdc4] via-[#44a3f7] to-[#4ecdc4] p-[1.5px] rounded-md shadow-lg">
                        <div className="bg-[#1a1f2e] px-2.5 py-1 sm:px-4 sm:py-2 rounded-md">
                          <span className="text-[9px] sm:text-xs md:text-sm font-bold bg-gradient-to-r from-[#4ecdc4] to-[#44a3f7] text-transparent bg-clip-text whitespace-nowrap tracking-wide">
                            COMING SOON
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Game Info */}
                  <div className="w-full text-center">
                    <h3 className="text-xs sm:text-sm font-semibold text-goblin-fg/90 line-clamp-2 mb-1 leading-tight min-h-[2.5rem] flex items-center justify-center">
                      {game.name}
                    </h3>
                    <p className="text-xs text-goblin-muted/60 font-medium">
                      Stay Tuned
                    </p>
                  </div>
                </div>
              );
            }
            
            return (
              <Link
                key={gameId}
                href={`/games/${gameId}`}
                className="group flex flex-col items-center gap-3 transition-transform duration-200 hover:scale-105"
              >
                {/* Game Logo - No container, transparent PNG with natural curves (397×429 aspect ratio) */}
                <div className="relative w-full aspect-[397/429]">
                  <Image
                    src={game.icon || "/game-placeholder.svg"}
                    alt={game.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 14vw"
                  />
                </div>
                
                {/* Game Info */}
                <div className="w-full text-center">
                  <h3 className="text-xs sm:text-sm font-semibold text-goblin-fg/90 group-hover:text-goblin-fg transition-colors line-clamp-2 mb-1 leading-tight min-h-[2.5rem] flex items-center justify-center">
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
        )}
      </div>
    </div>
  );
}
