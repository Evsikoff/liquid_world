import { useState, useEffect } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isPortrait: boolean;
  screenWidth: number;
  screenHeight: number;
}

export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    if (typeof window === 'undefined') {
      return { isMobile: false, isPortrait: false, screenWidth: 1920, screenHeight: 1080 };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    return {
      isMobile: detectMobile(),
      isPortrait: height > width,
      screenWidth: width,
      screenHeight: height
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setDeviceInfo({
        isMobile: detectMobile(),
        isPortrait: height > width,
        screenWidth: width,
        screenHeight: height
      });
    };

    // Listen for resize and orientation change
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Initial check
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return deviceInfo;
};

// Detect mobile device using multiple methods
function detectMobile(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  // Check for touch capability combined with screen size
  const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth <= 1024;

  // User agent detection as fallback
  const userAgent = navigator.userAgent || navigator.vendor || '';
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
  const isMobileUserAgent = mobileRegex.test(userAgent);

  // Consider it mobile if:
  // 1. Has touch + small screen, OR
  // 2. User agent indicates mobile device
  return (hasTouchScreen && isSmallScreen) || isMobileUserAgent;
}

export default useDeviceDetection;
