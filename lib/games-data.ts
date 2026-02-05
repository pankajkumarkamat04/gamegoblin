// Games data fetched from API with caching
// This allows dynamic updates via admin dashboard while maintaining performance
import { buildAPIURL } from "@/lib/utils";

export interface Game {
  _id?: string;
  // Slug used for public URLs
  slug: string;
  // Display name
  name: string;
  // Backend game code used for validations (e.g. "MOBILE_LEGENDS_PRO")
  backendCode?: string;
  icon: string;
  banner: string;
  category: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder?: number;
  images?: {
    icon?: string;
    banner?: string;
  };
}

export interface GameValidationHistoryEntry {
  _id: string;
  gameId: string;
  playerId: string;
  server: string;
  timestamp: string;
  playerName?: string;
}

export interface GameValidationHistoryResponse {
  success: boolean;
  gameId: string;
  count: number;
  validationHistory: GameValidationHistoryEntry[];
}

// Helper to get backend game code for validation APIs
export function getBackendGameCode(game: Game): string {
  // Prefer explicit backend code if present
  if (game.backendCode && game.backendCode.trim() !== "") {
    return game.backendCode;
  }

  // Known mapping for specific game IDs (e.g. Mobile Legends Pro)
  if (game._id === "68c18d6344fcb919aaa88213") {
    return "MOBILE_LEGENDS_PRO";
  }

  // Fallback: derive a code from slug (e.g. "mobile-legends-global" -> "MOBILE_LEGENDS_GLOBAL")
  return game.slug.toUpperCase().replace(/-/g, "_");
}

// In-memory cache
let cachedGames: Game[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Slugify helper
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-');  // Replace multiple - with single -
}

// Fetch games from API
async function fetchGamesFromAPI(): Promise<Game[]> {
  try {
    const response = await fetch(buildAPIURL("/api/v1/games/get-all"));
    const data = await response.json();

    if (data.success && data.games) {
      const gamesArray = data.games;

      // Transform API data to our Game interface
      const transformed = gamesArray
        .map((game: any) => {
          // Flatten image logic
          const iconUrl = game.image || '/game-placeholder.svg';
          const bannerUrl = game.image || '/banner/banner1.jpg'; // Use same image for banner if not provided

          // Generate slug if missing
          const slug = game.slug || slugify(game.name);

          return {
            _id: game._id,
            slug: slug,
            name: game.name,
            // Prefer explicit backend game code field if API provides it
            backendCode: game.game || game.code || undefined,
            icon: iconUrl,
            banner: bannerUrl,
            category: game.category || 'Game',
            isActive: true, // API doesn't seem to return isActive, assume true
            isFeatured: true, // Assume all fetched are featured/active for now?
            sortOrder: 0,
            images: {
              icon: iconUrl,
              banner: bannerUrl,
            },
          };
        });

      return transformed;
    }
    return [];
  } catch (error) {
    console.error('❌ Failed to fetch games from API:', error);
    return FALLBACK_GAMES; // Use fallback if API fails
  }
}

