import { SwapTransaction, TradeStats, Preferences, Timing, WalletAnalysis } from '@/types';
import { getSwapTransactions } from './helius';
import { getMultipleTokenPrices, isMemecoin, isStablecoin, getTokenSymbol } from './jupiter';
import { generatePersonality } from './personality';

interface TradeWithPnl {
  transaction: SwapTransaction;
  pnlUsd: number;
  holdingTimeMinutes: number;
  isWin: boolean;
  isRug: boolean;
  tokenInUsd: number;
  tokenOutUsd: number;
}

interface TokenTradeInfo {
  mint: string;
  buys: SwapTransaction[];
  sells: SwapTransaction[];
  totalBought: number;
  totalSold: number;
  avgBuyPrice: number;
  avgSellPrice: number;
}

const WRAPPED_SOL = 'So11111111111111111111111111111111111111112';
const RUG_THRESHOLD = 0.01; // If price drops to 1% of buy price, consider it rugged

export async function analyzeWallet(address: string): Promise<WalletAnalysis> {
  // Fetch swap transactions from Helius
  const swaps = await getSwapTransactions(address, 100);

  if (swaps.length === 0) {
    return createEmptyAnalysis(address);
  }

  // Collect all unique token mints
  const allMints = new Set<string>();
  for (const swap of swaps) {
    allMints.add(swap.tokenIn);
    allMints.add(swap.tokenOut);
  }

  // Fetch prices for all tokens
  const prices = await getMultipleTokenPrices(Array.from(allMints));

  // Group trades by token to calculate P&L
  const tokenTrades = groupTradesByToken(swaps);

  // Calculate P&L for each trade
  const tradesWithPnl = calculateTradePnl(swaps, tokenTrades, prices);

  // Calculate statistics
  const stats = calculateStats(tradesWithPnl, prices);

  // Calculate preferences
  const preferences = calculatePreferences(swaps, tokenTrades);

  // Calculate timing patterns
  const timing = calculateTiming(swaps);

  // Generate personality based on stats
  const personality = generatePersonality(stats, preferences, timing);

  return {
    address,
    stats,
    preferences,
    timing,
    personality,
    analyzedAt: new Date().toISOString(),
  };
}

function createEmptyAnalysis(address: string): WalletAnalysis {
  return {
    address,
    stats: {
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0,
      avgHoldingTimeMinutes: 0,
      biggestWinUsd: 0,
      biggestLossUsd: 0,
      totalPnlUsd: 0,
      rugCount: 0,
      totalVolumeUsd: 0,
    },
    preferences: {
      memecoinPercent: 0,
      defiPercent: 0,
      nftPercent: 0,
      otherPercent: 0,
      favoriteToken: '',
      favoriteTokenTrades: 0,
    },
    timing: {
      mostActiveHour: 12,
      mostActiveDay: 'Monday',
      weekendTraderPercent: 0,
      nightOwlPercent: 0,
      avgTradesPerDay: 0,
    },
    personality: {
      degenScore: 0,
      mainTitle: 'Ghost Wallet',
      badges: [],
      roast: 'No trading history found. Are you even trying?',
    },
    analyzedAt: new Date().toISOString(),
  };
}

function groupTradesByToken(swaps: SwapTransaction[]): Map<string, TokenTradeInfo> {
  const tokenTrades = new Map<string, TokenTradeInfo>();

  for (const swap of swaps) {
    // When buying a token: tokenIn is SOL/stable, tokenOut is the token
    // When selling a token: tokenIn is the token, tokenOut is SOL/stable
    const isBuy = isStablecoin(swap.tokenIn) || swap.tokenIn === WRAPPED_SOL;
    const token = isBuy ? swap.tokenOut : swap.tokenIn;

    if (!tokenTrades.has(token)) {
      tokenTrades.set(token, {
        mint: token,
        buys: [],
        sells: [],
        totalBought: 0,
        totalSold: 0,
        avgBuyPrice: 0,
        avgSellPrice: 0,
      });
    }

    const info = tokenTrades.get(token)!;
    if (isBuy) {
      info.buys.push(swap);
      info.totalBought += swap.amountOut;
    } else {
      info.sells.push(swap);
      info.totalSold += swap.amountIn;
    }
  }

  return tokenTrades;
}

function calculateTradePnl(
  swaps: SwapTransaction[],
  tokenTrades: Map<string, TokenTradeInfo>,
  prices: Map<string, number>
): TradeWithPnl[] {
  const results: TradeWithPnl[] = [];

  for (const swap of swaps) {
    const tokenInPrice = prices.get(swap.tokenIn) || 0;
    const tokenOutPrice = prices.get(swap.tokenOut) || 0;

    const tokenInUsd = swap.amountIn * tokenInPrice;
    const tokenOutUsd = swap.amountOut * tokenOutPrice;

    // For buys, we spend tokenIn to get tokenOut
    // For sells, we spend tokenOut to get tokenIn
    const isBuy = isStablecoin(swap.tokenIn) || swap.tokenIn === WRAPPED_SOL;
    const token = isBuy ? swap.tokenOut : swap.tokenIn;

    // Calculate holding time (time between buy and sell)
    const info = tokenTrades.get(token);
    let holdingTimeMinutes = 0;
    let pnlUsd = 0;
    let isRug = false;

    if (info && !isBuy && info.buys.length > 0) {
      // This is a sell, find the earliest buy
      const earliestBuy = info.buys.reduce((min, b) =>
        b.timestamp < min.timestamp ? b : min
      );
      holdingTimeMinutes = (swap.timestamp - earliestBuy.timestamp) / (1000 * 60);

      // Calculate PnL based on current prices
      const buyPrice = prices.get(earliestBuy.tokenIn) || 0;
      const buyValue = earliestBuy.amountIn * buyPrice;
      pnlUsd = tokenInUsd - buyValue;

      // Check if rugged (current price is basically 0)
      if (tokenOutPrice > 0 && tokenInPrice / tokenOutPrice < RUG_THRESHOLD) {
        isRug = true;
      }
    } else if (isBuy) {
      // For buys, check if the token still has value
      const currentValue = swap.amountOut * tokenOutPrice;
      const buyValue = tokenInUsd;

      if (tokenOutPrice === 0 || currentValue < buyValue * RUG_THRESHOLD) {
        isRug = true;
        pnlUsd = -buyValue;
      } else {
        pnlUsd = currentValue - buyValue;
      }
    }

    const isWin = pnlUsd > 0;

    results.push({
      transaction: swap,
      pnlUsd,
      holdingTimeMinutes,
      isWin,
      isRug,
      tokenInUsd,
      tokenOutUsd,
    });
  }

  return results;
}

