import { HeroSection } from "@/components/home/HeroSection";
import { DirectTopupsSection } from "@/components/home/DirectTopupsSection";
import { GameGridSection } from "@/components/home/GameGridSection";
import { PromoMarquee } from "@/components/home/PromoMarquee";
import { LeaderboardSection } from "@/components/home/LeaderboardSection";
import { NewYearPopup } from "@/components/home/NewYearPopup";

import { AlertCircle } from "lucide-react";

export default function Home() {
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* New Year Popup */}
      <NewYearPopup />

      {/* Maintenance Mode Banner */}
      {isMaintenanceMode && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/30 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-center gap-2 text-yellow-500">
              <AlertCircle className="w-5 h-5" />
              <p className="font-semibold">🚧 System Maintenance: Purchases temporarily disabled</p>
            </div>
          </div>
        </div>
      )}

      {/* Promo Marquee */}
      <PromoMarquee />

      {/* Hero Section */}
      <HeroSection />

      {/* Popular Games Grid */}
      <GameGridSection />




      {/* Direct Top-ups Section */}
      {/* <DirectTopupsSection /> */}

      {/* Leaderboard Section */}
      {/* <LeaderboardSection /> */}
    </div>
  );
}
