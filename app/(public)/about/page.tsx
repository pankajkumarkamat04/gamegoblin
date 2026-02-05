import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - GamesGoblin | Authorized Game Top-Up Service',
  description: 'Learn about GamesGoblin - Your trusted partner for legitimate game top-ups through authorized resellers. Fast, secure, and reliable service for Indian gamers.',
  keywords: 'about gamesgoblin, authorized game topup, legitimate game recharge, trusted game store india',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-goblin-bg py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-goblin-fg mb-4">About GamesGoblin</h1>
          <p className="text-xl text-goblin-fg/60">
            Your trusted companion for instant game top-ups with authorized resellers
          </p>
        </div>

        <div className="space-y-8">
          
          <section className="p-8 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
            <h2 className="text-2xl font-bold text-goblin-fg mb-4">Our Mission</h2>
            <p className="text-goblin-fg/70 leading-relaxed mb-4">
              GamesGoblin is a legitimate and authorized platform dedicated to providing gamers across India 
              with instant, secure, and reliable in-game currency top-ups. We partner exclusively with 
              authorized resellers and official distribution channels to ensure every transaction is 
              genuine and secure.
            </p>
            <p className="text-goblin-fg/70 leading-relaxed">
              Our commitment is to deliver the fastest service, best prices, and most trustworthy 
              experience in the gaming top-up industry.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-goblin-fg mb-6">Why Choose GamesGoblin?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
                <h3 className="text-xl font-semibold text-goblin-fg mb-2">100% Legitimate</h3>
                <p className="text-goblin-fg/60">
                  All transactions through authorized channels and verified resellers
                </p>
              </div>
              
              <div className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
                <h3 className="text-xl font-semibold text-goblin-fg mb-2">Lightning Fast</h3>
                <p className="text-goblin-fg/60">
                  99% of orders delivered within 2 minutes
                </p>
              </div>
              
              <div className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
                <h3 className="text-xl font-semibold text-goblin-fg mb-2">Trusted by Thousands</h3>
                <p className="text-goblin-fg/60">
                  Growing community of satisfied gamers
                </p>
              </div>
              
              <div className="p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
                <h3 className="text-xl font-semibold text-goblin-fg mb-2">Best Prices</h3>
                <p className="text-goblin-fg/60">
                  Competitive pricing with regular offers
                </p>
              </div>
            </div>
          </section>

          <section className="p-8 rounded-lg border border-[#4ecdc4]/30 bg-[#4ecdc4]/5">
            <h2 className="text-2xl font-bold text-goblin-fg mb-6">Authorized Recharging Channels</h2>
            <div className="space-y-4">
              <div className="pl-4 border-l-2 border-[#4ecdc4]">
                <p className="text-goblin-fg/70">
                  <strong className="text-goblin-fg">Official Partnerships:</strong> Direct partnerships with authorized game distributors recognized by publishers
                </p>
              </div>
              <div className="pl-4 border-l-2 border-[#4ecdc4]">
                <li className="text-goblin-fg/70">
                  <strong className="text-goblin-fg">Verified Resellers:</strong> Partner network with verified and authorized providers
                </li>
              </div>
              <div className="pl-4 border-l-2 border-[#4ecdc4]">
                <p className="text-goblin-fg/70">
                  <strong className="text-goblin-fg">Secure Transactions:</strong> Bank-grade encryption with PCI DSS compliant payment gateways
                </p>
              </div>
              <div className="pl-4 border-l-2 border-[#4ecdc4]">
                <p className="text-goblin-fg/70">
                  <strong className="text-goblin-fg">Account Safety:</strong> We never ask for passwords or unnecessary personal information
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-goblin-fg mb-6">How It Works</h2>
            <div className="space-y-4">
              {[
                { step: '1', title: 'Select Your Game & Package', desc: 'Choose from 150+ supported games and packages' },
                { step: '2', title: 'Enter Game Details', desc: 'Provide your Game ID - we verify it instantly' },
                { step: '3', title: 'Secure Payment', desc: 'Pay via UPI, Cards, or Net Banking' },
                { step: '4', title: 'Instant Delivery', desc: 'Receive your items within 2 minutes' }
              ].map((item) => (
                <div key={item.step} className="flex gap-4 p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#4ecdc4]/20 flex items-center justify-center">
                    <span className="text-[#4ecdc4] font-bold">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-goblin-fg mb-1">{item.title}</h3>
                    <p className="text-goblin-fg/60">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="text-center p-8 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
            <h2 className="text-2xl font-bold text-goblin-fg mb-4">Have Questions?</h2>
            <p className="text-goblin-fg/60 mb-6">Our support team is here to help you 24/7</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact-us" 
                className="px-6 py-3 rounded-lg bg-[#4ecdc4] hover:bg-[#4ecdc4]/90 text-white font-semibold transition-colors"
              >
                Contact Support
              </a>
              <a 
                href="/faq" 
                className="px-6 py-3 rounded-lg border border-goblin-border hover:border-[#4ecdc4] text-goblin-fg transition-colors"
              >
                View FAQ
              </a>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
