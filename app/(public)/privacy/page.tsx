import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - GamesGoblin',
  description: 'GamesGoblin Privacy Policy - Learn how we protect and handle your personal information.',
  keywords: 'privacy policy, data protection, user privacy, gamesgoblin',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-goblin-bg py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-goblin-fg mb-4">Privacy Policy</h1>
          <p className="text-goblin-fg/60">Last updated: November 1, 2025</p>
        </div>

        {/* Introduction */}
        <div className="mb-12 p-6 rounded-lg border border-[#4ecdc4]/30 bg-[#4ecdc4]/5">
          <p className="text-goblin-fg/70 leading-relaxed">
            At GamesGoblin, we take your privacy seriously. This Privacy Policy explains how we 
            collect, use, disclose, and safeguard your information when you use our platform. 
            Please read this policy carefully to understand our practices regarding your personal data.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          
          {/* Information We Collect */}
          <section className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
            <h2 className="text-2xl font-bold text-goblin-fg mb-4">1. Information We Collect</h2>
            
            <div className="space-y-4 ml-9">
              <div>
                <h3 className="text-lg font-semibold text-goblin-fg mb-2">Personal Information</h3>
                <ul className="list-disc list-inside text-goblin-fg/70 space-y-1">
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Game IDs/Player IDs for order fulfillment</li>
                  <li>Account credentials (encrypted passwords)</li>
                  <li>Transaction history and order details</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-goblin-fg mb-2">Automatically Collected Information</h3>
                <ul className="list-disc list-inside text-goblin-fg/70 space-y-1">
                  <li>IP address and device information</li>
                  <li>Browser type and version</li>
                  <li>Usage data and analytics</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-goblin-fg mb-2">Payment Information</h3>
                <p className="text-goblin-fg/70">
                  Payment details are processed by secure third-party payment gateways. We do not 
                  store your complete card details or banking credentials on our servers.
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
            <h2 className="text-2xl font-bold text-goblin-fg mb-4">2. How We Use Your Information</h2>
            
            <ul className="list-disc list-inside text-goblin-fg/70 space-y-2 ml-9">
              <li>Process and fulfill your orders</li>
              <li>Verify your identity and prevent fraud</li>
              <li>Communicate about your orders and account</li>
              <li>Provide customer support</li>
              <li>Improve our services and user experience</li>
              <li>Send promotional offers (with your consent)</li>
              <li>Comply with legal obligations</li>
              <li>Analyze usage patterns and trends</li>
            </ul>
          </section>

          {/* Data Sharing */}
          <section className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
            <h2 className="text-2xl font-bold text-goblin-fg mb-4">3. Information Sharing and Disclosure</h2>
            
            <div className="space-y-3 ml-9">
              <p className="text-goblin-fg/70">We may share your information with:</p>
              
              <div>
                <h3 className="text-lg font-semibold text-goblin-fg mb-1">Authorized Resellers</h3>
                <p className="text-goblin-fg/70">
                  Game IDs and order details shared with our verified partners 
                  to fulfill your orders.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-goblin-fg mb-1">Payment Processors</h3>
                <p className="text-goblin-fg/70">
                  Payment information shared with secure gateways (OneGateway, Razorpay, etc.) to 
                  process transactions.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-goblin-fg mb-1">Service Providers</h3>
                <p className="text-goblin-fg/70">
                  Third-party services for analytics, email delivery, and customer support.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-goblin-fg mb-1">Legal Requirements</h3>
                <p className="text-goblin-fg/70">
                  When required by law, court order, or to protect our rights and safety.
                </p>
              </div>

              <p className="text-goblin-fg/70 pt-2">
                <strong>We never sell your personal information to third parties.</strong>
              </p>
            </div>
          </section>

          {/* Data Security */}
          <section className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
            <h2 className="text-2xl font-bold text-goblin-fg mb-4">4. Data Security</h2>
            
            <div className="space-y-3 ml-9">
              <p className="text-goblin-fg/70">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc list-inside text-goblin-fg/70 space-y-1">
                <li>SSL/TLS encryption for data transmission</li>
                <li>Encrypted storage of sensitive information</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication</li>
                <li>Secure payment gateway integration (PCI DSS compliant)</li>
              </ul>
              <p className="text-goblin-fg/70 pt-2">
                However, no method of transmission over the internet is 100% secure. While we strive 
                to protect your data, we cannot guarantee absolute security.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
            <h2 className="text-2xl font-bold text-goblin-fg mb-4">5. Your Privacy Rights</h2>
            
            <ul className="list-disc list-inside text-goblin-fg/70 space-y-2 ml-9">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Restriction:</strong> Limit how we use your information</li>
            </ul>
            
            <p className="text-goblin-fg/70 mt-4 ml-9">
              To exercise these rights, contact us at <strong>support@gamesgoblin.com</strong> or 
              call <strong>+91 91375 88392</strong>.
            </p>
          </section>

          {/* Cookies */}
          <section className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
            <h2 className="text-2xl font-bold text-goblin-fg mb-4">6. Cookies and Tracking</h2>
            
            <div className="space-y-3">
              <p className="text-goblin-fg/70">
                We use cookies and similar technologies to enhance your experience:
              </p>
              <ul className="list-disc list-inside text-goblin-fg/70 space-y-1">
                <li><strong>Essential Cookies:</strong> Required for site functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand usage patterns</li>
                <li><strong>Preference Cookies:</strong> Remember your settings</li>
              </ul>
              <p className="text-goblin-fg/70">
                You can control cookies through your browser settings, but disabling them may affect 
                site functionality.
              </p>
            </div>
          </section>

          {/* Children's Privacy */}
          <section className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
            <h2 className="text-2xl font-bold text-goblin-fg mb-4">7. Children's Privacy</h2>
            <p className="text-goblin-fg/70">
              Our services are intended for users aged 13 and above. We do not knowingly collect 
              information from children under 13. If you believe we have collected data from a child, 
              please contact us immediately for removal.
            </p>
          </section>

          {/* Data Retention */}
          <section className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
            <h2 className="text-2xl font-bold text-goblin-fg mb-4">8. Data Retention</h2>
            <p className="text-goblin-fg/70">
              We retain your information as long as necessary to provide services, comply with legal 
              obligations, resolve disputes, and enforce agreements. Account data is kept for 3 years 
              after last activity, transaction records for 7 years for accounting purposes.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
            <h2 className="text-2xl font-bold text-goblin-fg mb-4">9. Changes to This Policy</h2>
            <p className="text-goblin-fg/70">
              We may update this Privacy Policy periodically. We will notify you of significant changes 
              via email or prominent notice on our website. Continued use of our services after changes 
              constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section className="p-6 rounded-lg border border-[#4ecdc4]/30 bg-[#4ecdc4]/5">
            <h2 className="text-2xl font-bold text-goblin-fg mb-4">10. Contact Us</h2>
            <p className="text-goblin-fg/70 mb-4">
              If you have questions or concerns about this Privacy Policy or our data practices:
            </p>
            <div className="space-y-2 text-goblin-fg/70">
              <p><strong>Email:</strong> support@gamesgoblin.com</p>
              <p><strong>Phone:</strong> +91 91375 88392 (9 AM - 9 PM IST)</p>
              <p><strong>Address:</strong> Mumbai, India</p>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
