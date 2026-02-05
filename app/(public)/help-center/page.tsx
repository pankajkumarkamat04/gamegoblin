"use client";

import React from "react";
import { Construction, ArrowRight, HelpCircle, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-goblin-bg py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        
        {/* Coming Soon Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#4ecdc4]/10 mb-6">
            <Construction className="h-12 w-12 text-[#4ecdc4]" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-goblin-fg mb-4">
            Help Center Coming Soon
          </h1>
          
          <p className="text-xl text-goblin-fg/60 max-w-2xl mx-auto">
            We're building an amazing comprehensive help center with detailed guides, 
            tutorials, and troubleshooting resources.
          </p>
        </div>

        {/* Features Preview */}
        <div className="mb-12 p-8 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
          <h2 className="text-2xl font-bold text-goblin-fg mb-6 text-center">
            What's Coming in the Help Center
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-[#4ecdc4] mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-goblin-fg mb-1">Step-by-Step Guides</h3>
                <p className="text-sm text-goblin-fg/60">
                  Detailed tutorials for placing orders, finding Game IDs, and more
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-[#4ecdc4] mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-goblin-fg mb-1">Video Tutorials</h3>
                <p className="text-sm text-goblin-fg/60">
                  Visual guides to help you navigate our platform easily
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-[#4ecdc4] mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-goblin-fg mb-1">Troubleshooting</h3>
                <p className="text-sm text-goblin-fg/60">
                  Solutions for common issues and error messages
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-[#4ecdc4] mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-goblin-fg mb-1">Game-Specific Guides</h3>
                <p className="text-sm text-goblin-fg/60">
                  Dedicated guides for each game we support
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-[#4ecdc4] mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-goblin-fg mb-1">Payment Methods</h3>
                <p className="text-sm text-goblin-fg/60">
                  Complete guide to all accepted payment options
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-[#4ecdc4] mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-goblin-fg mb-1">Account Management</h3>
                <p className="text-sm text-goblin-fg/60">
                  Learn how to manage your account and preferences
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* In the Meantime */}
        <div className="mb-12 p-8 rounded-lg border border-[#4ecdc4]/30 bg-[#4ecdc4]/5">
          <h2 className="text-2xl font-bold text-goblin-fg mb-4 text-center">
            In the Meantime
          </h2>
          <p className="text-goblin-fg/70 text-center mb-6">
            While we build the Help Center, you can find answers and support through these resources:
          </p>
          
          <div className="grid md:grid-cols-3 gap-4">
            <a 
              href="/faq"
              className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card hover:border-[#4ecdc4]/50 transition-all group text-center"
            >
              <HelpCircle className="h-8 w-8 text-[#4ecdc4] mx-auto mb-3" />
              <h3 className="font-semibold text-goblin-fg mb-1 group-hover:text-[#4ecdc4] transition-colors">
                FAQ
              </h3>
              <p className="text-sm text-goblin-fg/60">
                Find quick answers to common questions
              </p>
            </a>

            <a 
              href="/contact-us"
              className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card hover:border-[#4ecdc4]/50 transition-all group text-center"
            >
              <Mail className="h-8 w-8 text-[#4ecdc4] mx-auto mb-3" />
              <h3 className="font-semibold text-goblin-fg mb-1 group-hover:text-[#4ecdc4] transition-colors">
                Contact Us
              </h3>
              <p className="text-sm text-goblin-fg/60">
                Reach out to our support team
              </p>
            </a>

            <a 
              href="tel:+919137588392"
              className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card hover:border-[#4ecdc4]/50 transition-all group text-center"
            >
              <Phone className="h-8 w-8 text-[#4ecdc4] mx-auto mb-3" />
              <h3 className="font-semibold text-goblin-fg mb-1 group-hover:text-[#4ecdc4] transition-colors">
                Call Support
              </h3>
              <p className="text-sm text-goblin-fg/60">
                +91 91375 88392
              </p>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-goblin-fg text-center mb-6">
            Popular Resources
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <a 
              href="/about"
              className="flex items-center justify-between p-4 rounded-lg border border-goblin-border/30 bg-goblin-bg-card hover:border-[#4ecdc4]/50 transition-all group"
            >
              <span className="font-medium text-goblin-fg group-hover:text-[#4ecdc4] transition-colors">
                About GamesGoblin
              </span>
              <ArrowRight className="h-5 w-5 text-goblin-fg/40 group-hover:text-[#4ecdc4] transition-colors" />
            </a>

            <a 
              href="/refund"
              className="flex items-center justify-between p-4 rounded-lg border border-goblin-border/30 bg-goblin-bg-card hover:border-[#4ecdc4]/50 transition-all group"
            >
              <span className="font-medium text-goblin-fg group-hover:text-[#4ecdc4] transition-colors">
                Refund Policy
              </span>
              <ArrowRight className="h-5 w-5 text-goblin-fg/40 group-hover:text-[#4ecdc4] transition-colors" />
            </a>

            <a 
              href="/privacy"
              className="flex items-center justify-between p-4 rounded-lg border border-goblin-border/30 bg-goblin-bg-card hover:border-[#4ecdc4]/50 transition-all group"
            >
              <span className="font-medium text-goblin-fg group-hover:text-[#4ecdc4] transition-colors">
                Privacy Policy
              </span>
              <ArrowRight className="h-5 w-5 text-goblin-fg/40 group-hover:text-[#4ecdc4] transition-colors" />
            </a>

            <a 
              href="/terms"
              className="flex items-center justify-between p-4 rounded-lg border border-goblin-border/30 bg-goblin-bg-card hover:border-[#4ecdc4]/50 transition-all group"
            >
              <span className="font-medium text-goblin-fg group-hover:text-[#4ecdc4] transition-colors">
                Terms of Service
              </span>
              <ArrowRight className="h-5 w-5 text-goblin-fg/40 group-hover:text-[#4ecdc4] transition-colors" />
            </a>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-goblin-fg/60 mb-4">
            Need immediate assistance?
          </p>
          <Button 
            asChild
            className="bg-[#4ecdc4] hover:bg-[#4ecdc4]/90 text-white font-semibold px-8 py-6 text-lg"
          >
            <a href="/contact-us">
              Contact Support Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
          <p className="text-sm text-goblin-fg/60 mt-4">
            Average response time: Under 5 minutes
          </p>
        </div>

      </div>
    </div>
  );
}
