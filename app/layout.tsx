import type { Metadata } from "next";
import { Poppins, Quicksand } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { UserAuthProvider } from "@/contexts/UserAuthContext";
import { Toaster } from "@/components/ui/sonner";
import { StoreProvider } from "@/components/StoreProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://gamesgoblin.com'),
  title: "GamesGoblin - Ultimate Game Top-up Destination",
  description: "Get instant top-ups for your favorite games! PUBG, Free Fire, Genshin Impact & more. Fast delivery, best prices, goblin-approved deals!",
  keywords: "game top-up, mobile gaming, PUBG, Free Fire, Genshin Impact, gaming currency, instant delivery",
  icons: {
    icon: '/goblin.png',
    apple: '/goblin.png',
  },
  openGraph: {
    title: "GamesGoblin - Ultimate Game Top-up Destination",
    description: "Get instant top-ups for your favorite games! Fast delivery, best prices, goblin-approved deals!",
    images: ['/goblin.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "GamesGoblin - Ultimate Game Top-up Destination",
    description: "Get instant top-ups for your favorite games! Fast delivery, best prices, goblin-approved deals!",
    images: ['/goblin.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body 
        className={`${poppins.variable} ${quicksand.variable} antialiased min-h-screen bg-goblin-bg text-goblin-fg`}
        style={{ fontFamily: 'var(--font-poppins), system-ui, sans-serif' }}
        suppressHydrationWarning
      >
        {/* MSG91 OTP Widget - Load before React hydration */}
        <Script
          src="https://verify.msg91.com/otp-provider.js"
          strategy="beforeInteractive"
        />
        
        <StoreProvider>
          <UserAuthProvider>
            {children}
          </UserAuthProvider>
        </StoreProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}