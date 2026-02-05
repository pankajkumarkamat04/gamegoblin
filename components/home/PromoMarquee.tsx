"use client";

import React, { useEffect, useState } from "react";
import { FaBolt, FaShieldAlt, FaClock, FaHeadset, FaTrophy } from "react-icons/fa";
import { HiSparkles, HiLightningBolt } from "react-icons/hi";
import { MdVerified } from "react-icons/md";

const promoMessages = [
  { icon: FaTrophy, text: "Best prices guaranteed or money back" },
  { icon: HiLightningBolt, text: "Lightning fast delivery under 60 seconds" },
  { icon: FaShieldAlt, text: "100% secure payments & account protection" },
  { icon: FaHeadset, text: "24/7 customer support always available" },
  { icon: HiSparkles, text: "Over 100,000+ satisfied gamers worldwide" },
  { icon: MdVerified, text: "Verified seller with instant delivery" },
];

export function PromoMarquee() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promoMessages.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const CurrentIcon = promoMessages[currentIndex].icon;

  return (
    <div className="bg-goblin-bg-card/50 border-b border-goblin-border/30 py-2.5 overflow-hidden backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-[#4ecdc4]/10 border border-[#4ecdc4]/20">
            <CurrentIcon className="h-4 w-4 text-[#4ecdc4]" />
          </div>
          
          {/* Sliding Text */}
          <div className="relative h-5 overflow-hidden">
            <div
              className="flex flex-col transition-all duration-700 ease-out"
              style={{ transform: `translateY(-${currentIndex * 20}px)` }}
            >
              {promoMessages.map((message, index) => (
                <p
                  key={index}
                  className="h-5 flex items-center text-sm font-medium text-goblin-fg/80 whitespace-nowrap"
                >
                  {message.text}
                </p>
              ))}
            </div>
          </div>

          {/* Minimal Indicators */}
          <div className="hidden sm:flex items-center gap-1.5 ml-3">
            {promoMessages.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-500 ${
                  index === currentIndex 
                    ? 'w-6 bg-[#4ecdc4]' 
                    : 'w-1 bg-goblin-border'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}