
import { useEffect, useRef, useState, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';

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
  const appStateRef = useRef(AppState.currentState);

  const resetTimer = useCallback(() => {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityRef.current;
    
    // Only log if it's been more than 1 second since last activity to reduce noise
    if (timeSinceLastActivity > 1000) {
      console.log('Activity detected, resetting idle timer');
    }
    
    lastActivityRef.current = now;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (isIdle) {
      setIsIdle(false);
      onActive?.();
    }
    
    timeoutRef.current = setTimeout(() => {
      console.log('Device went idle after no activity for', timeout / 1000, 'seconds');
      setIsIdle(true);
      onIdle?.();
    }, timeout);
  }, [isIdle, onActive, onIdle, timeout]);

  const handleActivity = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    // Start the timer
    resetTimer();

    // Listen to app state changes to pause timer when app is backgrounded
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App has come to the foreground - reset timer
        console.log('App came to foreground, resetting idle timer');
        resetTimer();
      } else if (nextAppState.match(/inactive|background/)) {
        // App is going to background - clear timer
        console.log('App going to background, clearing idle timer');
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }
      appStateRef.current = nextAppState;
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      subscription.remove();
    };
  }, [resetTimer]);

  return {
    isIdle,
    resetTimer: handleActivity,
  };
}