// Fetch validation history for a specific game by ID
export async function getGameValidationHistory(gameId: string): Promise<GameValidationHistoryEntry[]> {
  try {
    // Attach auth token so Onetopup returns history for logged-in users
    let token: string | undefined;
    if (typeof window !== "undefined") {
      try {
        token =
          window.localStorage.getItem("user_token") ||
          window.localStorage.getItem("authToken") ||
          undefined;
      } catch {
        token = undefined;
      }
    }

    const response = await fetch(
      buildAPIURL(`/api/v1/games/${gameId}/validation-history`),
      {
        method: "GET",
        cache: "no-store",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );

    if (!response.ok) {
      console.error('❌ Failed to fetch validation history:', response.status, response.statusText);
      return [];
    }

    const data: GameValidationHistoryResponse = await response.json();

    if (!data.success || !Array.isArray(data.validationHistory)) {
      return [];
    }

    return data.validationHistory;
  } catch (error) {
    console.error('❌ Error loading validation history:', error);
    return [];
  }
}

// Fallback games data (used only if API fails)
const FALLBACK_GAMES: Game[] = [
  {
    slug: "moba-legends-5v5",
    name: "Moba Legends: 5v5",
    icon: "/icons/mobalegends.png",
    banner: "/banner/banner1.jpg",
    category: "MOBA",
    isActive: true,
    isFeatured: true,
  },
  {
    slug: "mobile-legends",
    name: "Mobile Legends: Bang Bang",
    icon: "/icons/mlbb.png",
    banner: "/banner/banner2.jpg",
    category: "MOBA",
    isActive: true,
    isFeatured: true,
  },
  {
    slug: "mobile-legends-sgmy",
    name: "Mobile Legends SG/MY",
    icon: "/icons/mlbb.png",
    banner: "/banner/banner2.jpg",
    category: "MOBA",
    isActive: true,
    isFeatured: false,
  },
  {
    slug: "mobile-legends-php",
    name: "Mobile Legends PHP (Small Packs)",
    icon: "/icons/mlbb.png",
    banner: "/banner/banner2.jpg",
    category: "MOBA",
    isActive: true,
    isFeatured: false,
  },
  {
    slug: "mobile-legends-indo",
    name: "Mobile Legends Indo (Small Packs)",
    icon: "/icons/mlbb.png",
    banner: "/banner/banner2.jpg",
    category: "MOBA",
    isActive: true,
    isFeatured: false,
  },
  {
    slug: "honor-of-kings",
    name: "Honor of Kings",
    icon: "/icons/honor-of-kings.png",
    banner: "/banner/banner3.jpg",
    category: "MOBA",
    isActive: true,
    isFeatured: true,
  },
  {
    slug: "genshin-impact",
    name: "Genshin Impact",
    icon: "/icons/genshin-impact.png",
    banner: "/banner/banner1.jpg",
    category: "RPG",
    isActive: true,
    isFeatured: true,
  },
  {
    slug: "bgmi",
    name: "BGMI",
    icon: "https://ik.imagekit.io/indrantesei/game-icons/bgmi.jpg",
    banner: "https://ik.imagekit.io/indrantesei/game-icons/bgmi.jpg",
    category: "Battle Royale",
    isActive: true,
    isFeatured: true,
  },
  // {
  //   slug: "pubg-mobile",
  //   name: "PUBG Mobile",
  //   icon: "/icons/pubg.png",
  //   banner: "/banner/banner1.jpg",
  //   category: "Battle Royale",
  //   isActive: true,
  //   isFeatured: false,
  // },
];

// Helper functions with caching
export async function getAllGames(): Promise<Game[]> {
  // TEMPORARY: Force clear cache to test image loading
  // TODO: Remove these lines after testing
  cachedGames = null;
  cacheTimestamp = 0;

  const now = Date.now();

  // Return cached data if still valid
  if (cachedGames && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedGames as Game[];
  }

  // Fetch fresh data
  cachedGames = await fetchGamesFromAPI();
  cacheTimestamp = now;

  return cachedGames as Game[];
}

// Get only active games for public display
export async function getActiveGames(): Promise<Game[]> {
  const allGames = await getAllGames();
  return allGames.filter((game: Game) => game.isActive);
}

export async function getFeaturedGames(): Promise<Game[]> {
  const games = await getActiveGames();
  return games.filter(game => game.isFeatured);
}

export async function getGameBySlug(slug: string): Promise<Game | undefined> {
  const games = await getActiveGames();
  return games.find(game => game.slug === slug);
}

export async function getGameById(id: string): Promise<Game | undefined> {
  const games = await getActiveGames();
  return games.find(game => game._id === id);
}

export async function getGameBySlugOrId(slugOrId: string): Promise<Game | undefined> {
  const games = await getActiveGames();
  // Try to find by ID first (if it looks like a MongoDB ObjectId)
  if (slugOrId.length === 24 && /^[a-f0-9]+$/i.test(slugOrId)) {
    const gameById = games.find(game => game._id === slugOrId);
    if (gameById) return gameById;
  }
  // Fall back to slug
  return games.find(game => game.slug === slugOrId);
}

export async function getGamesByCategory(category: string): Promise<Game[]> {
  const games = await getActiveGames();
  return games.filter(game => game.category === category);
}

// Force refresh cache (useful for admin updates)
export async function refreshGamesCache(): Promise<Game[]> {
  cachedGames = await fetchGamesFromAPI();
  cacheTimestamp = Date.now();
  return cachedGames;
}

export const CATEGORIES = [
  "All",
  "MOBA",
  "Battle Royale",
  "RPG",
  "Strategy",
];
