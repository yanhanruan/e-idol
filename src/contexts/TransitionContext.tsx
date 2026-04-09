import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { TransitionContextValue } from '../types';

const TransitionContext = createContext<TransitionContextValue | undefined>(undefined);

interface TransitionProviderProps {
  children: ReactNode;
}

export const TransitionProvider = ({ children }: TransitionProviderProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const startTransition = useCallback(
    (stateUpdateCallback?: () => void) => {
      if (isAnimating) return;

      setIsAnimating(true);

      // 1. Data switch point: 250ms
      // The CSS animation is fully black between 20% (120ms) and 60% (360ms).
      // We perform data updates / route navigation at this safe midpoint of 250ms.

      setTimeout(() => {
        if (stateUpdateCallback) {
          stateUpdateCallback();
        }
      }, 250);

      // 2. Post‑animation cleanup point: 650ms
      // Total duration of the CSS animation: 600ms.
      // The component is unmounted at 800ms to leave a small buffer, preventing the black layer from disappearing abruptly.

      setTimeout(() => {
        setIsAnimating(false);
      }, 800);
    },
    [isAnimating],
  );

  return <TransitionContext.Provider value={{ isAnimating, startTransition }}>{children}</TransitionContext.Provider>;
};

export const useTransition = (): TransitionContextValue => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransition must be used within TransitionProvider');
  }
  return context;
};
