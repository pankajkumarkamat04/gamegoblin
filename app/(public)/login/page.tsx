"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Smartphone, KeyRound, Loader2, CheckCircle2, AlertCircle, ArrowRight, User, Mail } from "lucide-react";
import { buildAPIURL } from "@/lib/utils";
import Image from "next/image";

type AuthStep = 'phone' | 'otp' | 'register' | 'success';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useUserAuth();

    const [step, setStep] = useState<AuthStep>('phone');
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");

    // Registration fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const setLoadingTimeout = () => {
        clearTimeout(loadingTimeoutRef.current!);
        loadingTimeoutRef.current = setTimeout(() => {
            setLoading(false);
            setError('Request timeout. Please try again.');
        }, 30000);
    };

    const clearLoadingTimeout = () => {
        if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
            loadingTimeoutRef.current = null;
        }
    };

    const handleSendOTP = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!phone || phone.length !== 10) {
            setError("Please enter a valid 10-digit mobile number");
            return;
        }

        setError("");
        setLoading(true);
        setLoadingTimeout();

        try {
            const response = await fetch(buildAPIURL("/api/v1/user/send-otp"), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone })
            });

            const data = await response.json();
            console.log('Send OTP Response:', data); // Debug log

            // Accept if response is OK (200) regardless of data.success
            if (response.ok) {
                setStep('otp');
            } else {
                throw new Error(data.message || data.msg || 'Failed to send OTP');
            }
        } catch (err: any) {
            console.error('Send OTP error:', err);
            setError(err.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
            clearLoadingTimeout();
        }
    };

    const handleVerifyOTP = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!otp || otp.length !== 6) {
            setError("Please enter the 6-digit OTP");
            return;
        }

        setError("");
        setLoading(true);
        setLoadingTimeout();

        try {
            // Use /api/v1/user/verify-otp as requested
            const response = await fetch(buildAPIURL("/api/v1/user/verify-otp"), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, otp })
            });

            const data = await response.json();
            console.log('Verify OTP Response:', data); // Debug log

            // Check if response is OK (200)
            if (!response.ok) {
                throw new Error(data.message || data.msg || 'OTP verification failed');
            }

            // Check for registration requirement
            if (data.requiresRegistration || data.isNewUser || data.message?.includes('registration')) {
                // New user detected, proceed to registration
                setStep('register');
            } else if (data.token && data.user) {
                // Existing user, login immediately
                login(data.user, data.token);
                setStep('success');
                setTimeout(() => {
                    router.push("/");
                }, 1500);
            } else {
                // OTP verified but unclear next step - assume registration needed
                setStep('register');
            }
        } catch (err: any) {
            console.error('Verify OTP error:', err);
            setError(err.message || 'OTP verification failed');
        } finally {
            setLoading(false);
            clearLoadingTimeout();
        }
    };

    const handleCompleteRegistration = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email) {
            setError("Please fill in all fields");
            return;
        }

        setError("");
        setLoading(true);
        setLoadingTimeout();

        try {
            const response = await fetch(buildAPIURL("/api/v1/user/complete-registration"), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone,
                    name,
                    email
                })
            });

            const data = await response.json();

            console.log('Registration Response:', data); // Debug log

            // Accept if response is OK (200)
            if (response.ok && data.token && data.user) {
                // Registration successful
                login(data.user, data.token);
                setStep('success');
                setTimeout(() => {
                    router.push("/");
                }, 1500);
            } else if (response.ok) {
                // Registration successful but might need to fetch user data
                setStep('success');
                setTimeout(() => {
                    router.push("/");
                }, 1500);
            } else {
                throw new Error(data.message || data.msg || 'Registration failed');
            }
        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
            clearLoadingTimeout();
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 relative overflow-hidden bg-goblin-bg">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-goblin-green/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-goblin-purple/10 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="relative h-20 w-48 mx-auto mb-4">
                        <Image
                            src="/logo-with-text.svg"
                            alt="GamesGoblin"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-goblin-fg tracking-tight">
                        {step === 'phone' && 'Welcome Back!'}
                        {step === 'otp' && 'Verify Your Number'}
                        {step === 'register' && 'Complete Profile'}
                        {step === 'success' && 'You are all set!'}
                    </h1>
                    <p className="text-goblin-fg/60 mt-2">
                        {step === 'phone' && 'Enter your mobile number to continue'}
                        {step === 'otp' && `Enter the OTP sent to +91 ${phone}`}
                        {step === 'register' && 'Tell us a bit about yourself'}
                        {step === 'success' && 'Redirecting you to home...'}
                    </p>
                </div>

                <div className="bg-goblin-bg-card/50 backdrop-blur-xl border border-goblin-border/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                    {/* Top highlight line */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-goblin-border to-transparent opacity-50"></div>

                    {step === 'phone' && (
                        <form onSubmit={handleSendOTP} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-goblin-fg">Mobile Number</Label>
                                <div className="flex gap-2">
                                    <div className="flex items-center justify-center w-14 border border-goblin-border/30 rounded-xl bg-goblin-bg/50 text-goblin-fg/80 font-medium text-sm">
                                        +91
                                    </div>
                                    <div className="relative flex-1">
                                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-goblin-fg/40" />
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="Enter 10-digit number"
                                            value={phone}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '');
                                                if (value.length <= 10) setPhone(value);
                                            }}
                                            className="pl-9 h-12 bg-goblin-bg/50 border-goblin-border/30 text-goblin-fg placeholder:text-goblin-fg/30 rounded-xl focus-visible:ring-goblin-green/50"
                                            maxLength={10}
                                            autoFocus
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            </div>


                            <Button
                                type="submit"
                                disabled={loading || phone.length !== 10}
                                className="w-full h-14 text-base font-bold bg-gradient-to-r from-goblin-green to-emerald-600 text-white rounded-2xl shadow-2xl shadow-goblin-green/30 hover:shadow-goblin-green/50 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span>Sending OTP...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Smartphone className="h-5 w-5" />
                                            <span>Get OTP</span>
                                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </span>
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            </Button>
                        </form>
                    )}


                    {step === 'otp' && (
                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="otp" className="text-goblin-fg">Enter OTP</Label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setStep('phone');
                                            setOtp("");
                                            setError("");
                                        }}
                                        className="text-xs text-goblin-green hover:underline"
                                        disabled={loading}
                                    >
                                        Change Number
                                    </button>
                                </div>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-goblin-fg/40" />
                                    <Input
                                        id="otp"
                                        type="text"
                                        placeholder="Enter 6-digit OTP"
                                        value={otp}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            if (value.length <= 6) setOtp(value);
                                        }}
                                        className="pl-9 h-12 bg-goblin-bg/50 border-goblin-border/30 text-goblin-fg placeholder:text-goblin-fg/30 rounded-xl focus-visible:ring-goblin-green/50 tracking-widest"
                                        maxLength={6}
                                        autoFocus
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading || otp.length !== 6}
                                className="w-full h-14 text-base font-bold bg-gradient-to-r from-goblin-green to-emerald-600 text-white rounded-2xl shadow-2xl shadow-goblin-green/30 hover:shadow-goblin-green/50 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span>Verifying...</span>
                                        </>
                                    ) : (
                                        <>
                                            <KeyRound className="h-5 w-5" />
                                            <span>Verify & Login</span>
                                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </span>
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            </Button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={(e) => handleSendOTP(e)}
                                    disabled={loading}
                                    className="text-xs text-goblin-fg/40 hover:text-goblin-fg transition-colors"
                                >
                                    Resend OTP
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 'register' && (
                        <form onSubmit={handleCompleteRegistration} className="space-y-4">
                            {/* Name Input */}
                            <div className="space-y-1">
                                <Label htmlFor="name" className="text-goblin-fg">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-goblin-fg/40" />
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-9 h-12 bg-goblin-bg/50 border-goblin-border/30 text-goblin-fg placeholder:text-goblin-fg/30 rounded-xl focus-visible:ring-goblin-green/50"
                                        disabled={loading}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div className="space-y-1">
                                <Label htmlFor="email" className="text-goblin-fg">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-goblin-fg/40" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-9 h-12 bg-goblin-bg/50 border-goblin-border/30 text-goblin-fg placeholder:text-goblin-fg/30 rounded-xl focus-visible:ring-goblin-green/50"
                                        disabled={loading}
                                        required
                                    />
                                </div>
                            </div>




                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 text-base font-bold bg-gradient-to-r from-goblin-green to-emerald-600 text-white rounded-2xl shadow-2xl shadow-goblin-green/30 hover:shadow-goblin-green/50 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span>Creating Account...</span>
                                        </>
                                    ) : (
                                        <>
                                            <User className="h-5 w-5" />
                                            <span>Complete Registration</span>
                                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </span>
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            </Button>
                        </form>
                    )}

                    {step === 'success' && (
                        <div className="py-8 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4 text-green-500">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <p className="text-goblin-fg font-medium">Authentication Successful!</p>
                        </div>
                    )}

                    {error && (
                        <div className="mt-6 flex gap-2 items-start p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400 animate-in fade-in slide-in-from-top-1">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
