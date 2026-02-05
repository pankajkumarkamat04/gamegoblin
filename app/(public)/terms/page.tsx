"use client";

import React from "react";
import { FileText, UserCheck, ShoppingCart, CreditCard, AlertTriangle, Scale } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-goblin-bg py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-goblin-fg mb-4">Terms of Service</h1>
          <p className="text-goblin-fg/60">Last updated: November 1, 2025</p>
        </div>

        {/* Introduction */}
        <div className="mb-12 p-6 rounded-lg border border-[#4ecdc4]/30 bg-[#4ecdc4]/5">
          <div className="flex items-start gap-4">
            <FileText className="h-6 w-6 text-[#4ecdc4] mt-1 flex-shrink-0" />
            <div>
              <p className="text-goblin-fg/70 leading-relaxed">
                Welcome to GamesGoblin! These Terms of Service ("Terms") govern your use of our platform 
                and services. By accessing or using GamesGoblin, you agree to be bound by these Terms. 
                If you do not agree, please do not use our services.
              </p>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          
          {/* Acceptance */}
          <section className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="h-6 w-6 text-[#4ecdc4]" />
              <h2 className="text-2xl font-bold text-goblin-fg">1. Acceptance of Terms</h2>
            </div>
            
            <div className="space-y-3 ml-9 text-goblin-fg/70">
              <p>
                By creating an account or making a purchase on GamesGoblin, you confirm that:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>You are at least 13 years of age (or the age of majority in your jurisdiction)</li>
                <li>You have the legal capacity to enter into binding contracts</li>
                <li>All information you provide is accurate and truthful</li>
                <li>You will comply with all applicable laws and regulations</li>
                <li>You accept these Terms and our Privacy Policy</li>
              </ul>
            </div>
          </section>

          {/* Services */}
          <section className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingCart className="h-6 w-6 text-[#4ecdc4]" />
              <h2 className="text-2xl font-bold text-goblin-fg">2. Our Services</h2>
            </div>
            
            <div className="space-y-4 ml-9">
              <div>
                <h3 className="text-lg font-semibold text-goblin-fg mb-2">What We Provide</h3>
                <p className="text-goblin-fg/70">
                  GamesGoblin is a platform for purchasing in-game currency and top-ups for various 
                  games. We act as an intermediary between you and authorized game resellers/distributors.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-goblin-fg mb-2">Service Availability</h3>
                <ul className="list-disc list-inside text-goblin-fg/70 space-y-1">
                  <li>Services are available 24/7, but may be interrupted for maintenance</li>
                  <li>We do not guarantee uninterrupted access</li>
                  <li>Game availability and pricing may change without notice</li>
                  <li>Delivery times are estimates and may vary</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-goblin-fg mb-2">Authorized Channels</h3>
                <p className="text-goblin-fg/70">
                  All transactions are processed through legitimate, authorized resellers and official 
                  distribution channels. We guarantee the authenticity of all products delivered.
                </p>
              </div>
            </div>
          </section>

          {/* User Accounts */}
          <section className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
            <h2 className="text-2xl font-bold text-goblin-fg mb-4">3. User Accounts</h2>
            
            <div className="space-y-3 text-goblin-fg/70">
              <div>
                <h3 className="text-lg font-semibold text-goblin-fg mb-2">Account Registration</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Accounts are optional but recommended for tracking orders</li>
                  <li>You must provide accurate, current information</li>
                  <li>You are responsible for maintaining account security</li>
                  <li>You must not share your account credentials</li>
                  <li>Notify us immediately of any unauthorized access</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-goblin-fg mb-2">Account Termination</h3>
                <p>
                  We reserve the right to suspend or terminate accounts that violate these Terms, 
                  engage in fraudulent activity, or abuse our services.
                </p>
              </div>
            </div>
          </section>

          {/* Orders & Payment */}
          <section className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="h-6 w-6 text-[#4ecdc4]" />
              <h2 className="text-2xl font-bold text-goblin-fg">4. Orders and Payments</h2>
            </div>
            
            <div className="space-y-4 ml-9">
              <div>
                <h3 className="text-lg font-semibold text-goblin-fg mb-2">Placing Orders</h3>
                <ul className="list-disc list-inside text-goblin-fg/70 space-y-1">
                  <li>Verify all details (Game ID, package, price) before purchasing</li>
                  <li>Orders are binding once payment is confirmed</li>
                  <li>You are responsible for providing accurate Game IDs</li>
                  <li>Incorrect information may result in delivery failure</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-goblin-fg mb-2">Pricing</h3>
                <ul className="list-disc list-inside text-goblin-fg/70 space-y-1">
                  <li>All prices are in Indian Rupees (INR) unless stated otherwise</li>
                  <li>Prices include applicable taxes</li>
                  <li>Prices may change without notice</li>
                  <li>Price at checkout is the final price</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-goblin-fg mb-2">Payment Methods</h3>
                <p className="text-goblin-fg/70">
                  We accept UPI, Credit/Debit Cards, Digital Wallets, and Net Banking through secure 
                  payment gateways. All payments are processed securely and encrypted.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-goblin-fg mb-2">Delivery</h3>
                <ul className="list-disc list-inside text-goblin-fg/70 space-y-1">
                  <li>99% of orders delivered within 2 minutes</li>
                  <li>All orders guaranteed within 30 minutes</li>
                  <li>Delays may occur during peak hours or technical issues</li>
                  <li>You will receive email confirmation upon delivery</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Refunds */}
          <section className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
            <h2 className="text-2xl font-bold text-goblin-fg mb-4">5. Refunds and Cancellations</h2>
            
            <div className="space-y-3 text-goblin-fg/70">
              <p>
                See our detailed <a href="/refund" className="text-[#4ecdc4] hover:underline">Refund Policy</a> for complete information. Summary:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Full refund if order not delivered within 30 minutes</li>
                <li>Full refund if order fails or payment issues occur</li>
                <li>Cancellations possible within 2 minutes if not processed</li>
                <li>No refunds for delivered digital products</li>
                <li>Refunds processed within 5-7 business days</li>
              </ul>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-[#ff6b6b]" />
              <h2 className="text-2xl font-bold text-goblin-fg">6. Prohibited Activities</h2>
            </div>
            
            <div className="space-y-3 ml-9">
              <p className="text-goblin-fg/70">You agree NOT to:</p>
              <ul className="list-disc list-inside text-goblin-fg/70 space-y-1">
                <li>Use the platform for fraudulent or illegal activities</li>
                <li>Provide false or misleading information</li>
                <li>Attempt to circumvent security measures</li>
                <li>Use automated bots or scripts</li>
                <li>Resell or redistribute purchased items without authorization</li>
                <li>Interfere with platform operations or other users</li>
                <li>Reverse engineer or copy our software/content</li>
                <li>Use stolen payment methods or engage in chargebacks fraud</li>
              </ul>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
            <h2 className="text-2xl font-bold text-goblin-fg mb-4">7. Intellectual Property</h2>
            
            <div className="space-y-3 text-goblin-fg/70">
              <p>
                All content on GamesGoblin (logos, text, graphics, software, etc.) is owned by us or 
                our licensors and protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p>
                Game names, logos, and trademarks are property of their respective owners. We use them 
                for identification purposes only and do not claim ownership.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="h-6 w-6 text-[#4ecdc4]" />
              <h2 className="text-2xl font-bold text-goblin-fg">8. Limitation of Liability</h2>
            </div>
            
            <div className="space-y-3 ml-9 text-goblin-fg/70">
              <p>
                To the maximum extent permitted by law:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>We are not liable for indirect, incidental, or consequential damages</li>
                <li>Our total liability is limited to the amount you paid for the specific order</li>
                <li>We are not responsible for third-party services or game publisher actions</li>
                <li>We do not guarantee uninterrupted or error-free service</li>
                <li>Digital products are provided "as is" without warranties</li>
              </ul>
            </div>
          </section>

          {/* Disputes */}
          <section className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
            <h2 className="text-2xl font-bold text-goblin-fg mb-4">9. Dispute Resolution</h2>
            
            <div className="space-y-3 text-goblin-fg/70">
              <p>
                If you have any disputes or concerns:
              </p>
              <ol className="list-decimal list-inside space-y-2">
                <li><strong>Contact Support First:</strong> Email support@gamesgoblin.com or call +91 91375 88392</li>
                <li><strong>Informal Resolution:</strong> We'll work to resolve issues amicably within 7 days</li>
                <li><strong>Governing Law:</strong> These Terms are governed by the laws of India</li>
                <li><strong>Jurisdiction:</strong> Courts in Mumbai, India have exclusive jurisdiction</li>
              </ol>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
            <h2 className="text-2xl font-bold text-goblin-fg mb-4">10. Changes to Terms</h2>
            
            <p className="text-goblin-fg/70">
              We may update these Terms periodically. Significant changes will be notified via email 
              or website announcement. Continued use of our services after changes constitutes acceptance. 
              Always review the "Last updated" date at the top.
            </p>
          </section>

          {/* Severability */}
          <section className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
            <h2 className="text-2xl font-bold text-goblin-fg mb-4">11. Severability</h2>
            
            <p className="text-goblin-fg/70">
              If any provision of these Terms is found to be unenforceable or invalid, that provision 
              will be limited or eliminated to the minimum extent necessary, and the remaining provisions 
              will remain in full force and effect.
            </p>
          </section>

          {/* Contact */}
          <section className="p-6 rounded-lg border border-[#4ecdc4]/30 bg-[#4ecdc4]/5">
            <h2 className="text-2xl font-bold text-goblin-fg mb-4">12. Contact Information</h2>
            <p className="text-goblin-fg/70 mb-4">
              Questions about these Terms? Contact us:
            </p>
            <div className="space-y-2 text-goblin-fg/70">
              <p><strong>Email:</strong> support@gamesgoblin.com</p>
              <p><strong>Phone:</strong> +91 91375 88392 (9 AM - 9 PM IST)</p>
              <p><strong>Address:</strong> Mumbai, India</p>
            </div>
          </section>

        </div>

        {/* Agreement */}
        <div className="mt-12 p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card text-center">
          <p className="text-goblin-fg/70 leading-relaxed">
            By using GamesGoblin, you acknowledge that you have read, understood, and agree to be 
            bound by these Terms of Service and our Privacy Policy.
          </p>
        </div>

      </div>
    </div>
  );
}
