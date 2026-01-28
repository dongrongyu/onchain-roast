'use client';

import { useState } from 'react';
import WalletInput from '@/components/WalletInput';
import ResultCard from '@/components/ResultCard';
import LoadingState from '@/components/LoadingState';
import { WalletAnalysis, AnalyzeResponse } from '@/types';

export default function Home() {
  const [analysis, setAnalysis] = useState<WalletAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (address: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });

      const data: AnalyzeResponse = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || 'Failed to analyze wallet');
      }

      setAnalysis(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoastAnother = () => {
    setAnalysis(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black">
      <div className="container mx-auto px-4 py-16">
        {!analysis && !isLoading && (
          <div className="text-center mb-12 space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              OnChain Roast
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Enter your Solana wallet address and get brutally roasted based on
              your trading history. Find out your degen score and earn badges!
            </p>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          {!analysis && !isLoading && (
            <>
              <WalletInput onSubmit={handleAnalyze} isLoading={isLoading} />

              {error && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-center">
                  <p className="text-red-400">{error}</p>
                </div>
              )}

              <div className="mt-12 text-center text-gray-500 text-sm">
                <p>
                  For entertainment purposes only. Not financial advice.
                </p>
              </div>
            </>
          )}

          {isLoading && <LoadingState />}

          {analysis && (
            <ResultCard analysis={analysis} onRoastAnother={handleRoastAnother} />
          )}
        </div>
      </div>
    </main>
  );
}
