"use client";

import React from "react";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { ArrowRight } from "lucide-react";

export function WhatsAppChannelBanner() {
  return (
    <section className="py-6 px-4">
      <div className="container mx-auto max-w-7xl">
        <Link 
          href="https://whatsapp.com/channel/0029Vb7INamJUM2WTkHtxt2A" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block group"
        >
          <div className="relative overflow-hidden rounded-lg bg-goblin-bg-card border border-goblin-border hover:border-emerald-500/30 transition-all duration-300 shadow-md hover:shadow-lg">
            {/* Animated gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            
            <div className="relative flex items-center justify-between gap-4 p-4 sm:p-5">
              {/* Left: Icon + Text */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  <FaWhatsapp className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold text-goblin-fg group-hover:text-emerald-400 transition-colors">
                    Join Our WhatsApp Channel
                  </h3>
                  <p className="text-xs text-goblin-muted truncate">
                    Get exclusive deals & instant updates
                  </p>
                </div>
              </div>

              {/* Right: Benefits + Arrow */}
              <div className="hidden sm:flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    Flash Sales
                  </span>
                  <span className="text-xs px-2 py-1 rounded-md bg-yellow-500/10 text-yellow-300 border border-yellow-500/20">
                    Giveaways
                  </span>
                </div>
                <ArrowRight className="w-5 h-5 text-goblin-muted group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </div>

              {/* Mobile Arrow */}
              <ArrowRight className="sm:hidden w-5 h-5 text-goblin-muted group-hover:text-emerald-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
