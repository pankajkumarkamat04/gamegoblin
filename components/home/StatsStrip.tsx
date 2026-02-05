"use client";

import React from "react";
import { 
  Users, 
  ShoppingCart, 
  Star, 
  Shield,
  Clock,
  Trophy
} from "lucide-react";

export function StatsStrip() {
  const stats = [
    {
      icon: ShoppingCart,
      value: "150,000+",
      label: "Orders Completed",
      subtext: "Happy gamers served"
    },
    {
      icon: Users,
      value: "75,000+",
      label: "Active Users",
      subtext: "Growing community"
    },
    {
      icon: Star,
      value: "4.9/5",
      label: "Customer Rating",
      subtext: "Trusted by gamers"
    },
    {
      icon: Shield,
      value: "99.9%",
      label: "Success Rate",
      subtext: "Reliable delivery"
    },
  ];

  const features = [
    {
      icon: Clock,
      title: "Fast Delivery",
      description: "Under 60 seconds"
    },
    {
      icon: Trophy,
      title: "Top Rated",
      description: "By gaming community"
    },
    {
      icon: Shield,
      title: "Secure",
      description: "100% protected"
    }
  ];

  return (
    <section className="py-16 bg-goblin-bg border-y border-goblin-border">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-goblin-text mb-4">
            Trusted by Gamers Worldwide
          </h2>
          <p className="text-goblin-muted max-w-2xl mx-auto">
            Join millions who trust GameGoblin for reliable game top-ups and digital services
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-goblin-card rounded-lg border border-goblin-border">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-goblin-primary/10">
                  <stat.icon className="w-6 h-6 text-goblin-primary" />
                </div>
              </div>
              <div className="text-2xl font-bold text-goblin-text mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-goblin-text mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-goblin-muted">
                {stat.subtext}
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3 px-6 py-3 bg-goblin-card rounded-full border border-goblin-border">
              <feature.icon className="w-5 h-5 text-goblin-primary" />
              <div className="text-sm">
                <span className="font-medium text-goblin-text">{feature.title}</span>
                <span className="text-goblin-muted ml-2">• {feature.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}