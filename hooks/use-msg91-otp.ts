"use client";

import { useEffect, useState } from 'react';

// Extend Window interface to include MSG91 methods
declare global {
  interface Window {
    sendOtp?: (
      identifier: string,
      successCallback?: (data: any) => void,
      failureCallback?: (error: any) => void
    ) => void;
    verifyOtp?: (
      otp: string,
      successCallback?: (data: any) => void,
      failureCallback?: (error: any) => void,
      reqId?: string
    ) => void;
    retryOtp?: (
      channel: string | null,
      successCallback?: (data: any) => void,
      failureCallback?: (error: any) => void,
      reqId?: string
    ) => void;
    getWidgetData?: () => any;
    isCaptchaVerified?: () => boolean;
    initSendOTP?: (config: MSG91Config) => void;
  }
}

interface MSG91Config {
  widgetId: string;
  tokenAuth: string;
  identifier?: string;
  exposeMethods: boolean;
  captchaRenderId?: string;
  success?: (data: any) => void;
  failure?: (error: any) => void;
}

export function useMSG91OTP() {
  const [isReady, setIsReady] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check if MSG91 script is loaded
    let attempts = 0;
    const maxAttempts = 50; // Wait up to 5 seconds
    
    const checkMSG91 = setInterval(() => {
      attempts++;
      
      if (window.initSendOTP) {
        setIsReady(true);
        clearInterval(checkMSG91);
        console.log('✅ MSG91 SDK detected after', attempts * 100, 'ms');
      } else if (attempts >= maxAttempts) {
        clearInterval(checkMSG91);
        console.error('❌ MSG91 SDK not loaded after 5 seconds');
        console.error('📝 Check if https://verify.msg91.com/otp-provider.js is accessible');
      }
    }, 100);

    return () => clearInterval(checkMSG91);
  }, []);

  const initializeMSG91 = (config: Partial<MSG91Config> = {}) => {
    if (!isReady || isInitialized) return;

    const widgetId = process.env.NEXT_PUBLIC_MSG91_WIDGET_ID || '';
    const tokenAuth = process.env.NEXT_PUBLIC_MSG91_AUTH_TOKEN || '';

    if (!widgetId || !tokenAuth) {
      console.error('❌ MSG91 credentials not configured!');
      console.error('📝 Add to .env.local:');
      console.error('   NEXT_PUBLIC_MSG91_WIDGET_ID=your_widget_id');
      console.error('   NEXT_PUBLIC_MSG91_AUTH_TOKEN=your_auth_token');
      console.error('📖 See MSG91_SETUP.md for detailed setup instructions');
      return;
    }

    const defaultConfig: MSG91Config = {
      widgetId,
      tokenAuth,
      exposeMethods: true,
      ...config,
    };

    if (window.initSendOTP) {
      window.initSendOTP(defaultConfig);
      setIsInitialized(true);
      console.log('✅ MSG91 OTP initialized successfully');
      console.log('📱 Widget ID:', widgetId.substring(0, 8) + '...');
    }
  };

  const sendOTP = (phone: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!window.sendOtp) {
        reject(new Error('MSG91 not initialized'));
        return;
      }

      // Format phone: country code + number (e.g., 919137588392)
      const formattedPhone = phone.startsWith('91') ? phone : `91${phone}`;

      window.sendOtp(
        formattedPhone,
        (data) => {
          console.log('✅ OTP sent successfully:', data);
          resolve(data);
        },
        (error) => {
          console.error('❌ Failed to send OTP:', error);
          reject(error);
        }
      );
    });
  };

  const verifyOTP = (otp: string, reqId?: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!window.verifyOtp) {
        reject(new Error('MSG91 not initialized'));
        return;
      }

      window.verifyOtp(
        otp,
        (data) => {
          console.log('✅ OTP verified successfully:', data);
          resolve(data);
        },
        (error) => {
          console.error('❌ OTP verification failed:', error);
          reject(error);
        },
        reqId
      );
    });
  };

  const resendOTP = (channel: string | null = null, reqId?: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!window.retryOtp) {
        reject(new Error('MSG91 not initialized'));
        return;
      }

      window.retryOtp(
        channel,
        (data) => {
          console.log('✅ OTP resent successfully:', data);
          resolve(data);
        },
        (error) => {
          console.error('❌ Failed to resend OTP:', error);
          reject(error);
        },
        reqId
      );
    });
  };

  return {
    isReady,
    isInitialized,
    initializeMSG91,
    sendOTP,
    verifyOTP,
    resendOTP,
  };
}
