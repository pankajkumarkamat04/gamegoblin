"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, AlertCircle, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get('order');
  
  const [status, setStatus] = useState<'verifying' | 'processing' | 'completed' | 'failed' | 'paid_but_failed' | 'not_initiated'>('verifying');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (!orderNumber) {
      router.push('/orders');
      return;
    }

    let pollCount = 0;
    const maxPolls = 60; // Poll for up to 3 minutes

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/proxy?path=/api/payments/status/${orderNumber}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const data = await response.json();
        
        // Handle "Payment not initiated" error
        if (!data.success && data.message?.includes('Payment not initiated')) {
          setStatus('not_initiated');
          setErrorMessage(data.message);
          return true; // Stop polling
        }
        
        if (data.success && data.data) {
          const { paymentStatus, orderStatus } = data.data;
          
          if (paymentStatus === 'paid' && orderStatus === 'completed') {
            setStatus('completed');
            setOrderDetails(data.data);
            return true; // Stop polling
          } else if (paymentStatus === 'paid' && (orderStatus === 'processing' || orderStatus === 'pending')) {
            setStatus('processing');
            setOrderDetails(data.data);
            // Continue polling
          } else if (paymentStatus === 'paid' && orderStatus === 'failed') {
            // Special case: Payment succeeded but order fulfillment failed
            setStatus('paid_but_failed');
            setOrderDetails(data.data);
            setErrorMessage(data.data.errorMessage || 'Order fulfillment failed. Your payment was successful.');
            return true; // Stop polling
          } else if (paymentStatus === 'failed' || orderStatus === 'failed') {
            setStatus('failed');
            setOrderDetails(data.data);
            setErrorMessage(data.data.errorMessage || 'Payment processing failed');
            return true; // Stop polling
          }
        } else if (!data.success) {
          // Handle other errors
          setStatus('failed');
          setErrorMessage(data.message || 'Unable to verify payment status');
          return true;
        }
        
        pollCount++;
        return pollCount >= maxPolls;
        
      } catch (error) {
        console.error('Failed to check status:', error);
        pollCount++;
        
        if (pollCount >= maxPolls) {
          setStatus('failed');
          setErrorMessage('Unable to verify payment status. Please check your orders.');
          return true;
        }
        
        return false;
      }
    };

    // Check immediately
    checkStatus().then(shouldStop => {
      if (shouldStop) return;
      
      // Then poll every 3 seconds
      const interval = setInterval(async () => {
        const shouldStop = await checkStatus();
        if (shouldStop) {
          clearInterval(interval);
        }
      }, 3000);
      
      return () => clearInterval(interval);
    });
  }, [orderNumber, router]);

  // VERIFYING STATE - Clean spinner
  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-goblin-bg flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-[#4ecdc4]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#4ecdc4] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-goblin-fg mb-2">
            Verifying Payment
          </h2>
          <p className="text-goblin-fg/60 text-sm">
            Please wait while we confirm your transaction
          </p>
        </div>
      </div>
    );
  }

  // PROCESSING STATE - Payment confirmed, order being fulfilled
  if (status === 'processing') {
    return (
      <div className="min-h-screen bg-goblin-bg flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          {/* Smooth checkmark animation */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-[#4ecdc4]/10 rounded-full"></div>
            <CheckCircle2 className="w-20 h-20 text-[#4ecdc4]" strokeWidth={1.5} />
          </div>
          
          <h2 className="text-2xl font-semibold text-goblin-fg mb-2">
            Payment Confirmed
          </h2>
          <p className="text-goblin-fg/60 mb-6">
            Your order is now being processed with the game provider
          </p>
          
          {/* Order Details */}
          <div className="bg-goblin-bg-card border border-goblin-border/30 rounded-lg p-5 mb-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-goblin-fg/60">Order Number</span>
                <span className="text-[#4ecdc4] font-mono font-medium">{orderNumber}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-goblin-fg/60">Payment Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#50fa7b] rounded-full"></div>
                  <span className="text-[#50fa7b]">Paid</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-goblin-fg/60">Order Status</span>
                <div className="flex items-center gap-2">
                  <div className="relative w-1.5 h-1.5">
                    <div className="absolute inset-0 bg-[#f1fa8c] rounded-full animate-ping"></div>
                    <div className="relative w-1.5 h-1.5 bg-[#f1fa8c] rounded-full"></div>
                  </div>
                  <span className="text-[#f1fa8c]">Processing</span>
                </div>
              </div>
              {orderDetails?.txnId && (
                <div className="pt-3 border-t border-goblin-border/20">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-goblin-fg/50">Transaction ID</span>
                    <span className="text-goblin-fg/70 font-mono">{orderDetails.txnId}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info message */}
          <div className="bg-[#4ecdc4]/5 border border-[#4ecdc4]/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-goblin-fg/70 leading-relaxed">
              This usually takes <span className="font-medium text-goblin-fg">5 sec - 2 mins</span>
            </p>
            <p className="text-xs text-goblin-fg/60 mt-2">
              Note: During event time the order might surge and orders might process for more time
            </p>
          </div>
          
          <div className="flex gap-3 justify-center">
            <Link href="/orders">
              <Button className="bg-[#4ecdc4] hover:bg-[#4ecdc4]/90 text-black font-medium">
                View My Orders
              </Button>
            </Link>
            <Link href="/support">
              <Button variant="outline" className="border-goblin-border text-goblin-fg hover:bg-goblin-bg-card">
                Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // COMPLETED STATE - Order successfully delivered
  if (status === 'completed') {
    return (
      <div className="min-h-screen bg-goblin-bg flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          {/* Success icon - no jumping, just clean display */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-[#50fa7b]/10 rounded-full"></div>
            <CheckCircle2 className="w-20 h-20 text-[#50fa7b]" strokeWidth={1.5} />
          </div>
          
          <h2 className="text-2xl font-semibold text-goblin-fg mb-2">
            Order Completed
          </h2>
          <p className="text-goblin-fg/60 mb-6">
            Your order has been successfully processed and delivered
          </p>
          
          {/* Order Details */}
          <div className="bg-goblin-bg-card border border-[#50fa7b]/20 rounded-lg p-5 mb-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-goblin-fg/60">Order Number</span>
                <span className="text-[#50fa7b] font-mono font-medium">{orderNumber}</span>
              </div>
              {orderDetails?.txnId && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-goblin-fg/50">Transaction ID</span>
                  <span className="text-goblin-fg/70 font-mono">{orderDetails.txnId}</span>
                </div>
              )}
              {orderDetails?.utr && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-goblin-fg/50">UTR Number</span>
                  <span className="text-goblin-fg/70 font-mono">{orderDetails.utr}</span>
                </div>
              )}
            </div>
          </div>

          {/* Success message */}
          <div className="bg-[#50fa7b]/5 border border-[#50fa7b]/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-goblin-fg/70 leading-relaxed">
              Your in-game items have been delivered. Check your game account to confirm receipt.
            </p>
          </div>
          
          <div className="flex gap-3 justify-center">
            <Link href="/orders">
              <Button className="bg-[#4ecdc4] hover:bg-[#4ecdc4]/90 text-black font-medium">
                View Order Details
              </Button>
            </Link>
            <Link href="/games">
              <Button variant="outline" className="border-goblin-border text-goblin-fg hover:bg-goblin-bg-card">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // NOT INITIATED STATE - Payment was never initiated
  if (status === 'not_initiated') {
    return (
      <div className="min-h-screen bg-goblin-bg flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-[#f1fa8c]/10 rounded-full"></div>
            <ShoppingBag className="w-20 h-20 text-[#f1fa8c]" strokeWidth={1.5} />
          </div>
          
          <h2 className="text-2xl font-semibold text-goblin-fg mb-2">
            Payment Not Initiated
          </h2>
          <p className="text-goblin-fg/60 mb-6">
            This order has not been paid for yet
          </p>
          
          {/* Order Details */}
          <div className="bg-goblin-bg-card border border-[#f1fa8c]/20 rounded-lg p-5 mb-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-goblin-fg/60">Order Number</span>
                <span className="text-goblin-fg font-mono">{orderNumber}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-goblin-fg/60">Status</span>
                <span className="text-[#f1fa8c]">Awaiting Payment</span>
              </div>
            </div>
          </div>

          {/* Info message */}
          <div className="bg-[#f1fa8c]/5 border border-[#f1fa8c]/20 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#f1fa8c] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-goblin-fg/70 leading-relaxed text-left">
                To complete your order, please return to the games page and initiate payment through the checkout process.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 justify-center">
            <Link href="/games">
              <Button className="bg-[#4ecdc4] hover:bg-[#4ecdc4]/90 text-black font-medium">
                Browse Games
              </Button>
            </Link>
            <Link href="/orders">
              <Button variant="outline" className="border-goblin-border text-goblin-fg hover:bg-goblin-bg-card">
                View My Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // PAID BUT FAILED STATE - Payment succeeded but order fulfillment failed
  if (status === 'paid_but_failed') {
    const handleRetryFulfillment = async () => {
      setRetrying(true);
      try {
        const response = await fetch(`/api/proxy?path=/api/orders/retry-fulfillment/${orderNumber}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Start polling again
          setStatus('processing');
          setErrorMessage('');
        } else {
          setErrorMessage(data.message || 'Failed to retry order fulfillment');
        }
      } catch (error) {
        console.error('Retry failed:', error);
        setErrorMessage('Failed to retry order fulfillment. Please contact support.');
      } finally {
        setRetrying(false);
      }
    };

    return (
      <div className="min-h-screen bg-goblin-bg flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-[#f1fa8c]/10 rounded-full"></div>
            <AlertCircle className="w-20 h-20 text-[#f1fa8c]" strokeWidth={1.5} />
          </div>
          
          <h2 className="text-2xl font-semibold text-goblin-fg mb-2">
            Order Fulfillment Failed
          </h2>
          <p className="text-goblin-fg/60 mb-6">
            Your payment was successful, but we couldn't process your order
          </p>
          
          {/* Order Details */}
          <div className="bg-goblin-bg-card border border-[#f1fa8c]/20 rounded-lg p-5 mb-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-goblin-fg/60">Order Number</span>
                <span className="text-[#f1fa8c] font-mono font-medium">{orderNumber}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-goblin-fg/60">Payment Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#50fa7b] rounded-full"></div>
                  <span className="text-[#50fa7b]">Paid</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-goblin-fg/60">Order Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#ff6b6b] rounded-full"></div>
                  <span className="text-[#ff6b6b]">Failed</span>
                </div>
              </div>
              {orderDetails?.txnId && (
                <div className="pt-3 border-t border-goblin-border/20">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-goblin-fg/50">Transaction ID</span>
                    <span className="text-goblin-fg/70 font-mono">{orderDetails.txnId}</span>
                  </div>
                </div>
              )}
              {errorMessage && (
                <div className="pt-3 border-t border-goblin-border/20">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[#ff6b6b] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[#ff6b6b] text-left leading-relaxed">{errorMessage}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info message */}
          <div className="bg-[#f1fa8c]/5 border border-[#f1fa8c]/20 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#f1fa8c] flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm text-goblin-fg/70 leading-relaxed mb-2">
                  <strong className="text-goblin-fg">Your money is safe!</strong> The payment was successful, but we couldn't complete your order due to a technical issue (possibly low balance with our supplier).
                </p>
                <p className="text-sm text-goblin-fg/70 leading-relaxed">
                  Click "Retry Order" to try processing your order again, or contact support for a refund.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 justify-center">
            <Button 
              onClick={handleRetryFulfillment}
              disabled={retrying}
              className="bg-[#4ecdc4] hover:bg-[#4ecdc4]/90 text-black font-medium"
            >
              {retrying ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin mr-2"></div>
                  Retrying...
                </>
              ) : (
                'Retry Order'
              )}
            </Button>
            <Link href="/support">
              <Button variant="outline" className="border-goblin-border text-goblin-fg hover:bg-goblin-bg-card">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // FAILED STATE - Payment or order processing failed
  return (
    <div className="min-h-screen bg-goblin-bg flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 bg-[#ff6b6b]/10 rounded-full"></div>
          <XCircle className="w-20 h-20 text-[#ff6b6b]" strokeWidth={1.5} />
        </div>
        
        <h2 className="text-2xl font-semibold text-goblin-fg mb-2">
          Payment Failed
        </h2>
        <p className="text-goblin-fg/60 mb-6">
          We encountered an issue processing your payment
        </p>
        
        {/* Order Details */}
        <div className="bg-goblin-bg-card border border-[#ff6b6b]/20 rounded-lg p-5 mb-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-goblin-fg/60">Order Number</span>
              <span className="text-goblin-fg font-mono">{orderNumber}</span>
            </div>
            {errorMessage && (
              <div className="pt-3 border-t border-goblin-border/20">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-[#ff6b6b] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[#ff6b6b] text-left leading-relaxed">{errorMessage}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Help message */}
        <div className="bg-[#ff6b6b]/5 border border-[#ff6b6b]/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-goblin-fg/70 leading-relaxed">
            Please try placing your order again. If the issue persists, contact our support team for assistance.
          </p>
        </div>
        
        <div className="flex gap-3 justify-center">
          <Link href="/games">
            <Button className="bg-[#4ecdc4] hover:bg-[#4ecdc4]/90 text-black font-medium">
              Try Again
            </Button>
          </Link>
          <Link href="/support">
            <Button variant="outline" className="border-goblin-border text-goblin-fg hover:bg-goblin-bg-card">
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-goblin-bg flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-[#4ecdc4]/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#4ecdc4] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
