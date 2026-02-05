import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | GamesGoblin - Fair & Transparent Refund Process",
  description: "GamesGoblin refund policy for game top-ups and in-game currency. Full refund within 30 minutes if not delivered. Clear guidelines for eligible and ineligible cases.",
  keywords: "refund policy, game top-up refund, gaming refund, digital refund India, GamesGoblin refund"
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-goblin-bg py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-goblin-fg mb-4">Refund Policy</h1>
          <p className="text-goblin-fg/60">Last updated: November 1, 2025</p>
        </div>

        {/* Introduction */}
        <div className="mb-12 p-6 rounded-lg border border-[#4ecdc4]/30 bg-[#4ecdc4]/5">
          <p className="text-goblin-fg/70 leading-relaxed">
            At GamesGoblin, we strive to provide instant and reliable service. However, we understand 
            that issues may occur. This Refund Policy outlines when and how refunds are processed for 
            digital game top-ups and in-game currency purchases.
          </p>
        </div>

        {/* Eligible Refunds */}
        <section className="mb-8 p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
          <h2 className="text-2xl font-bold text-goblin-fg mb-4">Eligible for Full Refund</h2>
          
          <div className="space-y-4 ml-9">
            <div className="p-4 rounded-lg bg-[#50fa7b]/5 border border-[#50fa7b]/20">
              <h3 className="text-lg font-semibold text-goblin-fg mb-2">1. Order Not Delivered</h3>
              <p className="text-goblin-fg/70 mb-2">
                If you do not receive your purchased items within <strong>30 minutes</strong> of successful 
                payment, you are eligible for a full refund.
              </p>
              <p className="text-sm text-goblin-fg/60">
                Note: 99% of orders are delivered within 2 minutes. The 30-minute guarantee covers rare 
                technical issues or delays.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#50fa7b]/5 border border-[#50fa7b]/20">
              <h3 className="text-lg font-semibold text-goblin-fg mb-2">2. Payment Processed, Order Failed</h3>
              <p className="text-goblin-fg/70 mb-2">
                If your payment was successfully deducted but the order failed to process or was marked 
                as "Failed" in our system, you will receive a full refund automatically.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#50fa7b]/5 border border-[#50fa7b]/20">
              <h3 className="text-lg font-semibold text-goblin-fg mb-2">3. Duplicate Payment</h3>
              <p className="text-goblin-fg/70 mb-2">
                If you were charged multiple times for the same order due to a technical error, we will 
                refund the duplicate charges immediately upon verification.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#50fa7b]/5 border border-[#50fa7b]/20">
              <h3 className="text-lg font-semibold text-goblin-fg mb-2">4. System or Technical Errors</h3>
              <p className="text-goblin-fg/70 mb-2">
                Refunds will be issued if the order failure was due to issues on our end or with our 
                authorized resellers (e.g., server downtime, API errors, etc.).
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#50fa7b]/5 border border-[#50fa7b]/20">
              <h3 className="text-lg font-semibold text-goblin-fg mb-2">5. Unauthorized Transactions</h3>
              <p className="text-goblin-fg/70 mb-2">
                If you report an unauthorized transaction from your account with valid proof, we will 
                investigate and issue a refund if confirmed.
              </p>
            </div>
          </div>
        </section>

        {/* Not Eligible */}
        <section className="mb-8 p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
          <h2 className="text-2xl font-bold text-goblin-fg mb-4">NOT Eligible for Refund</h2>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-[#ff6b6b]/5 border border-[#ff6b6b]/20">
              <h3 className="text-lg font-semibold text-goblin-fg mb-2">1. Successfully Delivered Orders</h3>
              <p className="text-goblin-fg/70 mb-2">
                Once in-game currency or items have been successfully credited to your game account, 
                the transaction is <strong>final and non-refundable</strong>. This is the nature of 
                digital products.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#ff6b6b]/5 border border-[#ff6b6b]/20">
              <h3 className="text-lg font-semibold text-goblin-fg mb-2">2. Incorrect Game ID/Player ID</h3>
              <p className="text-goblin-fg/70 mb-2">
                If you provided an incorrect Game ID and the items were delivered to that account, 
                we cannot process a refund. You are responsible for verifying your Game ID before purchase.
              </p>
              <p className="text-sm text-goblin-fg/60">
                Tip: Always double-check your Game ID using our verification feature before checkout!
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#ff6b6b]/5 border border-[#ff6b6b]/20">
              <h3 className="text-lg font-semibold text-goblin-fg mb-2">3. Change of Mind</h3>
              <p className="text-goblin-fg/70 mb-2">
                Digital products are non-refundable once delivered. If you changed your mind after 
                purchase, we cannot offer a refund.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#ff6b6b]/5 border border-[#ff6b6b]/20">
              <h3 className="text-lg font-semibold text-goblin-fg mb-2">4. Account Bans or Game Issues</h3>
              <p className="text-goblin-fg/70 mb-2">
                We are not responsible for issues with your game account (bans, suspensions, regional 
                restrictions). Refunds will not be issued for account-related problems beyond our control.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#ff6b6b]/5 border border-[#ff6b6b]/20">
              <h3 className="text-lg font-semibold text-goblin-fg mb-2">5. Promotional or Discounted Items</h3>
              <p className="text-goblin-fg/70 mb-2">
                Items purchased during special promotions or with discounts are subject to the same 
                refund policy. "Sale items" are not automatically non-refundable, but normal conditions apply.
              </p>
            </div>
          </div>
        </section>

        {/* Cancellations */}
        <section className="mb-8 p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
          <h2 className="text-2xl font-bold text-goblin-fg mb-4">Order Cancellations</h2>
          
          <div className="space-y-3 text-goblin-fg/70">
            <p>
              <strong>Can I cancel my order?</strong>
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Within 2 Minutes:</strong> If your order has not yet been processed by our 
                resellers, you may request cancellation. Contact support immediately.
              </li>
              <li>
                <strong>After Processing Begins:</strong> Once the order is sent to our authorized 
                resellers (usually within seconds), cancellation is not possible.
              </li>
              <li>
                <strong>Pending Payment:</strong> If payment is pending and you do not complete it, 
                the order will automatically expire after the payment window closes (typically 15 minutes).
              </li>
            </ul>
          </div>
        </section>

        {/* Refund Process */}
        <section className="mb-8 p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
          <h2 className="text-2xl font-bold text-goblin-fg mb-4">Refund Processing Timeline</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-goblin-fg mb-2">How to Request a Refund</h3>
              <ol className="list-decimal list-inside text-goblin-fg/70 space-y-2">
                <li>Contact support at <strong>support@gamesgoblin.com</strong> or call <strong>+91 91375 88392</strong></li>
                <li>Provide your Order Number and reason for refund request</li>
                <li>Our team will investigate within <strong>24 hours</strong></li>
                <li>If approved, refund will be initiated immediately</li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-goblin-fg mb-2">Refund Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#4ecdc4] mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-goblin-fg">UPI/Digital Wallets:</p>
                    <p className="text-goblin-fg/70">3-5 business days</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#4ecdc4] mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-goblin-fg">Credit/Debit Cards:</p>
                    <p className="text-goblin-fg/70">5-7 business days</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#4ecdc4] mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-goblin-fg">Net Banking:</p>
                    <p className="text-goblin-fg/70">5-7 business days</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-goblin-fg/60 mt-3">
                Note: Refund timelines depend on your bank/payment provider. We process refunds 
                immediately, but your bank may take additional time to credit your account.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-goblin-fg mb-2">Refund Method</h3>
              <p className="text-goblin-fg/70">
                All refunds are processed to the <strong>original payment method</strong> used for 
                the purchase. We do not offer refunds to alternative payment methods or accounts.
              </p>
            </div>
          </div>
        </section>

        {/* Dispute Resolution */}
        <section className="mb-8 p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
          <h2 className="text-2xl font-bold text-goblin-fg mb-4">Dispute Resolution</h2>
          
          <div className="space-y-3 text-goblin-fg/70">
            <p>
              If you disagree with a refund decision:
            </p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Reply to the support team's decision email with additional evidence/details</li>
              <li>We will escalate your case to senior management for review</li>
              <li>Final decision will be communicated within 3-5 business days</li>
              <li>Our decisions are based on transaction records, reseller confirmations, and game logs</li>
            </ol>
          </div>
        </section>

        {/* Fraudulent Claims */}
        <section className="mb-8 p-6 rounded-lg border border-[#ff6b6b]/30 bg-[#ff6b6b]/5">
          <h2 className="text-2xl font-bold text-goblin-fg mb-4">Fraudulent Refund Claims</h2>
          
          <div className="space-y-3 text-goblin-fg/70">
            <p>
              We take fraudulent refund requests very seriously. If we determine that a refund claim 
              is false or made in bad faith:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>The refund request will be denied</li>
              <li>Your account may be suspended or permanently banned</li>
              <li>We reserve the right to report fraudulent activity to authorities</li>
              <li>Legal action may be taken for significant fraud attempts</li>
            </ul>
          </div>
        </section>

        {/* Contact */}
        <section className="p-6 rounded-lg border border-[#4ecdc4]/30 bg-[#4ecdc4]/5">
          <h2 className="text-2xl font-bold text-goblin-fg mb-4">Need Help?</h2>
          <p className="text-goblin-fg/70 mb-4">
            For refund requests or questions about this policy:
          </p>
          <div className="space-y-3">
            <div className="text-goblin-fg/70">
              <span><strong>Email:</strong> support@gamesgoblin.com</span>
            </div>
            <div className="text-goblin-fg/70">
              <span><strong>Phone:</strong> +91 91375 88392 (9 AM - 9 PM IST)</span>
            </div>
          </div>
          <p className="text-sm text-goblin-fg/60 mt-4">
            Average response time: Under 5 minutes for urgent issues
          </p>
        </section>

        {/* Summary */}
        <div className="mt-12 p-6 rounded-lg border border-goblin-border/30 bg-goblin-bg-card">
          <h2 className="text-xl font-bold text-goblin-fg mb-4">Quick Summary</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="text-goblin-fg/70">
              ✓ Full refund if not delivered within 30 minutes
            </div>
            <div className="text-goblin-fg/70">
              ✓ Full refund for failed or duplicate payments
            </div>
            <div className="text-goblin-fg/70">
              ✗ No refunds after successful delivery
            </div>
            <div className="text-goblin-fg/70">
              ✗ No refunds for incorrect Game IDs
            </div>
            <div className="text-goblin-fg/70">
              ⏱ Refunds processed in 5-7 business days
            </div>
            <div className="text-goblin-fg/70">
              ⚠ Cancel within 2 minutes if not processed
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
