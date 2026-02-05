"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, HelpCircle } from "lucide-react";

const faqCategories = [
  {
    title: "General",
    items: [
      {
        q: "How does GamesGoblin work?",
        a: "Select your game, choose a package, enter your game ID, pay securely, and receive your in-game currency instantly. Most deliveries complete within 2 minutes."
      },
      {
        q: "Is it safe and secure?",
        a: "Yes. We use bank-grade encryption and secure payment gateways. All transactions are protected and we never store your payment information. We work exclusively with authorized resellers and official distribution channels."
      },
      {
        q: "Which games are supported?",
        a: "We support 150+ popular games including Mobile Legends, PUBG Mobile, Free Fire, Genshin Impact, COD Mobile, and more. Check our games page for the complete list."
      },
      {
        q: "Do I need to create an account?",
        a: "No account required. You can buy instantly with just your email and phone number. However, creating an account helps you track orders and access exclusive deals."
      }
    ]
  },
  {
    title: "Orders & Delivery",
    items: [
      {
        q: "How fast is delivery?",
        a: "99% of orders are delivered within 2 minutes. Some may take up to 5 minutes during peak hours. All orders are guaranteed within 30 minutes or you get a full refund."
      },
      {
        q: "What if I don't receive my order?",
        a: "Contact support immediately if you don't receive your order within 30 minutes. We'll complete delivery or provide a full refund. You can reach us at support@gamesgoblin.com or +91 91375 88392."
      },
      {
        q: "Can I track my order?",
        a: "Yes! You'll receive an order confirmation email with a tracking link. If you have an account, you can also view all your orders in the Orders section."
      },
      {
        q: "Can I cancel my order?",
        a: "Orders can only be cancelled within 2 minutes if not yet processed. Once delivered to your game account, cancellations aren't possible due to the digital nature of products."
      },
      {
        q: "What if I entered the wrong Game ID?",
        a: "Contact support immediately before the order is processed. If already delivered to the wrong account, we'll coordinate with game support for resolution, but refunds may not be possible."
      }
    ]
  },
  {
    title: "Payment",
    items: [
      {
        q: "What payment methods are accepted?",
        a: "We accept UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards (Visa, Mastercard, RuPay), Digital Wallets, and Net Banking from all major Indian banks."
      },
      {
        q: "Are there hidden charges?",
        a: "No. The price you see at checkout is what you pay. Some payment providers may charge small processing fees."
      },
      {
        q: "Is my payment information safe?",
        a: "Absolutely. All payments are processed through PCI DSS compliant secure gateways. We never store your complete card details or banking credentials."
      },
      {
        q: "Do you offer refunds?",
        a: "Yes. Full refunds if your order fails or isn't delivered within 30 minutes. Refunds are processed within 5-7 business days to your original payment method. See our Refund Policy for complete details."
      },
      {
        q: "What if my payment failed but money was deducted?",
        a: "If payment was deducted but the order failed, the amount will be automatically refunded within 5-7 business days. Contact support if you need immediate assistance."
      }
    ]
  },
  {
    title: "Account & Technical",
    items: [
      {
        q: "How do I find my Game ID?",
        a: "Game IDs are usually found in game settings or profile section. For example: PUBG Mobile - Settings > Basic > Character; Free Fire - Profile > Settings > Account; Mobile Legends - Profile > Account Settings. Contact support if you need help finding yours."
      },
      {
        q: "How do I verify my Game ID is correct?",
        a: "Use our built-in Game ID verification feature during checkout. It will show your in-game name to confirm you entered the correct ID before payment."
      },
      {
        q: "Can I change my account email/phone?",
        a: "Yes, you can update your email and phone number in your account settings. For security, you may need to verify the new contact information."
      },
      {
        q: "What if I forgot my password?",
        a: "Click 'Forgot Password' on the login page and we'll send a reset link to your registered email address."
      },
      {
        q: "Why is my order showing as pending?",
        a: "Pending status means your payment is being verified or the order is being processed by our resellers. This typically takes 1-2 minutes. If it stays pending for over 30 minutes, contact support."
      },
      {
        q: "Do you store my game password?",
        a: "No! We NEVER ask for your game password. We only need your Game ID/Player ID to deliver items. Never share your game password with anyone."
      }
    ]
  },
  {
    title: "Promotions & Pricing",
    items: [
      {
        q: "Do you offer discounts or promotions?",
        a: "Yes! We regularly run special offers and promotions. Follow us on social media or subscribe to our newsletter to stay updated on the latest deals."
      },
      {
        q: "Are your prices competitive?",
        a: "We work directly with authorized resellers to offer the best possible prices while maintaining quality and legitimacy. Our prices are highly competitive in the market."
      },
      {
        q: "Can I get a refund on discounted items?",
        a: "Yes, our refund policy applies equally to regular and discounted items. If the product wasn't delivered or the order failed, you'll receive a full refund."
      }
    ]
  },
  {
    title: "Security & Privacy",
    items: [
      {
        q: "How is my personal data protected?",
        a: "We follow strict data protection standards. Your information is encrypted and stored securely. We never sell your data to third parties. See our Privacy Policy for full details."
      },
      {
        q: "Are all resellers authorized?",
        a: "Yes! We only work with verified, authorized resellers who are officially recognized by game publishers. This ensures all products are legitimate."
      },
      {
        q: "What if someone accessed my account without permission?",
        a: "Contact us immediately at support@gamesgoblin.com or +91 91375 88392. We'll investigate and take appropriate action, including refunds for unauthorized transactions."
      }
    ]
  }
];

