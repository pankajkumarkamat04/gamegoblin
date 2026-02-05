"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  ChevronLeft,
  Loader2,
  ShoppingCart,
  CheckCircle2,
  AlertCircle,
  Shield,
  User,
  HelpCircle
} from "lucide-react";
import {
  FaGem,
  FaCrown,
  FaCalendarAlt,
  FaFire,
  FaShieldAlt,
  FaCheckCircle,
  FaStar,
  FaCircle,
  FaCoins,
  FaClock,
} from "react-icons/fa";
import {
  GiCrystalShine,
  GiTwoCoins,
  GiDiamondTrophy,
  GiSparkles
} from "react-icons/gi";
import {
  IoMdFlash
} from "react-icons/io";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getGameValidationHistory, getBackendGameCode, type GameValidationHistoryEntry } from "@/lib/games-data";
import { buildAPIURL } from "@/lib/utils";
import {
  getGamePackages,
  createOrder,
  type Package
} from "@/lib/packages-api";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { GameDetailSkeleton } from "@/components/ui/skeletons";
import {
  getSavedPlayerAccounts,
  savePlayerAccount,
  deletePlayerAccount,
  type SavedPlayerAccount
} from "@/lib/api/player-accounts";

interface RegionVerification {
  userId: string;
  zoneId: string;
  verified: boolean;
  ign: string;
  detectedRegion?: string;
  isCorrectRegion?: boolean;
}

// Time-limited package configuration
const TIME_LIMITED_PACKAGES = {
  "mobile-legends988_great-value-pass67": {
    id: "mobile-legends988_great-value-pass67",
    name: "Great Value Pass (150 Diamonds)",
    price: 67,
    reseller: "smileone",
    description: "Great Value Pass (150 Diamonds) - Time Limited: Jan 16-29",
    imageUrl: "https://img.smile.one/media/catalog/product/b/o9/bo9rnpqh5dyqxs01767947124.png",
    // Start: Jan 16, 2026 00:00 UTC-8 = Jan 16, 2026 13:30 GMT+5:30
    // End: Jan 29, 2026 23:59:59 UTC-8 = Jan 30, 2026 13:29:59 GMT+5:30
    startTime: new Date("2026-01-16T13:30:00+05:30").getTime(),
    endTime: new Date("2026-01-30T13:29:59+05:30").getTime(),
    games: ["mobile-legends", "moba-legends", "mobile-legends-sgmy", "mobile-legends-php", "mobile-legends-indo"]
  }
};

// Check if time-limited package is active
function isTimeLimitedPackageActive(packageId: string): boolean {
  const pkg = TIME_LIMITED_PACKAGES[packageId as keyof typeof TIME_LIMITED_PACKAGES];
  if (!pkg) return false;

  const now = Date.now();
  return now >= pkg.startTime && now <= pkg.endTime;
}

