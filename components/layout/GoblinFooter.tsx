"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { 
  Instagram, 
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { WhatsAppChannelBanner } from "@/components/home/WhatsAppChannelBanner";

export function GoblinFooter() {
  const footerLinks = {
    company: [
      { name: "About Us", href: "/about" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Refund Policy", href: "/refund" },
    ],
    support: [
      { name: "Help Center", href: "/help-center" },
      { name: "Contact Us", href: "/contact-us" },
      { name: "FAQ", href: "/faq" },
      { name: "News & Updates", href: "/news" },
      { name: "Leaderboard", href: "/leaderboard" },
      { name: "WhatsApp Channel", href: "https://whatsapp.com/channel/0029Vb7INamJUM2WTkHtxt2A", external: true },
    ],
    games: [
      { name: "Mobile Legends", href: "/games/mobile-legends" },
      { name: "PUBG Mobile", href: "/games/pubg" },
      { name: "Free Fire", href: "/games/freefire" },
      { name: "Genshin Impact", href: "/games/genshin" },
    ],
  };

  const socialLinks = [
    { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/gamesgoblin.com_/" },
    { name: "WhatsApp", icon: FaWhatsapp, href: "https://whatsapp.com/channel/0029Vb7INamJUM2WTkHtxt2A" },
  ];

  return (
    <>
      <WhatsAppChannelBanner />
      <footer className="relative mt-auto overflow-hidden border-t border-goblin-border bg-[#050506] text-goblin-muted">
        <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden>
          <div className="absolute -top-32 right-0 h-64 w-64 rounded-full bg-goblin-green/20 blur-[120px]" />
          <div className="absolute -bottom-20 left-0 h-72 w-72 rounded-full bg-goblin-purple/15 blur-[130px]" />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
          {/* CTA */}
          <div className="rounded-3xl border border-goblin-border/70 bg-gradient-to-r from-goblin-bg to-goblin-bg-alt px-6 py-8 sm:px-10 sm:py-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-goblin-green mb-2">Stay plugged in</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Summon the Goblin signal</h3>
              <p className="text-sm sm:text-base text-goblin-muted max-w-xl">
                Flash drops, order alerts, and chaos control straight from HQ. Hop into the WhatsApp channel or stalk us on Instagram.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              <Button
                asChild
                className="flex-1 lg:flex-none bg-goblin-green text-black hover:bg-goblin-green/90"
              >
                <Link href="https://whatsapp.com/channel/0029Vb7INamJUM2WTkHtxt2A" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <FaWhatsapp className="h-4 w-4" />
                  Join WhatsApp Channel
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 lg:flex-none border-goblin-border text-white hover:text-goblin-green/90"
              >
                <Link href="https://www.instagram.com/gamesgoblin.com_/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Instagram className="h-4 w-4" />
                  Follow on Instagram
                </Link>
              </Button>
            </div>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-5">
              <Link href="/" className="inline-flex items-center">
                <div className="relative h-14 w-48">
                  <Image src="/logo-with-text.svg" alt="GamesGoblin" fill className="object-contain object-left" />
                </div>
              </Link>
              <p className="text-sm text-goblin-muted/90 max-w-sm">
                Goblin-run top-up bunker. Instant deliveries, spicy promos, and zero downtime rituals.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-goblin-green" />
                  <span>Mumbai, India</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-goblin-green" />
                  <span>support@gamesgoblin.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-goblin-green" />
                  <span>+91 91375 88392</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-goblin-muted hover:text-goblin-green transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-goblin-muted hover:text-goblin-green transition-colors flex items-center gap-1.5"
                      {...((link as any).external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {link.name}
                      {(link as any).external && <FaWhatsapp className="h-4 w-4 text-emerald-400" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Popular Games</h4>
              <ul className="space-y-2 text-sm">
                {footerLinks.games.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-goblin-muted hover:text-goblin-green transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-goblin-border/70 pt-6">
            <div className="text-center md:text-left">
              <p className="text-sm text-goblin-muted">© {new Date().getFullYear()} GamesGoblin. All rights reserved.</p>
              <p className="text-xs text-goblin-muted/80 mt-1">🧌 Run by goblins, powered by instant top-ups.</p>
            </div>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Button
                    key={social.name}
                    variant="ghost"
                    size="icon"
                    className="rounded-xl border border-goblin-border/60 text-goblin-muted hover:text-white hover:border-goblin-green hover:bg-goblin-green/10"
                    asChild
                  >
                    <Link href={social.href} target="_blank" rel="noopener noreferrer">
                      <Icon className="h-5 w-5" />
                      <span className="sr-only">{social.name}</span>
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}