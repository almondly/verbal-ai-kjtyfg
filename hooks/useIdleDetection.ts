
import { useEffect, useRef, useState } from 'react';

interface UseIdleDetectionProps {
  timeout?: number; // milliseconds
  onIdle?: () => void;
  onActive?: () => void;
}

export function useIdleDetection({ 
  timeout = 30000, // 30 seconds default
  onIdle,
  onActive 
}: UseIdleDetectionProps = {}) {
  const [isIdle, setIsIdle] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef(Date.now());

  const resetTimer = () => {
    console.log('Activity detected, resetting idle timer');
    lastActivityRef.current = Date.now();
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (isIdle) {
      setIsIdle(false);
      onActive?.();
    }
    
    timeoutRef.current = setTimeout(() => {
      console.log('Device went idle');
      setIsIdle(true);
      onIdle?.();
    }, timeout);
  };

  const handleActivity = () => {
    resetTimer();
  };

  useEffect(() => {
    // Start the timer
    resetTimer();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [timeout]);

  return {
    isIdle,
    resetTimer: handleActivity,
  };
}
