"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, Clock, ChevronRight } from "lucide-react";
import { FaDiscord, FaWhatsapp, FaEnvelope, FaPhone } from "react-icons/fa";
import Link from "next/link";

const faqCategories = [
  {
    title: "General",
    items: [
      {
        q: "How does GameGoblin work?",
        a: "Select your game, choose a package, enter your game ID, pay securely, and receive your in-game currency instantly. Most deliveries complete within 2 minutes."
      },
      {
        q: "Is it safe and secure?",
        a: "Yes. We use bank-grade encryption and secure payment gateways. All transactions are protected and we never store your payment information."
      },
      {
        q: "Which games are supported?",
        a: "We support 150+ popular games including PUBG Mobile, Free Fire, Genshin Impact, Valorant, Mobile Legends, COD Mobile, and more."
      }
    ]
  },
  {
    title: "Orders & Delivery",
    items: [
      {
        q: "How fast is delivery?",
        a: "99% of orders are delivered within 2 minutes. Some may take up to 5 minutes during peak hours. All orders guaranteed within 30 minutes or full refund."
      },
      {
        q: "What if I don't receive my order?",
        a: "Contact support immediately if you don't receive your order within 30 minutes. We'll complete delivery or provide a full refund."
      },
      {
        q: "Can I cancel my order?",
        a: "Orders can only be cancelled within 2 minutes if not yet processed. Once delivered, cancellations aren't possible due to the digital nature of products."
      }
    ]
  },
  {
    title: "Payment",
    items: [
      {
        q: "What payment methods are accepted?",
        a: "UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards (Visa, Mastercard, RuPay), Digital Wallets, and Net Banking from all major Indian banks."
      },
      {
        q: "Are there hidden charges?",
        a: "No. The price you see is what you pay. Some payment providers may charge processing fees."
      },
      {
        q: "Do you offer refunds?",
        a: "Yes. Full refunds if order fails or isn't delivered within 30 minutes. Processed within 5-7 business days to original payment method."
      }
    ]
  },
  {
    title: "Account & Technical",
    items: [
      {
        q: "Do I need an account?",
        a: "No account required. Buy instantly with just your email. Accounts help track orders and access exclusive deals."
      },
      {
        q: "How to find my Game ID?",
        a: "Usually in game settings or profile. PUBG: Settings > Basic > Character. Free Fire: Profile > Settings > Account. Contact support if you need help."
      },
      {
        q: "What if I entered wrong Game ID?",
        a: "Contact support immediately. If order not processed, we can correct it. If already delivered, we'll coordinate with game support for resolution."
      }
    ]
  }
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFAQ = faqCategories.map(category => ({
    ...category,
    items: category.items.filter(item => 
      searchQuery === "" || 
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="min-h-screen bg-goblin-bg py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-goblin-fg mb-2">Support</h1>
          <p className="text-goblin-fg/60">Get help with your orders and account</p>
        </div>

        {/* Search */}
        <div className="mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-goblin-fg/40" />
            <Input
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 bg-goblin-bg-card border-goblin-border/30 focus:border-[#4ecdc4] text-goblin-fg"
            />
          </div>
        </div>

        {/* Contact Options */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          <a href="https://wa.me/919137588392" target="_blank" rel="noopener noreferrer" className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card hover:border-[#4ecdc4]/50 transition-all text-left group">
            <FaWhatsapp className="h-8 w-8 text-[#25D366] mb-3" />
            <h3 className="font-semibold text-goblin-fg mb-1 group-hover:text-[#4ecdc4] transition-colors">WhatsApp</h3>
            <p className="text-sm text-goblin-fg/60">+91 91375 88392</p>
          </a>
          
          {/* <button className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card hover:border-[#4ecdc4]/50 transition-all text-left group">
            <FaDiscord className="h-8 w-8 text-[#5865F2] mb-3" />
            <h3 className="font-semibold text-goblin-fg mb-1 group-hover:text-[#4ecdc4] transition-colors">Discord</h3>
            <p className="text-sm text-goblin-fg/60">Join community</p>
          </button> */}
          
          <a href="mailto:support@gamesgoblin.com" className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card hover:border-[#4ecdc4]/50 transition-all text-left group">
            <FaEnvelope className="h-8 w-8 text-[#4ecdc4] mb-3" />
            <h3 className="font-semibold text-goblin-fg mb-1 group-hover:text-[#4ecdc4] transition-colors">Email</h3>
            <p className="text-sm text-goblin-fg/60">2-4 hours response</p>
          </a>
          
          <a href="tel:+919137588392" className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card hover:border-[#4ecdc4]/50 transition-all text-left group">
            <FaPhone className="h-8 w-8 text-[#50fa7b] mb-3" />
            <h3 className="font-semibold text-goblin-fg mb-1 group-hover:text-[#4ecdc4] transition-colors">Phone</h3>
            <p className="text-sm text-goblin-fg/60">+91 91375 88392</p>
          </a>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-goblin-fg mb-8">Frequently Asked Questions</h2>
          
          {filteredFAQ.length > 0 ? (
            <div className="space-y-8">
              {filteredFAQ.map((category, catIndex) => (
                <div key={catIndex}>
                  <h3 className="text-sm font-semibold text-goblin-fg/40 uppercase tracking-wider mb-4">
                    {category.title}
                  </h3>
                  <div className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <Accordion key={itemIndex} type="single" collapsible>
                        <AccordionItem 
                          value={`item-${itemIndex}`}
                          className="border border-goblin-border/30 rounded-lg px-6 hover:border-[#4ecdc4]/50 transition-colors data-[state=open]:border-[#4ecdc4]/50"
                        >
                          <AccordionTrigger className="text-goblin-fg hover:text-[#4ecdc4] text-left py-5 hover:no-underline">
                            {item.q}
                          </AccordionTrigger>
                          <AccordionContent className="text-goblin-fg/70 pt-1 pb-5">
                            {item.a}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-goblin-border/30 rounded-lg bg-goblin-bg-card">
              <p className="text-goblin-fg/60">No results found. Try a different search term.</p>
            </div>
          )}
        </div>

        {/* Support Hours */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-[#4ecdc4] mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-goblin-fg mb-2">Support Hours</h3>
                <div className="text-sm text-goblin-fg/60 space-y-1">
                  <p>Email & Chat: 24/7</p>
                  <p>Phone: 9:00 AM - 9:00 PM IST</p>
                  <p>Average response time: Under 5 minutes</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border border-[#ff6b6b]/30 bg-[#ff6b6b]/5">
            <h3 className="font-semibold text-goblin-fg mb-2">Emergency Support</h3>
            <p className="text-sm text-goblin-fg/60 mb-4">For urgent issues with active orders</p>
            <a href="https://wa.me/919137588392?text=Emergency%20Support%20-%20Order%20Issue" target="_blank" rel="noopener noreferrer">
              <Button className="bg-[#ff6b6b] hover:bg-[#ff6b6b]/90 text-white">
                Contact Now
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-12 text-center p-8 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
          <h3 className="text-lg font-semibold text-goblin-fg mb-2">Still need help?</h3>
          <p className="text-goblin-fg/60 mb-6">Browse our complete help documentation</p>
          <Link href="/docs">
            <Button variant="outline" className="border-[#4ecdc4] text-[#4ecdc4] hover:bg-[#4ecdc4]/10">
              View Documentation
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}