export default function FAQPage() {
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
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle className="h-10 w-10 text-[#4ecdc4]" />
            <h1 className="text-4xl font-bold text-goblin-fg">Frequently Asked Questions</h1>
          </div>
          <p className="text-goblin-fg/60 text-lg">Find answers to common questions about GamesGoblin</p>
        </div>

        {/* Search */}
        <div className="mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-goblin-fg/40" />
            <Input
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 bg-goblin-bg-card border-goblin-border/30 focus:border-[#4ecdc4] text-goblin-fg"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        {filteredFAQ.length > 0 ? (
          <div className="space-y-12">
            {filteredFAQ.map((category, catIndex) => (
              <div key={catIndex}>
                <h2 className="text-2xl font-bold text-goblin-fg mb-6 pb-2 border-b-2 border-[#4ecdc4]/30">
                  {category.title}
                </h2>
                <div className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <Accordion key={itemIndex} type="single" collapsible>
                      <AccordionItem 
                        value={`item-${itemIndex}`}
                        className="border border-goblin-border/30 rounded-lg px-6 hover:border-[#4ecdc4]/50 transition-colors data-[state=open]:border-[#4ecdc4]/50 data-[state=open]:bg-goblin-bg-card"
                      >
                        <AccordionTrigger className="text-goblin-fg hover:text-[#4ecdc4] text-left py-5 hover:no-underline font-semibold">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-goblin-fg/70 pt-1 pb-5 leading-relaxed">
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
          <div className="text-center py-16 border border-goblin-border/30 rounded-lg bg-goblin-bg-card">
            <Search className="h-12 w-12 text-goblin-fg/30 mx-auto mb-4" />
            <p className="text-goblin-fg/60 text-lg">No results found. Try a different search term.</p>
          </div>
        )}

        {/* Still Have Questions */}
        <div className="mt-16 p-8 rounded-lg border border-[#4ecdc4]/30 bg-[#4ecdc4]/5 text-center">
          <h2 className="text-2xl font-bold text-goblin-fg mb-4">Still have questions?</h2>
          <p className="text-goblin-fg/70 mb-6">
            Can't find what you're looking for? Our support team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact-us" 
              className="px-6 py-3 rounded-lg bg-[#4ecdc4] hover:bg-[#4ecdc4]/90 text-white font-semibold transition-colors"
            >
              Contact Support
            </a>
            <a 
              href="mailto:support@gamesgoblin.com" 
              className="px-6 py-3 rounded-lg border border-goblin-border hover:border-[#4ecdc4] text-goblin-fg transition-colors"
            >
              Email Us
            </a>
          </div>
          <p className="text-sm text-goblin-fg/60 mt-6">
            Average response time: Under 5 minutes
          </p>
        </div>

      </div>
    </div>
  );
}
