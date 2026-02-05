"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getActiveGames } from "@/lib/games-data";

export function GameGridSection() {
    const [games, setGames] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadGames() {
            try {
                setLoading(true);
                // Fetch active games using the library function which calls the API
                const activeGames = await getActiveGames();

                // Filter and format games - only include games with valid IDs
                const formattedGames = activeGames
                    .filter(game => game._id) // Only include games with IDs
                    .map(game => ({
                        id: game._id!,
                        name: game.name,
                        icon: game.icon,
                        href: `/games/${game._id}`
                    }));

                setGames(formattedGames);
            } catch (error) {
                console.error("Failed to load games:", error);
            } finally {
                setLoading(false);
            }
        }

        loadGames();
    }, []);

    return (
        <section className="bg-goblin-bg py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center mb-8">
                    <div className="hidden sm:block h-px flex-1 bg-gradient-to-l from-goblin-border to-transparent mr-6 max-w-md"></div>
                    <h2 className="text-xl sm:text-2xl font-bold text-goblin-fg whitespace-nowrap tracking-tight">
                        Popular Games
                    </h2>
                    <div className="hidden sm:block h-px flex-1 bg-gradient-to-r from-goblin-border to-transparent ml-6 max-w-md"></div>
                </div>

                <div className="flex justify-center">
                    <div className="grid grid-cols-3 gap-6 max-w-4xl w-full">
                        {loading ? (
                            // Skeleton loading state
                            Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="flex flex-col items-center gap-3">
                                    <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
                                    <div className="w-20 h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                                </div>
                            ))
                        ) : games.length > 0 ? (
                            games.map((game) => (
                                <Link
                                    key={game.id}
                                    href={game.href}
                                    className="group flex flex-col items-center gap-3 p-4 rounded-xl bg-goblin-bg-card/50 hover:bg-goblin-bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-transparent hover:border-goblin-border"
                                >
                                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 aspect-square">
                                        <Image
                                            src={game.icon}
                                            alt={game.name}
                                            fill
                                            className="object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-110"
                                            sizes="(max-width: 640px) 96px, 112px"
                                            onError={(e) => {
                                                console.error('Failed to load icon:', game.icon);
                                                // Fallback logic handled by parent or default image
                                            }}
                                        />
                                    </div>
                                    <span className="text-sm font-semibold text-center text-goblin-fg/90 group-hover:text-goblin-fg transition-colors line-clamp-2 leading-tight">
                                        {game.name}
                                    </span>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-8 text-gray-400">
                                No games available
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
