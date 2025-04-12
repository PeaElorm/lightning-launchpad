// src/contexts/LightningContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import useLightning from '../hooks/useLightning';

// Create context with type safety
export const LightningContext = createContext<ReturnType<typeof useLightning> | undefined>(undefined);

interface LightningProviderProps {
  children: ReactNode;
  demoMode?: boolean;
}

export const LightningProvider: React.FC<LightningProviderProps> = ({ 
  children, 
  demoMode = true // Default to demo mode for hackathon
}) => {
  const lightningState = useLightning(demoMode);
  
  return (
    <LightningContext.Provider value={lightningState}>
      {children}
    </LightningContext.Provider>
  );
};

// Custom hook to use the Lightning context
export const useLightningContext = () => {
  const context = useContext(LightningContext);
  
  if (context === undefined) {
    throw new Error('useLightningContext must be used within a LightningProvider');
  }
  
  return context;
};