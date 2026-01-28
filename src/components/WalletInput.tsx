'use client';

import { useState, useEffect } from 'react';
import { isValidSolanaAddress } from '@/lib/utils';
import { usePhantom } from '@/hooks/usePhantom';

interface WalletInputProps {
  onSubmit: (address: string) => void;
  isLoading: boolean;
}

export default function WalletInput({ onSubmit, isLoading }: WalletInputProps) {
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const {
    isPhantomInstalled,
    isConnected,
    isConnecting,
    publicKey,
    connect,
    disconnect,
    error: phantomError,
  } = usePhantom();

  // Update address when wallet connects
  useEffect(() => {
    if (publicKey) {
      setAddress(publicKey);
      setError('');
    }
  }, [publicKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedAddress = address.trim();

    if (!trimmedAddress) {
      setError('Please enter a wallet address');
      return;
    }

    if (!isValidSolanaAddress(trimmedAddress)) {
      setError('Invalid Solana wallet address');
      return;
    }

    onSubmit(trimmedAddress);
  };

  const handleConnect = async () => {
    if (!isPhantomInstalled) {
      window.open('https://phantom.app/', '_blank');
      return;
    }

    const connectedAddress = await connect();
    if (connectedAddress) {
      setAddress(connectedAddress);
      setError('');
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
    setAddress('');
  };

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="flex flex-col gap-4">
        {/* Phantom Connect Button */}
        {isConnected && publicKey ? (
          <div className="flex items-center justify-between px-4 py-3 bg-purple-900/30 border border-purple-500/50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-purple-300 text-sm">
                Connected: <span className="text-white font-mono">{truncateAddress(publicKey)}</span>
              </span>
            </div>
            <button
              type="button"
              onClick={handleDisconnect}
              className="px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleConnect}
            disabled={isConnecting || isLoading}
            className="w-full py-4 bg-purple-900/50 hover:bg-purple-800/50 border border-purple-500/50 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isConnecting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Connecting...
              </>
            ) : (
              <>
                {/* Phantom Ghost Icon */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 128 128"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="64" cy="64" r="64" fill="url(#phantom-gradient)" />
                  <path
                    d="M110.584 64.9142H99.142C99.142 41.7651 80.173 23 56.7724 23C33.6612 23 14.8716 41.3057 14.4118 64.0583C13.9361 87.5855 33.1119 108 56.7724 108H62.5765C84.929 108 110.584 85.4732 110.584 64.9142Z"
                    fill="url(#phantom-gradient)"
                  />
                  <path
                    d="M110.584 64.9142H99.142C99.142 41.7651 80.173 23 56.7724 23C33.6612 23 14.8716 41.3057 14.4118 64.0583C13.9361 87.5855 33.1119 108 56.7724 108H62.5765C84.929 108 110.584 85.4732 110.584 64.9142Z"
                    fill="white"
                  />
                  <ellipse cx="42.6" cy="62.4" rx="6.6" ry="7.2" fill="#1E1E21" />
                  <ellipse cx="69" cy="62.4" rx="6.6" ry="7.2" fill="#1E1E21" />
                  <defs>
                    <linearGradient
                      id="phantom-gradient"
                      x1="64"
                      y1="0"
                      x2="64"
                      y2="128"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#534BB1" />
                      <stop offset="1" stopColor="#551BF9" />
                    </linearGradient>
                  </defs>
                </svg>
                {isPhantomInstalled ? 'Connect Phantom Wallet' : 'Install Phantom Wallet'}
              </>
            )}
          </button>
        )}

        {phantomError && (
          <p className="text-red-400 text-sm text-center">{phantomError}</p>
        )}

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        {/* Manual Input */}
        <div className="relative">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter Solana wallet address..."
            className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            disabled={isLoading}
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Analyzing...
            </span>
          ) : (
            '🔥 Get Roasted'
          )}
        </button>
      </div>
    </form>
  );
}
