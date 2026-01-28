'use client';

import { useState, useEffect, useCallback } from 'react';
import type { PhantomProvider } from '@/types';

interface UsePhantomReturn {
  isPhantomInstalled: boolean;
  isConnected: boolean;
  isConnecting: boolean;
  publicKey: string | null;
  connect: () => Promise<string | null>;
  disconnect: () => Promise<void>;
  error: string | null;
}

function getPhantomProvider(): PhantomProvider | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const provider = window.solana;

  if (provider?.isPhantom) {
    return provider;
  }

  return null;
}

export function usePhantom(): UsePhantomReturn {
  const [isPhantomInstalled, setIsPhantomInstalled] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if Phantom is installed on mount
  useEffect(() => {
    const provider = getPhantomProvider();
    setIsPhantomInstalled(!!provider);

    // Check if already connected
    if (provider?.isConnected && provider.publicKey) {
      setIsConnected(true);
      setPublicKey(provider.publicKey.toString());
    }
  }, []);

  // Listen for account changes
  useEffect(() => {
    const provider = getPhantomProvider();
    if (!provider) return;

    const handleAccountChanged = (publicKey: unknown) => {
      if (publicKey && typeof publicKey === 'object' && 'toString' in publicKey) {
        setPublicKey((publicKey as { toString: () => string }).toString());
        setIsConnected(true);
      } else {
        setPublicKey(null);
        setIsConnected(false);
      }
    };

    const handleDisconnect = () => {
      setPublicKey(null);
      setIsConnected(false);
    };

    provider.on('accountChanged', handleAccountChanged);
    provider.on('disconnect', handleDisconnect);

    return () => {
      provider.off('accountChanged', handleAccountChanged);
      provider.off('disconnect', handleDisconnect);
    };
  }, []);

  const connect = useCallback(async (): Promise<string | null> => {
    const provider = getPhantomProvider();

    if (!provider) {
      setError('Phantom wallet is not installed');
      return null;
    }

    try {
      setIsConnecting(true);
      setError(null);

      const response = await provider.connect();
      const address = response.publicKey.toString();

      setPublicKey(address);
      setIsConnected(true);

      return address;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to Phantom';

      // Handle user rejection
      if (errorMessage.includes('User rejected')) {
        setError('Connection rejected by user');
      } else {
        setError(errorMessage);
      }

      return null;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async (): Promise<void> => {
    const provider = getPhantomProvider();

    if (!provider) {
      return;
    }

    try {
      await provider.disconnect();
      setPublicKey(null);
      setIsConnected(false);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to disconnect';
      setError(errorMessage);
    }
  }, []);

  return {
    isPhantomInstalled,
    isConnected,
    isConnecting,
    publicKey,
    connect,
    disconnect,
    error,
  };
}
