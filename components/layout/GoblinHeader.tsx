"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu, User, LogIn, LogOut, Sparkles } from "lucide-react";
import { useUserAuth } from "@/contexts/UserAuthContext";

export function GoblinHeader() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useUserAuth();

  const handleSidebarLogout = () => {
    logout();
    setIsOpen(false);
    router.push("/");
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Games", href: "/games" },
    { name: "News", href: "/news" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Orders", href: "/orders" },
    { name: "Wallet", href: "/wallet" },
    { name: "Support", href: "/support" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-goblin-border/30 bg-goblin-bg/80 backdrop-blur-xl shadow-xl shadow-black/5 overflow-visible">
      {/* Animated gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-goblin-green to-transparent opacity-50"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-6">
          {/* Logo - Combined logo with overflow effect for tail */}
          <Link href="/" className="flex items-center group relative -my-2 overflow-visible">
            {/* Combined Logo - Simple hover effect with scale only */}
            <div className="relative h-20 w-56 flex-shrink-0 transition-transform duration-300 ease-out group-hover:scale-110 overflow-visible">
              <Image
                src="/logo-with-text.svg"
                alt="GamesGoblin"
                fill
                className="object-contain object-left drop-shadow-2xl"
                priority
                style={{ objectPosition: 'left center' }}
              />
            </div>
          </Link>

          {/* Desktop Navigation - Modern style */}
          <nav className="hidden lg:flex items-center gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative px-5 py-2.5 text-sm font-semibold text-goblin-fg/80 hover:text-goblin-fg rounded-xl transition-all duration-300 group overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {item.name}
                </span>
                {/* Animated background on hover */}
                <span className="absolute inset-0 bg-gradient-to-r from-goblin-green/10 via-goblin-purple/10 to-goblin-green/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></span>
                {/* Bottom indicator */}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-goblin-green via-goblin-purple to-goblin-green group-hover:w-[70%] transition-all duration-500 ease-out rounded-full shadow-lg shadow-goblin-green/50"></span>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions - Enhanced */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Profile Button */}
                <Link href="/profile" title="Profile">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-goblin-fg/70 hover:text-goblin-fg hover:bg-goblin-bg-card/70 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-goblin-green/20"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <div className="h-6 w-px bg-gradient-to-b from-transparent via-goblin-border/50 to-transparent"></div>
              </>
            ) : null}

            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-goblin-bg-card/80 to-goblin-bg-card/60 backdrop-blur-sm rounded-xl border border-goblin-border/30 hover:border-goblin-green/30 transition-all duration-300 group">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-goblin-green to-emerald-500 flex items-center justify-center shadow-lg">
                    <User className="h-4 w-4 text-black" />
                  </div>
                  <span className="text-sm font-semibold text-goblin-fg">
                    {user?.name || (user?.phone ? `+91 ${user.phone.slice(-4)}` : "User")}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="h-10 w-10 text-goblin-fg/70 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 hover:scale-110"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="h-10 px-5 text-sm font-semibold text-goblin-fg/80 hover:text-goblin-fg hover:bg-goblin-bg-card/70 rounded-xl transition-all duration-300"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    className="h-10 px-6 text-sm font-bold bg-gradient-to-r from-goblin-green via-emerald-500 to-goblin-green bg-size-200 hover:bg-pos-100 text-white rounded-xl transition-all duration-500 shadow-lg shadow-goblin-green/30 hover:shadow-goblin-green/50 hover:scale-105 relative overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-goblin-green/50"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Sign Up
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu - Enhanced */}
          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated ? (
              <Link href="/profile" title="Profile">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-goblin-fg/70 hover:text-goblin-fg hover:bg-goblin-bg-card/70 rounded-xl transition-all"
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/login" title="Login">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-goblin-fg/70 hover:text-goblin-fg hover:bg-goblin-bg-card/70 rounded-xl transition-all"
                >
                  <LogIn className="h-5 w-5" />
                </Button>
              </Link>
            )}

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-goblin-fg/70 hover:text-goblin-fg hover:bg-goblin-bg-card/70 rounded-xl transition-all"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[320px] bg-gradient-to-br from-goblin-bg via-goblin-bg-alt to-goblin-bg border-l border-goblin-border/30 p-0 backdrop-blur-xl"
              >
                <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full max-h-[100dvh] relative overflow-hidden">
                  {/* Decorative gradient orbs */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-goblin-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-goblin-purple/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                  {/* Mobile Header - fixed at top */}
                  <div className="relative flex-shrink-0 flex items-center justify-between p-6 border-b border-goblin-border/30 backdrop-blur-sm">
                    <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                      <div className="relative h-12 w-44 flex-shrink-0">
                        <Image
                          src="/logo-with-text.svg"
                          alt="GamesGoblin"
                          fill
                          className="object-contain object-left"
                        />
                      </div>
                    </Link>
                  </div>

                  {/* Mobile Navigation - scrollable */}
                  <nav className="relative flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col gap-2 p-4">
                    {navigation.map((item, index) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="group relative px-5 py-4 text-sm font-semibold text-goblin-fg/80 hover:text-goblin-fg bg-goblin-bg-card/40 hover:bg-goblin-bg-card/70 backdrop-blur-sm border border-goblin-border/20 hover:border-goblin-green/30 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-goblin-green/10"
                        onClick={() => setIsOpen(false)}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <span className="relative z-10 flex items-center gap-3">
                          <span className="h-2 w-2 rounded-full bg-gradient-to-r from-goblin-green to-goblin-purple opacity-0 group-hover:opacity-100 transition-opacity"></span>
                          {item.name}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-goblin-green/5 via-transparent to-goblin-purple/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile Actions - fixed at bottom */}
                  <div className="relative flex-shrink-0 border-t border-goblin-border/30 p-6 space-y-4 bg-gradient-to-t from-goblin-bg-card/30 to-transparent backdrop-blur-sm">
                    {isAuthenticated ? (
                      <>
                        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-goblin-bg-card/70 to-goblin-bg-card/50 backdrop-blur-sm border border-goblin-border/30 rounded-2xl">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-goblin-green to-emerald-500 flex items-center justify-center shadow-lg shadow-goblin-green/20">
                            <User className="h-6 w-6 text-black" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-goblin-fg/60 font-medium">
                              Logged in as{" "}
                              <span className="font-semibold text-goblin-fg">
                                {user?.name || `+91 ${user?.phone?.slice(-4)}`}
                              </span>
                            </p>
                            <p className="text-xs text-goblin-muted mt-0.5">
                              {user?.phone && `+91 ${user.phone}`}
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={handleSidebarLogout}
                          variant="outline"
                          className="w-full h-12 text-sm font-semibold border-goblin-border/50 hover:border-red-400/50 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="w-full block"
                          onClick={() => setIsOpen(false)}
                        >
                          <Button
                            className="w-full h-12 bg-gradient-to-r from-goblin-green via-emerald-500 to-goblin-green bg-size-200 hover:bg-pos-100 text-white text-sm font-bold rounded-xl shadow-xl shadow-goblin-green/30 hover:shadow-goblin-green/50 transition-all duration-500 hover:scale-[1.02] relative overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-goblin-green/50"
                          >
                            <span className="relative z-10 flex items-center gap-2">
                              <Sparkles className="h-4 w-4" />
                              Sign Up / Login
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                          </Button>
                        </Link>
                      </>
                    )}

                    {/* Cart removed */}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}