"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Phone,
  Shield, 
  ArrowRight,
  Clock,
  CheckCircle
} from "lucide-react";
import { useUserAuth } from "@/contexts/UserAuthContext";

interface AuthProps {
  onClose?: () => void;
}

export function AuthModal({ onClose }: AuthProps) {
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const auth = useUserAuth();

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length >= 10) {
      setStep('otp');
      // Start countdown timer
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length === 6) {
      setLoading(true);
      setError(null);
      
      try {
        if (auth && typeof auth.loginUser === 'function') {
          const resp = await auth.loginUser(phoneNumber, otpCode);
          if (resp.ok && resp.user) {
            setStep('success');
            setTimeout(() => onClose?.(), 1200);
            return;
          } else {
            // Show error message
            setError(resp.error || 'Invalid OTP or phone number not registered');
            return;
          }
        }
      } catch (err) {
        console.error('login error', err);
        setError('Login failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto bg-white">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Phone className="w-8 h-8 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 'phone' && 'Login to GameGoblin'}
            {step === 'otp' && 'Verify Your Number'}
            {step === 'success' && 'Welcome Back!'}
          </h2>
          <p className="text-gray-600 mt-2">
            {step === 'phone' && 'Enter your phone number to get started'}
            {step === 'otp' && `We sent a code to ${phoneNumber}`}
            {step === 'success' && 'Login successful! Redirecting...'}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">+91</span>
                  </div>
                  <Input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-12 text-lg"
                    maxLength={10}
                  />
                </div>
              </div>

              <Button 
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3"
                disabled={phoneNumber.length < 10}
              >
                Send OTP
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Shield className="w-4 h-4" />
                <span>Your number is safe and secure with us</span>
              </div>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Enter 6-digit OTP
                </label>
                <div className="flex space-x-2 justify-center">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-12 h-12 text-center text-xl font-bold border-2 focus:border-orange-500"
                      maxLength={1}
                    />
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600 text-center">{error}</p>
                </div>
              )}

              <Button 
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3"
                disabled={otp.join('').length !== 6 || loading}
              >
                {loading ? 'Verifying...' : 'Verify & Login'}
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Didn't receive the code?
                </p>
                {countdown > 0 ? (
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>Resend in {countdown}s</span>
                  </div>
                ) : (
                  <Button 
                    variant="ghost" 
                    className="text-orange-500 hover:text-orange-600"
                    onClick={() => {
                      setCountdown(60);
                      // Restart countdown
                    }}
                  >
                    Resend OTP
                  </Button>
                )}
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600">
                You're all set! Redirecting to your dashboard...
              </p>
            </div>
          )}

          {/* Terms */}
          <div className="text-center text-xs text-gray-500 border-t pt-4">
            By continuing, you agree to our{' '}
            <a href="#" className="text-orange-500 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-orange-500 hover:underline">Privacy Policy</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Usage example component
export function AuthExample() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="p-8">
      <Button 
        onClick={() => setShowAuth(true)}
        className="bg-orange-500 hover:bg-orange-600 text-white"
      >
        Demo Login/Register
      </Button>
      
      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} />
      )}
    </div>
  );
}