// Get time remaining for time-limited package in GMT+5:30
function getTimeRemaining(packageId: string): string | null {
  const pkg = TIME_LIMITED_PACKAGES[packageId as keyof typeof TIME_LIMITED_PACKAGES];
  if (!pkg) return null;

  const now = Date.now();
  const remaining = pkg.endTime - now;

  if (remaining <= 0) return "Expired";

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h remaining`;
  if (hours > 0) return `${hours}h ${minutes}m remaining`;
  return `${minutes}m remaining`;
}

// Package category detection
function categorizePackage(pkg: Package): string {
  // If API provides a category, use it directly
  if (pkg.category) {
    return pkg.category;
  }

  const name = (pkg.name || pkg.description || "").toLowerCase();
  const id = (pkg.productId || "").toLowerCase();

  // Time-limited packages get special category
  if (id.includes("great-value-pass")) return "Time Limited";

  // MLBB/Mobile Legends
  if (name.includes("weekly") || id.includes("weekly")) return "Weekly Pass";
  if (name.includes("twilight") || id.includes("twilight")) return "Twilight Pass";
  if (name.includes("diamond")) return "Diamonds";

  // Genshin Impact
  if (name.includes("chronal nexus") || id.includes("cn")) return "Chronal Nexus";
  if (name.includes("genesis") || name.includes("crystal")) return "Genesis Crystals";
  if (name.includes("welkin") || id.includes("welkin")) return "Blessing of Welkin Moon";
  if (name.includes("all pack") && (name.includes("genesis") || name.includes("crystal"))) return "Special Offers";

  // Honkai Star Rail
  if (name.includes("oneiric shard") || id.includes("hstr")) return "Oneiric Shards";
  if (name.includes("express supply") || id.includes("resp")) return "Express Supply Pass";
  if (name.includes("all pack") && name.includes("oneiric")) return "Special Offers";

  // Zenless Zone Zero
  if (name.includes("inter-knot") || id.includes("ikm")) return "Inter-Knot Membership";
  if ((name.includes("all pack") && name.includes("monochrome")) || id.includes("zzzall")) return "Special Offers";
  if (name.includes("monochrome")) return "Monochromes";

  // Wuthering Waves
  if (name.includes("lunite") && !name.includes("subscription")) return "Lunites";
  if (name.includes("lunite subscription") || id.includes("apl")) return "Lunite Subscription";

  // General categories
  if (name.includes("pass") || id.includes("pass")) return "Passes";
  if (name.includes("double") || name.includes("first time") || id.includes("double")) return "Special Offers";
  if (name.includes("uc")) return "UC";
  if (name.includes("token")) return "Tokens";

  return "Other";
}

// Get currency image based on game and package
function getCurrencyImage(gameSlug: string, pkg: Package): string | null {
  // If API provides a logo, use it directly
  if (pkg.logo) {
    return pkg.logo;
  }

  const name = (pkg.name || pkg.description || "").toLowerCase();
  const price = pkg.price || pkg.amount || 0;
  const productId = pkg.productId || "";

  // Time-limited packages have custom images
  if (productId.includes("great-value-pass")) {
    return "https://img.smile.one/media/catalog/product/b/o9/bo9rnpqh5dyqxs01767947124.png";
  }

  // Where Winds Meet - Echo Beads and Battle Passes
  if (gameSlug.toLowerCase().includes("where-winds-meet") || gameSlug.toLowerCase().includes("wwm")) {
    // Extract number from package name (handle commas like "3,000")
    const echoMatch = name.match(/([\d,]+)\s*echo\s*beads?/i);
    const passMatch = name.match(/battle\s*pass|monthly\s*pass/i);

    if (echoMatch) {
      const amount = parseInt(echoMatch[1].replace(/,/g, ''));
      if (amount === 60) return "https://img.smile.one/media/catalog/product/f/1z/f1zpywanlys72sj1761115793.png";
      if (amount === 180) return "https://img.smile.one/media/catalog/product/9/tp/9tp4c3wvm6qwep51761115808.png";
      if (amount === 300) return "https://img.smile.one/media/catalog/product/j/fa/jfa3vjt631210jo1761115860.png";
      if (amount === 600) return "https://img.smile.one/media/catalog/product/4/8m/48m8byvbv4um75l1761115871.png";
      if (amount === 900) return "https://img.smile.one/media/catalog/product/5/ey/5eywqbi96f97rso1761115882.png";
      if (amount === 1800) return "https://img.smile.one/media/catalog/product/l/nq/lnqs4kixvp5wtp41761115893.png";
      if (amount === 3000) return "https://img.smile.one/media/catalog/product/2/t5/2t508uqe12er0vo1761115903.png";
      if (amount === 6000) return "https://img.smile.one/media/catalog/product/w/6o/w6oqifvk6vvk2pu1761115937.png";
      if (amount === 12000) return "https://img.smile.one/media/catalog/product/u/bn/ubndtzhb3ozidn51761115949.png";
    }

    if (passMatch) {
      if (name.includes("monthly")) return "https://img.smile.one/media/catalog/product/q/5z/q5z1e4iot0piaqk1761115976.png";
      if (name.includes("elite")) return "https://img.smile.one/media/catalog/product/y/qm/yqmhd55r5qms9fs1761115988.png";
      if (name.includes("premium")) return "https://img.smile.one/media/catalog/product/a/1d/a1drppilru49r9e1761116002.png";
    }
  }

  // Honor of Kings - use hok.png for all packages
  if (gameSlug.toLowerCase().includes("honor-of-kings") || gameSlug.toLowerCase().includes("hok")) {
    return "/currency/hok.png";
  }

  // Genshin Impact - map by productId
  if (gameSlug.toLowerCase().includes("genshin")) {
    const productId = pkg.productId || "";

    // Chronal Nexus packages
    if (productId.includes("CN")) {
      if (productId.includes("60")) return "/package-icons/Genshin/genshin_chronal_60.png";
      if (productId.includes("1090")) return "/package-icons/Genshin/genshin_chronal_980.png";
      if (productId.includes("2240")) return "/package-icons/Genshin/genshin_chronal_1980.png";
      if (productId.includes("3940")) return "/package-icons/Genshin/genshin_chronal_3280.png";
      if (productId.includes("8080")) return "/package-icons/Genshin/genshin_chronal_6480.png";
    }

    // Genesis Crystals packages
    if (productId.includes("GI60")) return "/package-icons/Genshin/60_Genshin-Impact_Crystals.png";
    if (productId.includes("330") || productId.includes("300")) return "/package-icons/Genshin/300_Genshin-Impact_Crystals.png";
    if (productId.includes("1090") || productId.includes("980")) return "/package-icons/Genshin/980_Genshin-Impact_Crystals.png";
    if (productId.includes("2240") || productId.includes("1980")) return "/package-icons/Genshin/1980_Genshin-Impact_Crystals.png";
    if (productId.includes("3940") || productId.includes("3280")) return "/package-icons/Genshin/3280_Genshin-Impact_Crystals.png";
    if (productId.includes("8080") || productId.includes("6480")) return "/package-icons/Genshin/6480_Genshin-Impact_Crystals.png";

    // All Pack Genesis Crystal
    if (productId.includes("ALL") || name.includes("all pack")) return "/package-icons/Genshin/All Pack Genesis.png";

    // Blessing of Welkin Moon
    if (productId.includes("WELKIN") || name.includes("welkin")) return "/package-icons/Genshin/Welkin.png";
  }

  // Honkai Star Rail - map by productId
  if (gameSlug.toLowerCase().includes("honkai-star-rail") || gameSlug.toLowerCase().includes("hsr")) {
    const productId = pkg.productId || "";

    if (productId.includes("60")) return "/package-icons/HSR/60.png";
    if (productId.includes("300")) return "/package-icons/HSR/300.png";
    if (productId.includes("980")) return "/package-icons/HSR/980.png";
    if (productId.includes("1980")) return "/package-icons/HSR/1980.png";
    if (productId.includes("3280")) return "/package-icons/HSR/3280.png";
    if (productId.includes("6480")) return "/package-icons/HSR/6480.png";

    // Express Supply Pass
    if (productId.includes("RESP") || name.includes("express")) return "/package-icons/HSR/ExpressSupply.png";
  }

  // Zenless Zone Zero - map by productId
  if (gameSlug.toLowerCase().includes("zenless")) {
    const productId = pkg.productId || "";

    if (productId.includes("60")) return "/package-icons/ZZZ/ZZZ-01.png";
    if (productId.includes("330") || productId.includes("300")) return "/package-icons/ZZZ/ZZZ-02.png";
    if (productId.includes("1090") || productId.includes("980")) return "/package-icons/ZZZ/ZZZ-03.png";
    if (productId.includes("2240") || productId.includes("1980")) return "/package-icons/ZZZ/ZZZ-04.png";
    if (productId.includes("3880") || productId.includes("3280")) return "/package-icons/ZZZ/ZZZ-05.png";
    if (productId.includes("8080") || productId.includes("6480")) return "/package-icons/ZZZ/ZZZ-06.png";

    // All Pack Monochrome
    if (productId.includes("ALL") || name.includes("all pack")) return "/package-icons/ZZZ/All Pack Monochrome.png";

    // Inter-Knot Membership
    if (productId.includes("IKM") || name.includes("inter-knot")) return "/package-icons/ZZZ/ZZZ-MonthCard.png";
  }

  // Mobile Legends / MLBB / Moba Legends / SG/MY
  if (gameSlug.toLowerCase().includes("mlbb") ||
    gameSlug.toLowerCase().includes("mobile-legends") ||
    gameSlug.toLowerCase().includes("moba-legends")) {

    // Passes
    if (name.includes("weekly")) return "/currency/weekly-pass.png";
    if (name.includes("twilight") || name.includes("starlight")) {
      if (name.includes("premium")) return "/currency/Premium SL.png";
      return "/currency/Normal Sl.png";
    }

    // Diamonds - categorize by price
    if (name.includes("diamond")) {
      if (price <= 30) return "/currency/small-dias.png";
      if (price <= 100) return "/currency/medium-dias.png";
      if (price <= 250) return "/currency/large-dias.png";
      if (price <= 500) return "/currency/xl-dias.png";
      if (price <= 1000) return "/currency/xxl-dias.png";
      return "/currency/xxxl-dias.png";
    }
  }

  return null;
}

// Clean up package names for better display
function cleanPackageName(name: string, gameSlug: string): string {
  // For SG/MY packages, clean up the "Sgmy Mlbb (14289)" format
  if (gameSlug.toLowerCase().includes("sgmy") || gameSlug.toLowerCase().includes("sg/my")) {
    // Extract the number from parentheses
    const match = name.match(/\((\d+)\)/);
    if (match) {
      const number = match[1];
      // Check if it's a pass
      if (name.toLowerCase().includes("weekly")) {
        return "Weekly Pass";
      }
      if (name.toLowerCase().includes("twilight")) {
        return "Twilight Pass";
      }
      // Return as diamonds
      return `${number} Diamonds`;
    }
  }

  // For Moba Legends, keep original name
  return name;
}

export default function GameDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { user, isAuthenticated, openAuthModal } = useUserAuth();

  // Unwrap params Promise as per Next.js 15 requirements
  const unwrappedParams = React.use(params);
  // Accept the parameter (keeping slug name for Next.js routing compatibility)
  const gameId = unwrappedParams.slug;

  const [game, setGame] = useState<any>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [validationHistory, setValidationHistory] = useState<GameValidationHistoryEntry[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "wallet">("upi");

  const [userId, setUserId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [serverRegion, setServerRegion] = useState(""); // For Genshin Impact

  // Auto-parse player ID format: "750408293 (8985)" -> User ID: 750408293, Zone ID: 8985
  const handleUserIdChange = (value: string) => {
    const pastePattern = /^(\d+)\s*\((\d+)\)$/;
    const match = value.match(pastePattern);

    if (match) {
      // Auto-parse detected (silent)
      const [, playerId, zone] = match;
      setUserId(playerId);
      setZoneId(zone);
    } else {
      // Normal input
      setUserId(value);
    }
  };

  const [isProcessing, setIsProcessing] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [regionVerification, setRegionVerification] = useState<RegionVerification | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Saved Accounts
  const [savedAccounts, setSavedAccounts] = useState<SavedPlayerAccount[]>([]);
  const [loadingSavedAccounts, setLoadingSavedAccounts] = useState(false);
  const [savingAccount, setSavingAccount] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [showUidHelper, setShowUidHelper] = useState(false);

  useEffect(() => {
    fetchGameDetails();

    // Check for URL parameters (userId, zoneId, ign) from redirect
    const urlParams = new URLSearchParams(window.location.search);
    const urlUserId = urlParams.get('userId');
    const urlZoneId = urlParams.get('zoneId');
    const urlIgn = urlParams.get('ign');
    const urlPackage = urlParams.get('package'); // Get package ID from URL

    if (urlUserId && urlZoneId) {
      setUserId(urlUserId);
      setZoneId(urlZoneId);

      // Auto-verify if we have all the data
      if (urlIgn) {
        setRegionVerification({
          userId: urlUserId,
          zoneId: urlZoneId,
          ign: decodeURIComponent(urlIgn),
          verified: true,
          detectedRegion: gameId.includes('php') ? 'Philippines' :
            gameId.includes('indo') ? 'Indonesia' :
              gameId.includes('sgmy') ? 'Singapore/Malaysia' : 'Unknown',
          isCorrectRegion: true,
        });
        toast.success(`Account verified! Welcome ${decodeURIComponent(urlIgn)}!`);
      }
    }

    // Store package ID to select after packages load
    if (urlPackage) {
      // We'll use it in another useEffect when packages are loaded
      (window as any).__preselectedPackage = urlPackage;
    }
  }, [gameId]);

  // Load saved accounts when authenticated
  useEffect(() => {
    if (isAuthenticated && gameId) {
      loadSavedAccounts();
    }
  }, [isAuthenticated, gameId]);

  // Auto-select package from URL parameter when packages load
  useEffect(() => {
    if (packages.length > 0 && (window as any).__preselectedPackage) {
      const packageId = (window as any).__preselectedPackage;
      console.log("Looking for package:", packageId);
      console.log("Available packages:", packages.map(p => p.productId));

      const foundPackage = packages.find(pkg => pkg.productId === packageId);

      if (foundPackage) {
        console.log("Found package:", foundPackage);
        setSelectedPackage(foundPackage);
        // Scroll to packages section
        setTimeout(() => {
          const packagesSection = document.getElementById('packages-section');
          if (packagesSection) {
            packagesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 500);
        toast.success(`Selected: ${foundPackage.name}`);
      } else {
        console.log("Package not found!");
      }

      // Clear the flag
      delete (window as any).__preselectedPackage;
    }
  }, [packages]);

  const loadSavedAccounts = async () => {
    if (!isAuthenticated) return; // Don't try if not authenticated

    setLoadingSavedAccounts(true);
    try {
      const result = await getSavedPlayerAccounts(game?._id || gameId);
      if (result.success) {
        setSavedAccounts(result.data);
      }
    } catch (error: any) {
      // Silently fail - don't show errors for loading saved accounts
    } finally {
      setLoadingSavedAccounts(false);
    }
  };

  const handleSaveAccount = async (account?: RegionVerification) => {
    const accountToSave = account || regionVerification;
    if (!accountToSave?.verified) {
      return;
    }

    setSavingAccount(true);
    try {
      const result = await savePlayerAccount({
        gameSlug: game?.slug || '',
        playerId: accountToSave.userId,
        zoneId: accountToSave.zoneId,
        ign: accountToSave.ign,
        region: accountToSave.detectedRegion,
      });

      if (result.success) {
        await loadSavedAccounts(); // Refresh the list
      }
    } catch (error: any) {
      console.error('❌ Save failed:', error.message);
      // Silently fail - user doesn't need to know about save errors
    } finally {
      setSavingAccount(false);
    }
  };

  const handleSelectSavedAccount = (account: SavedPlayerAccount) => {
    setUserId(account.playerId);
    setZoneId(account.zoneId || '');
    setRegionVerification({
      userId: account.playerId,
      zoneId: account.zoneId || '',
      ign: account.ign,
      verified: true,
      detectedRegion: account.region,
      isCorrectRegion: true,
    });
    toast.success(`Loaded account: ${account.ign}`);
  };

  const handleDeleteSavedAccount = async (accountId: string) => {
    setAccountToDelete(accountId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteAccount = async () => {
    if (!accountToDelete) return;

    try {
      await deletePlayerAccount(accountToDelete);
      toast.success('Account deleted');
      await loadSavedAccounts(); // Refresh the list
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete account');
    } finally {
      setDeleteDialogOpen(false);
      setAccountToDelete(null);
    }
  };

  const fetchGameDetails = async () => {
    try {
      setLoading(true);

      // Fetch game info from games-data (which now pulls from API with cache)
      // Fetch game by ID and its validation history
      const { getGameById } = await import("@/lib/games-data");
      const gameData = await getGameById(gameId);

      if (!gameData) {
        console.error("Game not found for ID:", gameId);
        setPackages([]);
        return;
      }

      setGame(gameData);

      // At this point we know gameData._id exists (checked above)
      setLoadingHistory(true);
      try {
        const history = await getGameValidationHistory(gameData._id!);
        setValidationHistory(history);
      } catch (e) {
        // Swallow errors – history is optional UI
        console.error("Failed to load validation history:", e);
      } finally {
        setLoadingHistory(false);
      }

      // Check if we have a game ID
      if (!gameData._id) {
        console.error("Game ID not found for:", gameId);
        setPackages([]);
        return;
      }

      // Fetch packages using the new diamond-packs API
      const data = await getGamePackages(gameData._id);

      if (!data.success) {
        console.error("Failed to fetch packages");
        setPackages([]);
        return;
      }

      // Filter packages: only show active packages
      let filteredPackages = data.diamondPacks.filter((pkg: Package) => pkg.status === 'active');

      // Add time-limited packages if game matches and package is active
      const timeLimitedPackagesToAdd: Package[] = [];
      Object.entries(TIME_LIMITED_PACKAGES).forEach(([packageId, pkgData]) => {
        if (pkgData.games.includes(gameData.slug) && isTimeLimitedPackageActive(packageId)) {
          // Check if package not already in the list
          const exists = filteredPackages.some((p: Package) => p.productId === packageId);
          if (!exists) {
            timeLimitedPackagesToAdd.push({
              _id: pkgData.id,
              game: gameData._id,
              amount: pkgData.price,
              commission: 0,
              cashback: 0,
              logo: pkgData.imageUrl,
              description: pkgData.description,
              status: 'active',
              category: 'Time Limited',
              productId: pkgData.id,
              name: pkgData.name,
              price: pkgData.price,
              currency: "INR",
              stock: "in-stock" as const,
              region: "Global",
            });
          }
        }
      });

      // Prepend time-limited packages to the beginning (featured at top)
      filteredPackages = [...timeLimitedPackagesToAdd, ...filteredPackages];

      setPackages(filteredPackages);
    } catch (error) {
      console.error("Failed to fetch game details:", error);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAccount = async () => {
    if (!userId || !zoneId) {
      toast.error("Please enter both User ID and Zone ID");
      return;
    }

    setVerifying(true);
    try {
      // Call backend API directly to verify player details using the new validate-user endpoint
      const response = await fetch(buildAPIURL("/api/v1/games/validate-user"), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Use backend game code from helper (e.g. "MOBILE_LEGENDS_PRO"), not the public slug
          game: game ? getBackendGameCode(game) : '',
          gameId: game?._id || gameId,
          playerId: userId,
          server: zoneId,
        }),
      });

      const data = await response.json();

      // Support both legacy { success, data: { valid, ... } } and new { valid, ... } shapes
      const result = data.data ?? data;

      // If API explicitly reports invalid, treat as failure
      if (result.valid === false) {
        throw new Error(result.msg || data.message || 'Verification failed');
      }

      // If API has a top-level success=false and no explicit valid=true, also treat as failure
      if (data.success === false && result.valid !== true) {
        throw new Error(data.message || 'Verification failed');
      }

      const detectedRegion = (result.region || result.server || '').toLowerCase() || 'unknown';

      // Check if account is from Philippines, Indonesia, Singapore, or Malaysia
      // Only redirect if NOT already on the correct regional page
      if (detectedRegion === 'philippines' || detectedRegion === 'ph') {
        // Check if already on Philippines page
        if (game?.slug !== 'mobile-legends-php' && !game?.slug.includes('php')) {
          toast.error('Philippines Account Detected! This region has different packs. Redirecting...');
          setTimeout(() => {
            router.push(`/games/mobile-legends-php?userId=${userId}&zoneId=${zoneId}&ign=${encodeURIComponent(result.ign || result.username || '')}`);
          }, 2000);
          return;
        }
      }

      if (detectedRegion === 'indonesia' || detectedRegion === 'indo' || detectedRegion === 'id') {
        // Check if already on Indonesia page
        if (game?.slug !== 'mobile-legends-indo' && !game?.slug.includes('indo')) {
          toast.error('Indonesia Account Detected! This region has different packs. Redirecting...');
          setTimeout(() => {
            router.push(`/games/mobile-legends-indo?userId=${userId}&zoneId=${zoneId}&ign=${encodeURIComponent(result.ign || result.username || '')}`);
          }, 2000);
          return;
        }
      }

      if (detectedRegion === 'singapore' || detectedRegion === 'sg' || detectedRegion === 'malaysia' || detectedRegion === 'my' || detectedRegion === 'sgmy') {
        // Check if already on Singapore/Malaysia page
        if (game?.slug !== 'mobile-legends-sgmy' && !game?.slug.includes('sgmy')) {
          toast.error('Singapore/Malaysia Account Detected! This region has different packs. Redirecting...');
          setTimeout(() => {
            router.push(`/games/mobile-legends-sgmy?userId=${userId}&zoneId=${zoneId}&ign=${encodeURIComponent(result.ign || result.username || '')}`);
          }, 2000);
          return;
        }
      }

      // Verification successful
      const verifiedAccount = {
        userId: userId,
        zoneId: zoneId,
        ign: result.ign || result.username || result.name || `Player_${userId}`,
        verified: true,
        detectedRegion: result.region || result.server || detectedRegion,
        isCorrectRegion: true,
      };
      setRegionVerification(verifiedAccount);
      toast.success(`Account verified! Welcome ${verifiedAccount.ign}!`);

      // Auto-save account after verification
      if (isAuthenticated && user) {
        handleSaveAccount(verifiedAccount).catch(() => { });
      }
    } catch (error: any) {
      console.error('❌ Verification error:', error);
      toast.error(error.message || "Failed to verify account. Please check your User ID and Zone ID.");
    } finally {
      setVerifying(false);
    }
  };

  const handlePurchase = async () => {
    // Check maintenance mode
    if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true') {
      toast.error("🚧 Purchases are temporarily disabled for maintenance. Please try again later.");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please login to continue");
      // Scroll to login section
      const orderSection = document.getElementById('order-section');
      orderSection?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (!game || !selectedPackage) {
      toast.error("Please select a package");
      return;
    }

    // If wallet is selected, make sure user has enough balance
    if (paymentMethod === "wallet") {
      const walletBalance = (user as any)?.walletBalance ?? 0;
      if (walletBalance < selectedPackage.price) {
        toast.error("Insufficient wallet balance for this order");
        return;
      }
    }

    // Determine game type
    const isMLBB = game.slug.toLowerCase().includes("mlbb") ||
      game.slug.toLowerCase().includes("mobile-legends") ||
      game.slug.toLowerCase().includes("moba-legends");
    const isHOK = game.slug.toLowerCase().includes("honor-of-kings") ||
      game.slug.toLowerCase().includes("hok");
    const isGenshin = game.slug.toLowerCase().includes("genshin");
    const isWutheringWaves = game.slug.toLowerCase().includes("wuthering-waves");
    const isZenless = game.slug.toLowerCase().includes("zenless-zone-zero");
    const isHonkaiStar = game.slug.toLowerCase().includes("honkai-star-rail");
    const requiresServer = isGenshin || isWutheringWaves || isZenless || isHonkaiStar;

    // Validation based on game type
    if (isMLBB) {
      // MLBB requires verification first
      if (!regionVerification?.verified) {
        toast.error("Please verify your game account first");
        // Scroll to order section
        const orderSection = document.getElementById('order-section');
        orderSection?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    } else if (requiresServer) {
      // Games requiring server region (Genshin, Wuthering Waves, Zenless, Honkai Star Rail)
      if (!userId || !serverRegion) {
        toast.error("Please enter your User ID and select Server Region");
        const orderSection = document.getElementById('order-section');
        orderSection?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    } else {
      // All other games (including HOK) require at least User ID
      if (!userId) {
        toast.error("Please enter your User ID");
        const orderSection = document.getElementById('order-section');
        orderSection?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }

    setIsProcessing(true);

    try {
      // Wallet flow: call dedicated diamond-pack wallet endpoint
      if (paymentMethod === "wallet") {
        try {
          if (typeof window === "undefined") {
            throw new Error("Wallet payment is only available in the browser");
          }

          const token = window.localStorage.getItem("user_token") || undefined;
          if (!token) {
            throw new Error("No authentication token found");
          }

          const payload: any = {
            diamondPackId:
              selectedPackage.productId || (selectedPackage as any)._id,
            playerId: regionVerification?.userId || userId,
            server: regionVerification?.zoneId || zoneId || serverRegion || "",
            quantity: 1,
          };

          const response = await fetch(
            buildAPIURL("/api/v1/order/diamond-pack"),
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(payload),
            }
          );

          const data = await response.json();

          if (!response.ok || !data?.success) {
            throw new Error(
              data?.message || "Failed to process wallet order"
            );
          }

          toast.success("Order processed successfully with wallet!");
          router.push("/orders");
        } catch (walletError: any) {
          toast.error(
            walletError?.message ||
              "Failed to process wallet payment. Please contact support."
          );
        } finally {
          setIsProcessing(false);
        }
        return;
      }

      // UPI flow: use Onetopup diamond-pack-upi endpoint
      if (paymentMethod === "upi") {
        try {
          if (typeof window === "undefined") {
            throw new Error("UPI payment is only available in the browser");
          }

          const token = window.localStorage.getItem("user_token") || undefined;
          if (!token) {
            throw new Error("No authentication token found");
          }

          const payload: any = {
            diamondPackId:
              selectedPackage.productId || (selectedPackage as any)._id,
            playerId: regionVerification?.userId || userId,
            server: regionVerification?.zoneId || zoneId || serverRegion || "",
            quantity: 1,
            redirectUrl: `${window.location.origin}/order-status`,
          };

          const response = await fetch(
            buildAPIURL("/api/v1/order/diamond-pack-upi"),
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(payload),
            }
          );

          const data = await response.json();

          if (!response.ok || !data?.success) {
            throw new Error(
              data?.message || "Failed to create UPI order"
            );
          }

          const paymentUrl =
            data.transaction?.paymentUrl ||
            data.data?.transaction?.paymentUrl ||
            data.data?.paymentUrl;

          if (paymentUrl) {
            window.location.href = paymentUrl;
          } else {
            // Fallback: go to order-status page
            router.push("/order-status");
          }
        } catch (upiError: any) {
          toast.error(
            upiError?.message ||
              "Failed to initiate UPI payment. Please contact support."
          );
          setIsProcessing(false);
        }
        return;
      }
    } catch (error: any) {

      // Hide internal errors (like reseller balance) from customers
      const errorMessage = error?.message?.includes('reseller balance') || error?.message?.includes('insufficient balance')
        ? "Unable to process this order right now. Please contact our support team for instant assistance!"
        : (error?.message || "Failed to create order. Please contact support.");

      toast.error(errorMessage);

      setIsProcessing(false);
    }
    // Note: Don't set isProcessing to false when redirecting to payment page
  };

  if (loading) {
    return <GameDetailSkeleton />;
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-goblin-bg flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-goblin-muted mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-goblin-fg mb-4">Game not found</h2>
          <Link href="/games">
            <Button className="bg-goblin-green hover:bg-goblin-green/90 text-black font-semibold">
              Back to Games
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Group packages by category
  const categorizedPackages = packages.reduce((acc, pkg) => {
    const category = categorizePackage(pkg);
    if (!acc[category]) acc[category] = [];
    acc[category].push(pkg);
    return acc;
  }, {} as Record<string, Package[]>);

  // Sort packages within each category by price, but keep time-limited first
  Object.keys(categorizedPackages).forEach(category => {
    categorizedPackages[category].sort((a, b) => {
      const aIsTimeLimited = a.productId && Object.keys(TIME_LIMITED_PACKAGES).includes(a.productId);
      const bIsTimeLimited = b.productId && Object.keys(TIME_LIMITED_PACKAGES).includes(b.productId);

      // Time-limited packages always come first
      if (aIsTimeLimited && !bIsTimeLimited) return -1;
      if (!aIsTimeLimited && bIsTimeLimited) return 1;

      // Otherwise sort by price
      return a.price - b.price;
    });
  });

  const categories = ["All", ...Object.keys(categorizedPackages)];
  const displayPackages = selectedCategory === "All"
    ? packages.sort((a, b) => {
      const aIsTimeLimited = a.productId && Object.keys(TIME_LIMITED_PACKAGES).includes(a.productId);
      const bIsTimeLimited = b.productId && Object.keys(TIME_LIMITED_PACKAGES).includes(b.productId);

      // Time-limited packages always come first
      if (aIsTimeLimited && !bIsTimeLimited) return -1;
      if (!aIsTimeLimited && bIsTimeLimited) return 1;

      // Otherwise sort by price
      return a.price - b.price;
    })
    : categorizedPackages[selectedCategory] || [];

  const isMLBB = game.slug.toLowerCase().includes("mlbb") ||
    game.slug.toLowerCase().includes("mobile-legends") ||
    game.slug.toLowerCase().includes("moba-legends");

  const isHOK = game.slug.toLowerCase().includes("honor-of-kings") ||
    game.slug.toLowerCase().includes("hok");

  const isGenshin = game.slug.toLowerCase().includes("genshin");

  // Get icon for category
  const getCategoryIcon = (category: string) => {
    if (category === "Time Limited") return <IoMdFlash className="w-4 h-4" />;
    if (category === "Diamonds") return <FaGem className="w-4 h-4" />;
    if (category === "Genesis Crystals" || category === "Crystals") return <FaGem className="w-4 h-4" />;
    if (category === "Chronal Nexus") return <FaGem className="w-4 h-4" />;
    if (category === "Monochromes") return <FaGem className="w-4 h-4" />;
    if (category === "Oneiric Shards") return <FaGem className="w-4 h-4" />;
    if (category === "Lunites") return <FaGem className="w-4 h-4" />;
    if (category === "Tokens") return <FaCoins className="w-4 h-4" />;
    if (category === "UC") return <FaCoins className="w-4 h-4" />;
    if (category.includes("Pass") || category.includes("Subscription") || category.includes("Membership") || category.includes("Welkin")) return <FaCalendarAlt className="w-4 h-4" />;
    if (category === "Special Offers") return <FaStar className="w-4 h-4" />;
    return <FaCircle className="w-3 h-3" />;
  };

  return (
    <div className="min-h-screen bg-goblin-bg pb-20">
      {/* Maintenance Mode Banner */}
      {process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true' && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/30 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-center gap-2 text-yellow-500">
              <AlertCircle className="w-5 h-5" />
              <p className="font-semibold">🚧 Maintenance Mode: Purchases are temporarily disabled</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-goblin-bg-card/50 border-b border-goblin-border backdrop-blur-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/games"
            className="inline-flex items-center gap-2 text-goblin-muted hover:text-goblin-green transition-colors font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Games</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Time-Limited Offer Banner */}
        {Object.entries(TIME_LIMITED_PACKAGES).some(([packageId, pkgData]) =>
          pkgData.games.includes(game?.slug || '') && isTimeLimitedPackageActive(packageId)
        ) && (
            <div className="mb-6 bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <h3 className="text-amber-200 font-bold text-base mb-1">
                    Limited Time Offer
                  </h3>
                  <p className="text-amber-300/60 text-sm">
                    Ends {new Date(Object.values(TIME_LIMITED_PACKAGES)[0].endTime).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      timeZone: 'Asia/Kolkata'
                    })} • {Object.entries(TIME_LIMITED_PACKAGES)
                      .filter(([id, pkg]) => pkg.games.includes(game?.slug || '') && isTimeLimitedPackageActive(id))
                      .map(([id]) => getTimeRemaining(id))
                      .join(', ')}
                  </p>
                </div>
              </div>
            </div>
          )}

        {/* Game Header */}
        <div className="mb-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-goblin-bg-card flex-shrink-0 shadow-lg ring-2 ring-goblin-border">
              <Image
                src={game.icon || "/game-placeholder.svg"}
                alt={game.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-goblin-fg mb-2 tracking-tight">
                {game.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-full bg-goblin-green/10 border border-goblin-green/30 text-goblin-green text-xs sm:text-sm font-semibold">
                  Instant Delivery
                </span>
                <span className="hidden sm:inline text-goblin-muted text-sm">•</span>
                <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-full bg-goblin-accent/10 border border-goblin-accent/30 text-goblin-accent text-xs sm:text-sm font-semibold">
                  Secure Payment
                </span>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-goblin-bg-alt [&::-webkit-scrollbar-thumb]:bg-goblin-border [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-goblin-green/50">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "bg-goblin-green text-black px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-all whitespace-nowrap"
                    : "bg-goblin-bg-card border border-goblin-border text-goblin-muted hover:text-goblin-fg hover:border-goblin-green/50 px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all whitespace-nowrap"
                }
              >
                {getCategoryIcon(category)}
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Packages Grid */}
          <div id="packages-section" className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-goblin-fg mb-4 flex items-center gap-2">
                <GiSparkles className="w-6 h-6 text-goblin-green" />
                Select Package
              </h2>

              {displayPackages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {displayPackages.map((pkg, index) => {
                    // Use a composite key since productId might be undefined
                    const pkgKey = pkg.productId || `${pkg.name}-${pkg.price}`;
                    const selectedKey = selectedPackage?.productId || (selectedPackage ? `${selectedPackage.name}-${selectedPackage.price}` : null);
                    const isSelected = selectedKey !== null && pkgKey === selectedKey;
                    const currencyImg = getCurrencyImage(game?.slug || '', pkg);
                    const isTimeLimited = pkg.productId && Object.keys(TIME_LIMITED_PACKAGES).includes(pkg.productId);
                    const timeRemaining = isTimeLimited ? getTimeRemaining(pkg.productId!) : null;

                    return (
                      <button
                        key={`${pkgKey}-${index}`}
                        onClick={() => {
                          setSelectedPackage(pkg);
                        }}
                        className={`group relative p-3 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${isSelected
                          ? "bg-goblin-green/10 border-2 border-goblin-green shadow-lg shadow-goblin-green/20"
                          : isTimeLimited
                            ? "bg-amber-500/5 border-2 border-amber-500/30 hover:border-amber-500/50 shadow-md"
                            : "bg-goblin-bg-card border border-goblin-border hover:border-goblin-green/50 hover:shadow-md"
                          }`}
                      >
                        {/* Time Limited Badge */}
                        {isTimeLimited && (
                          <div className="absolute -top-2 -left-2 px-2.5 py-0.5 bg-amber-500/90 backdrop-blur-sm rounded-full shadow-md z-10">
                            <span className="text-[9px] font-bold text-amber-950 uppercase tracking-wider">Limited</span>
                          </div>
                        )}

                        {/* Selected Indicator */}
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 w-7 h-7 bg-goblin-green rounded-full flex items-center justify-center shadow-lg z-10">
                            <FaCheckCircle className="text-black w-4 h-4" />
                          </div>
                        )}

                        <div className="flex flex-col h-full gap-2">
                          {/* Currency Image */}
                          {currencyImg && (
                            <div className="flex justify-center py-2">
                              <div className={`relative w-12 h-12 transition-transform group-hover:scale-110 ${pkg.name.toLowerCase().includes('all pack') || isTimeLimited ? 'scale-125' : ''
                                }`}>
                                <Image
                                  src={currencyImg}
                                  alt={pkg.name}
                                  fill
                                  className="object-contain drop-shadow-md"
                                />
                              </div>
                            </div>
                          )}

                          {/* Package Name */}
                          <div className="font-bold text-sm line-clamp-2 leading-tight text-goblin-fg text-center min-h-[2.5rem] flex items-center justify-center">
                            {cleanPackageName(pkg.name || pkg.description || "", game?.slug || "")}
                          </div>

                          {/* Time Remaining (for time-limited packages) */}
                          {isTimeLimited && timeRemaining && (
                            <div className="flex items-center justify-center px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-md">
                              <span className="text-[10px] font-semibold text-amber-300/80">{timeRemaining}</span>
                            </div>
                          )}

                          {/* Price */}
                          <div className="mt-auto pt-2 border-t border-goblin-border/50">
                            <div className="text-center">
                              <div className={`text-xl font-bold ${isTimeLimited ? 'text-amber-400' : 'text-goblin-green'}`}>
                                ₹{pkg.price.toLocaleString('en-IN')}
                              </div>
                              <div className="text-[10px] text-goblin-muted/80 mt-0.5">
                                {isTimeLimited ? 'Limited' : 'Instant'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-goblin-bg-card/30 border border-goblin-border rounded-2xl p-12 text-center">
                  <AlertCircle className="w-12 h-12 text-goblin-muted mx-auto mb-3" />
                  <p className="text-goblin-muted font-medium">No packages in this category</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Form */}
          <div className="lg:col-span-1">
            <div id="order-section" className="bg-goblin-bg-card border border-goblin-border rounded-xl shadow-lg sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-hide">
              <div className="p-4">
                <h2 className="text-base font-bold text-goblin-fg mb-3 flex items-center gap-2 pb-2 border-b border-goblin-border">
                  <ShoppingCart className="w-5 h-5 text-goblin-green" />
                  Order Details
                </h2>

                {!isAuthenticated && (
                  <div className="mb-3 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-xl p-3 shadow-md">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-yellow-300 text-xs font-bold mb-0.5">Login Required</p>
                        <p className="text-yellow-400/80 text-[10px] mb-2">Please login to continue with your purchase</p>
                        <Button
                          onClick={openAuthModal}
                          size="sm"
                          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg shadow-lg shadow-yellow-500/20"
                        >
                          Login with Phone
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Saved Accounts (when authenticated and has verification) */}
                {isAuthenticated && savedAccounts.length > 0 && !regionVerification?.verified && (
                  <div className="mb-3">
                    <div className="bg-goblin-bg-alt border border-goblin-border rounded-lg p-3">
                      <h3 className="font-semibold text-sm text-goblin-fg mb-2 flex items-center gap-1.5">
                        <FaStar className="w-4 h-4 text-goblin-green" />
                        Quick Select Saved Accounts
                      </h3>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {savedAccounts.map((account) => (
                          <div
                            key={account._id}
                            className="w-full bg-goblin-bg/50 hover:bg-goblin-green/10 border border-goblin-border hover:border-goblin-green/50 rounded-lg p-3 transition-all cursor-pointer"
                            onClick={() => handleSelectSavedAccount(account)}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-goblin-fg font-semibold text-sm truncate">{account.ign}</p>
                                <p className="text-goblin-muted text-xs mt-0.5">
                                  {account.playerId} ({account.zoneId})
                                </p>
                                {account.region && (
                                  <p className="text-goblin-muted text-xs mt-0.5">{account.region}</p>
                                )}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSavedAccount(account._id);
                                }}
                                className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded hover:bg-red-500/10 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {isMLBB && (
                  <div className="space-y-3 mb-4">
                    <div className="bg-goblin-bg-alt border border-goblin-border rounded-lg p-3">
                      <h3 className="font-semibold text-sm text-goblin-fg mb-2 flex items-center gap-1.5">
                        <FaShieldAlt className="w-4 h-4 text-goblin-green" />
                        Verify Game Account
                      </h3>

                      <div className="space-y-2">
                        <div>
                          <Label className="text-goblin-fg text-xs mb-1 block font-medium">User ID *</Label>
                          <Input
                            placeholder="Enter User ID"
                            value={userId}
                            onChange={(e) => {
                              handleUserIdChange(e.target.value);
                              setRegionVerification(null);
                            }}
                            disabled={regionVerification?.verified}
                            className="bg-goblin-bg/50 border-goblin-border text-goblin-fg placeholder:text-goblin-muted focus:border-goblin-green rounded-lg backdrop-blur-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-goblin-fg text-xs mb-1 block font-medium">Zone ID *</Label>
                          <Input
                            placeholder="1234"
                            value={zoneId}
                            onChange={(e) => {
                              setZoneId(e.target.value);
                              setRegionVerification(null);
                            }}
                            disabled={regionVerification?.verified}
                            className="bg-goblin-bg/50 border-goblin-border text-goblin-fg placeholder:text-goblin-muted focus:border-goblin-green rounded-lg backdrop-blur-sm"
                          />
                        </div>

                        {!regionVerification?.verified ? (
                          <Button
                            onClick={handleVerifyAccount}
                            disabled={!userId || !zoneId || verifying}
                            className="w-full bg-goblin-green hover:bg-goblin-green/90 text-black font-semibold rounded-lg"
                          >
                            {verifying ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Verifying...
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Verify Account
                              </>
                            )}
                          </Button>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-2.5 shadow-sm">
                              <div className="flex items-start gap-2">
                                <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-emerald-300 font-bold text-xs mb-1">Account Verified!</p>
                                  <p className="text-emerald-400 text-[10px] truncate font-semibold">{regionVerification.ign}</p>
                                  <p className="text-emerald-400/70 text-[10px] mt-0.5 font-mono">
                                    {regionVerification.userId} ({regionVerification.zoneId})
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Method Selection */}
                {selectedPackage && (
                  <div className="mb-3">
                    <h3 className="text-xs font-semibold text-goblin-fg mb-1.5 uppercase tracking-wide">
                      Payment Method
                    </h3>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("upi")}
                        className={
                          "flex-1 px-3 py-2 rounded-lg text-xs font-semibold border transition-all " +
                          (paymentMethod === "upi"
                            ? "bg-goblin-green text-black border-goblin-green"
                            : "bg-goblin-bg border-goblin-border text-goblin-muted hover:border-goblin-green/60 hover:text-goblin-fg")
                        }
                      >
                        UPI
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("wallet")}
                        disabled={!user}
                        className={
                          "flex-1 px-3 py-2 rounded-lg text-xs font-semibold border transition-all " +
                          (paymentMethod === "wallet"
                            ? "bg-goblin-green text-black border-goblin-green"
                            : "bg-goblin-bg border-goblin-border text-goblin-muted hover:border-goblin-green/60 hover:text-goblin-fg") +
                          (!user ? " opacity-50 cursor-not-allowed" : "")
                        }
                      >
                        Wallet
                      </button>
                    </div>
                    {user && (
                      <p className="mt-1 text-[11px] text-goblin-muted">
                        Wallet Balance:{" "}
                        <span className="font-semibold text-goblin-fg">
                          ₹{(((user as any).walletBalance ?? 0) as number).toLocaleString("en-IN")}
                        </span>
                      </p>
                    )}
                  </div>
                )}

                {/* Recent validation history for this game (optional helper) */}
                {validationHistory.length > 0 && (
                  <div className="mb-4">
                    <div className="bg-goblin-bg-alt border border-goblin-border rounded-lg p-3">
                      <h3 className="font-semibold text-sm text-goblin-fg mb-2 flex items-center gap-1.5">
                        <FaClock className="w-4 h-4 text-goblin-green" />
                        Recent Verified Players
                      </h3>
                      <div className="space-y-1.5 max-h-40 overflow-y-auto">
                        {validationHistory.slice(0, 5).map((entry) => {
                          const displayName =
                            entry.playerName && entry.playerName.trim() !== ""
                              ? decodeURIComponent(entry.playerName ?? "")
                              : `Player ${entry.playerId}`;

                          return (
                            <button
                              key={entry._id}
                              type="button"
                              onClick={() => {
                                // When user clicks a recent verification, pre-fill and mark as verified
                                setUserId(entry.playerId);
                                setZoneId(entry.server || "");
                                setRegionVerification({
                                  userId: entry.playerId,
                                  zoneId: entry.server || "",
                                  ign: displayName,
                                  verified: true,
                                  detectedRegion: undefined,
                                  isCorrectRegion: true,
                                });
                              }}
                              className="w-full flex items-center justify-between text-[11px] text-goblin-muted bg-goblin-bg/60 border border-goblin-border/60 rounded-md px-2 py-1 hover:border-goblin-green/60 hover:bg-goblin-bg-alt transition-colors cursor-pointer"
                            >
                              <div className="flex flex-col text-left">
                                <span className="font-semibold text-goblin-fg">
                                  {displayName}
                                </span>
                                <span className="font-mono text-[10px]">
                                  ID: {entry.playerId} • Server: {entry.server}
                                </span>
                              </div>
                              <span className="text-[9px]">
                                {new Date(entry.timestamp).toLocaleDateString(
                                  "en-IN",
                                  {
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* For Other Games (HOK, Genshin, etc.) - Simple User ID input */}
                {!isMLBB && (
                  <div className="space-y-3 mb-4">
                    <div className="bg-goblin-bg-alt border border-goblin-border rounded-lg p-3">
                      <h3 className="font-semibold text-sm text-goblin-fg mb-2 flex items-center gap-1.5">
                        <User className="w-4 h-4 text-goblin-green" />
                        Game Account Details
                      </h3>

                      <div className="space-y-3">
                        <div>
                          <Label className="text-goblin-fg text-sm mb-1.5 block font-medium flex items-center gap-2">
                            User ID *
                            {game.uidHelperImage && (
                              <button
                                type="button"
                                onClick={() => setShowUidHelper(true)}
                                className="text-goblin-green hover:text-goblin-green/80 transition-colors"
                                title="How to find your UID"
                              >
                                <HelpCircle className="w-4 h-4" />
                              </button>
                            )}
                          </Label>
                          <Input
                            placeholder={isGenshin ? "Enter your UID" : isHOK ? "Enter your Role ID" : "Enter your User ID"}
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="bg-goblin-bg/50 border-goblin-border text-goblin-fg placeholder:text-goblin-muted focus:border-goblin-green rounded-lg backdrop-blur-sm"
                          />
                        </div>

                        {/* Genshin Impact - Server Region Selection */}
                        {isGenshin && (
                          <div>
                            <Label className="text-goblin-fg text-sm mb-1.5 block font-medium">
                              Server Region *
                            </Label>
                            <select
                              value={serverRegion}
                              onChange={(e) => setServerRegion(e.target.value)}
                              className="w-full h-10 bg-goblin-bg/50 border border-goblin-border text-goblin-fg rounded-lg px-3 py-2 focus:border-goblin-green focus:outline-none focus:ring-2 focus:ring-goblin-green/20 backdrop-blur-sm transition-colors appearance-none cursor-pointer"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                                backgroundPosition: 'right 0.5rem center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: '1.5em 1.5em',
                                paddingRight: '2.5rem'
                              }}
                            >
                              <option value="">Select Server</option>
                              <option value="America">America</option>
                              <option value="Europe">Europe</option>
                              <option value="Asia">Asia</option>
                              <option value="TW_HK_MO">TW, HK, MO</option>
                            </select>
                          </div>
                        )}

                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                          <p className="text-blue-300 text-xs flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>
                              Make sure your {isGenshin ? "UID" : isHOK ? "Role ID" : "User ID"} is correct.
                              {isGenshin && " Select the correct server region."}
                              {" "}The order will be processed automatically.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedPackage && (
                  <div className="bg-gradient-to-br from-goblin-green/5 to-goblin-green/10 border border-goblin-green/30 rounded-xl p-3 mb-3 shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-goblin-muted text-xs font-semibold uppercase tracking-wider">
                        Selected
                      </span>
                      <span className="text-goblin-green text-xs font-semibold px-2 py-1 rounded-md bg-goblin-green/10">
                        Ready
                      </span>
                    </div>
                    <p className="text-goblin-fg font-bold text-sm mb-2">{selectedPackage.name}</p>
                    {/* Total Price */}
                    <div className="mt-2 pt-2 border-t border-goblin-green/20 bg-goblin-green/5 -mx-3 px-3 -mb-3 pb-3 rounded-b-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-goblin-muted text-xs font-semibold">Total Amount</span>
                        <span className="text-xl font-bold text-goblin-green">
                          ₹{selectedPackage.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Button
                    onClick={handlePurchase}
                    disabled={isProcessing || !selectedPackage}
                    className="w-full bg-goblin-green hover:bg-goblin-green/90 text-black font-bold py-3 text-sm rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all lg:flex hidden items-center justify-center shadow-lg shadow-goblin-green/20 hover:shadow-xl hover:shadow-goblin-green/30"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Order Now
                      </>
                    )}
                  </Button>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-goblin-muted text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3 h-3 text-goblin-green" />
                    <span>Secure</span>
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <span>Instant Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Button - Shows when package selected, only on mobile */}
      {selectedPackage && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-goblin-bg-card/95 backdrop-blur-lg border-t border-goblin-border p-3 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-goblin-muted truncate">Selected</p>
              <p className="text-sm font-bold text-goblin-fg truncate">{selectedPackage.name}</p>
              <p className="text-base font-bold text-goblin-green">₹{selectedPackage.price.toLocaleString('en-IN')}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                onClick={handlePurchase}
                disabled={isProcessing}
                size="sm"
                className="bg-goblin-green hover:bg-goblin-green/90 text-black font-bold px-4 py-2 text-sm rounded-lg whitespace-nowrap disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Order Now"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-goblin-bg-card border-goblin-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-goblin-fg">Delete Saved Account?</AlertDialogTitle>
            <AlertDialogDescription className="text-goblin-muted">
              Are you sure you want to delete this saved account? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-goblin-bg-alt border-goblin-border text-goblin-fg hover:bg-goblin-bg-alt/80">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteAccount}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* UID Helper Dialog */}
      <AlertDialog open={showUidHelper} onOpenChange={setShowUidHelper}>
        <AlertDialogContent className="bg-goblin-bg-card border-goblin-border max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-goblin-fg">How to Find Your UID</AlertDialogTitle>
            <AlertDialogDescription className="text-goblin-muted">
              Follow this guide to locate your User ID in the game
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            {game?.uidHelperImage && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                <Image
                  src={game.uidHelperImage}
                  alt="UID Helper Guide"
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowUidHelper(false)}
              className="bg-goblin-green hover:bg-goblin-green/90 text-black font-bold"
            >
              Got it!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}