function calculateStats(trades: TradeWithPnl[], prices: Map<string, number>): TradeStats {
  if (trades.length === 0) {
    return {
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0,
      avgHoldingTimeMinutes: 0,
      biggestWinUsd: 0,
      biggestLossUsd: 0,
      totalPnlUsd: 0,
      rugCount: 0,
      totalVolumeUsd: 0,
    };
  }

  const totalTrades = trades.length;
  const winningTrades = trades.filter((t) => t.isWin).length;
  const losingTrades = trades.filter((t) => !t.isWin).length;
  const winRate = winningTrades / totalTrades;

  const tradesWithHoldingTime = trades.filter((t) => t.holdingTimeMinutes > 0);
  const avgHoldingTimeMinutes =
    tradesWithHoldingTime.length > 0
      ? tradesWithHoldingTime.reduce((sum, t) => sum + t.holdingTimeMinutes, 0) /
        tradesWithHoldingTime.length
      : 0;

  const biggestWinUsd = Math.max(...trades.map((t) => t.pnlUsd), 0);
  const biggestLossUsd = Math.min(...trades.map((t) => t.pnlUsd), 0);
  const totalPnlUsd = trades.reduce((sum, t) => sum + t.pnlUsd, 0);
  const rugCount = trades.filter((t) => t.isRug).length;
  const totalVolumeUsd = trades.reduce((sum, t) => sum + t.tokenInUsd, 0);

  return {
    totalTrades,
    winningTrades,
    losingTrades,
    winRate,
    avgHoldingTimeMinutes,
    biggestWinUsd,
    biggestLossUsd: Math.abs(biggestLossUsd),
    totalPnlUsd,
    rugCount,
    totalVolumeUsd,
  };
}

function calculatePreferences(
  swaps: SwapTransaction[],
  tokenTrades: Map<string, TokenTradeInfo>
): Preferences {
  let memecoinCount = 0;
  let defiCount = 0;
  let otherCount = 0;

  const tokenCounts = new Map<string, number>();

  for (const swap of swaps) {
    // Count token preferences
    const token = swap.tokenOut;
    tokenCounts.set(token, (tokenCounts.get(token) || 0) + 1);

    // Categorize
    if (isStablecoin(token) || token === WRAPPED_SOL) {
      // Skip stables and SOL for categorization
      continue;
    }

    if (isMemecoin(token)) {
      memecoinCount++;
    } else {
      defiCount++;
    }
  }

  const totalCategorized = memecoinCount + defiCount + otherCount || 1;

  // Find favorite token
  let favoriteToken = '';
  let favoriteTokenTrades = 0;

  for (const [token, count] of tokenCounts) {
    if (count > favoriteTokenTrades && !isStablecoin(token) && token !== WRAPPED_SOL) {
      favoriteToken = getTokenSymbol(token);
      favoriteTokenTrades = count;
    }
  }

  return {
    memecoinPercent: memecoinCount / totalCategorized,
    defiPercent: defiCount / totalCategorized,
    nftPercent: 0, // NFTs not tracked in swap transactions
    otherPercent: otherCount / totalCategorized,
    favoriteToken,
    favoriteTokenTrades,
  };
}

function calculateTiming(swaps: SwapTransaction[]): Timing {
  if (swaps.length === 0) {
    return {
      mostActiveHour: 12,
      mostActiveDay: 'Monday',
      weekendTraderPercent: 0,
      nightOwlPercent: 0,
      avgTradesPerDay: 0,
    };
  }

  const hourCounts = new Array(24).fill(0);
  const dayCounts = new Array(7).fill(0);
  let weekendTrades = 0;
  let nightTrades = 0;

  for (const swap of swaps) {
    const date = new Date(swap.timestamp);
    const hour = date.getUTCHours();
    const day = date.getUTCDay();

    hourCounts[hour]++;
    dayCounts[day]++;

    if (day === 0 || day === 6) {
      weekendTrades++;
    }

    if (hour >= 22 || hour < 6) {
      nightTrades++;
    }
  }

  const mostActiveHour = hourCounts.indexOf(Math.max(...hourCounts));
  const mostActiveDayIndex = dayCounts.indexOf(Math.max(...dayCounts));
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Calculate avg trades per day
  const timestamps = swaps.map((s) => s.timestamp);
  const minTime = Math.min(...timestamps);
  const maxTime = Math.max(...timestamps);
  const dayRange = Math.max(1, (maxTime - minTime) / (1000 * 60 * 60 * 24));
  const avgTradesPerDay = swaps.length / dayRange;

  return {
    mostActiveHour,
    mostActiveDay: dayNames[mostActiveDayIndex],
    weekendTraderPercent: weekendTrades / swaps.length,
    nightOwlPercent: nightTrades / swaps.length,
    avgTradesPerDay,
  };
}

export { groupTradesByToken, calculateTradePnl, calculateStats };
