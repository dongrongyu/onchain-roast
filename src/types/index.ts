export interface TradeStats {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  avgHoldingTimeMinutes: number;
  biggestWinUsd: number;
  biggestLossUsd: number;
  totalPnlUsd: number;
  rugCount: number;
  totalVolumeUsd: number;
}

export interface Preferences {
  memecoinPercent: number;
  defiPercent: number;
  nftPercent: number;
  otherPercent: number;
  favoriteToken: string;
  favoriteTokenTrades: number;
}

export interface Timing {
  mostActiveHour: number;
  mostActiveDay: string;
  weekendTraderPercent: number;
  nightOwlPercent: number;
  avgTradesPerDay: number;
}

export interface Badge {
  emoji: string;
  label: string;
  description: string;
}

export interface Personality {
  degenScore: number;
  mainTitle: string;
  badges: Badge[];
  roast: string;
}

export interface WalletAnalysis {
  address: string;
  stats: TradeStats;
  preferences: Preferences;
  timing: Timing;
  personality: Personality;
  analyzedAt: string;
}

export interface AnalyzeRequest {
  address: string;
}

export interface AnalyzeResponse {
  success: boolean;
  data?: WalletAnalysis;
  error?: string;
}

export interface SwapTransaction {
  signature: string;
  timestamp: number;
  tokenIn: string;
  tokenOut: string;
  amountIn: number;
  amountOut: number;
  programId: string;
}

export interface TokenPrice {
  mint: string;
  priceUsd: number;
}

// Phantom Wallet Provider Types
export interface PhantomProvider {
  isPhantom: boolean;
  isConnected: boolean;
  publicKey: { toString: () => string } | null;
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  on: (event: string, callback: (args: unknown) => void) => void;
  off: (event: string, callback: (args: unknown) => void) => void;
}

declare global {
  interface Window {
    solana?: PhantomProvider;
  }
}
