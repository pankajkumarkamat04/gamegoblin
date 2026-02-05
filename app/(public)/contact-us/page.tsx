"use client";

import React from "react";
import { Mail, Phone, MessageCircle, Clock, MapPin, Send } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-goblin-bg py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-goblin-fg mb-4">Contact Us</h1>
          <p className="text-goblin-fg/60 text-lg">
            We're here to help! Reach out to us through any of these channels
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Contact Methods */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Phone */}
            <div className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card hover:border-[#4ecdc4]/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-[#50fa7b]/10 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-[#50fa7b]" />
                </div>
                <div>
                  <h3 className="font-semibold text-goblin-fg">Phone Support</h3>
                  <p className="text-sm text-goblin-fg/60">Talk to our team</p>
                </div>
              </div>
              <a 
                href="tel:+919137588392"
                className="text-lg font-semibold text-[#4ecdc4] hover:underline"
              >
                +91 91375 88392
              </a>
              <p className="text-sm text-goblin-fg/60 mt-2">9:00 AM - 9:00 PM IST</p>
            </div>

            {/* Email */}
            <div className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card hover:border-[#4ecdc4]/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-[#4ecdc4]/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-[#4ecdc4]" />
                </div>
                <div>
                  <h3 className="font-semibold text-goblin-fg">Email Support</h3>
                  <p className="text-sm text-goblin-fg/60">Write to us</p>
                </div>
              </div>
              <a 
                href="mailto:support@gamesgoblin.com"
                className="text-lg font-semibold text-[#4ecdc4] hover:underline break-all"
              >
                support@gamesgoblin.com
              </a>
              <p className="text-sm text-goblin-fg/60 mt-2">Response within 2-4 hours</p>
            </div>

            {/* WhatsApp */}
            <div className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card hover:border-[#4ecdc4]/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                  <FaWhatsapp className="h-6 w-6 text-[#25D366]" />
                </div>
                <div>
                  <h3 className="font-semibold text-goblin-fg">WhatsApp</h3>
                  <p className="text-sm text-goblin-fg/60">Chat instantly</p>
                </div>
              </div>
              <a 
                href="https://wa.me/919137588392"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-[#4ecdc4] hover:underline"
              >
                +91 91375 88392
              </a>
              <p className="text-sm text-goblin-fg/60 mt-2">Available 24/7</p>
            </div>

            {/* Support Hours */}
            <div className="p-6 rounded-lg border border-[#4ecdc4]/30 bg-[#4ecdc4]/5">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-[#4ecdc4] mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-goblin-fg mb-3">Support Hours</h3>
                  <div className="text-sm text-goblin-fg/70 space-y-2">
                    <p><strong>Email & Chat:</strong> 24/7</p>
                    <p><strong>Phone:</strong> 9:00 AM - 9:00 PM IST</p>
                    <p className="pt-2 text-xs text-goblin-fg/60">
                      Average response time: Under 5 minutes
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#4ecdc4] mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-goblin-fg mb-2">Location</h3>
                  <p className="text-sm text-goblin-fg/70">
                    Mumbai, India
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="p-8 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
              <div className="flex items-center gap-3 mb-6">
                <MessageCircle className="h-6 w-6 text-[#4ecdc4]" />
                <h2 className="text-2xl font-bold text-goblin-fg">Send us a Message</h2>
              </div>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-goblin-fg mb-2">
                      Your Name *
                    </label>
                    <Input 
                      placeholder="John Doe"
                      className="bg-goblin-bg border-goblin-border/30 focus:border-[#4ecdc4] text-goblin-fg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-goblin-fg mb-2">
                      Email Address *
                    </label>
                    <Input 
                      type="email"
                      placeholder="john@example.com"
                      className="bg-goblin-bg border-goblin-border/30 focus:border-[#4ecdc4] text-goblin-fg"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-goblin-fg mb-2">
                      Phone Number
                    </label>
                    <Input 
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="bg-goblin-bg border-goblin-border/30 focus:border-[#4ecdc4] text-goblin-fg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-goblin-fg mb-2">
                      Order Number (if applicable)
                    </label>
                    <Input 
                      placeholder="GGMH123456789"
                      className="bg-goblin-bg border-goblin-border/30 focus:border-[#4ecdc4] text-goblin-fg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-goblin-fg mb-2">
                    Subject *
                  </label>
                  <Input 
                    placeholder="How can we help you?"
                    className="bg-goblin-bg border-goblin-border/30 focus:border-[#4ecdc4] text-goblin-fg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-goblin-fg mb-2">
                    Message *
                  </label>
                  <Textarea 
                    placeholder="Please describe your issue or question in detail..."
                    rows={6}
                    className="bg-goblin-bg border-goblin-border/30 focus:border-[#4ecdc4] text-goblin-fg resize-none"
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-[#4ecdc4] hover:bg-[#4ecdc4]/90 text-white font-semibold py-6 text-lg"
                >
                  <Send className="mr-2 h-5 w-5" />
                  Send Message
                </Button>

                <p className="text-xs text-goblin-fg/60 text-center">
                  By submitting this form, you agree to our Privacy Policy and Terms of Service
                </p>
              </form>
            </div>

            {/* Quick Links */}
            <div className="mt-8 grid md:grid-cols-3 gap-4">
              <a 
                href="/faq"
                className="p-4 rounded-lg border border-goblin-border/30 bg-goblin-bg-card hover:border-[#4ecdc4]/50 transition-all text-center"
              >
                <h3 className="font-semibold text-goblin-fg mb-1">FAQ</h3>
                <p className="text-sm text-goblin-fg/60">Find quick answers</p>
              </a>
              
              <a 
                href="/refund"
                className="p-4 rounded-lg border border-goblin-border/30 bg-goblin-bg-card hover:border-[#4ecdc4]/50 transition-all text-center"
              >
                <h3 className="font-semibold text-goblin-fg mb-1">Refund Policy</h3>
                <p className="text-sm text-goblin-fg/60">Learn about refunds</p>
              </a>
              
              <a 
                href="/orders"
                className="p-4 rounded-lg border border-goblin-border/30 bg-goblin-bg-card hover:border-[#4ecdc4]/50 transition-all text-center"
              >
                <h3 className="font-semibold text-goblin-fg mb-1">Track Order</h3>
                <p className="text-sm text-goblin-fg/60">Check order status</p>
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
