import { TradeStats, Preferences, Timing, Personality, Badge } from '@/types';

interface ScoreWeights {
  winRate: number;
  rugCount: number;
  memecoinPercent: number;
  tradingFrequency: number;
  volatility: number;
  nightOwl: number;
  weekendTrader: number;
}

const DEFAULT_WEIGHTS: ScoreWeights = {
  winRate: 0.15,
  rugCount: 0.2,
  memecoinPercent: 0.25,
  tradingFrequency: 0.15,
  volatility: 0.15,
  nightOwl: 0.05,
  weekendTrader: 0.05,
};

export function generatePersonality(
  stats: TradeStats,
  preferences: Preferences,
  timing: Timing
): Personality {
  const degenScore = calculateDegenScore(stats, preferences, timing);
  const mainTitle = getMainTitle(degenScore, stats, preferences);
  const badges = getBadges(stats, preferences, timing);
  const roast = generateRoast(degenScore, stats, preferences, timing);

  return {
    degenScore,
    mainTitle,
    badges,
    roast,
  };
}

export function calculateDegenScore(
  stats: TradeStats,
  preferences: Preferences,
  timing: Timing
): number {
  const weights = DEFAULT_WEIGHTS;

  // Lower win rate = more degen (inverse)
  const winRateScore = (1 - stats.winRate) * 100;

  // More rugs = more degen
  const rugScore = Math.min(stats.rugCount * 15, 100);

  // More memecoins = more degen
  const memecoinScore = preferences.memecoinPercent * 100;

  // More trades per day = more degen
  const frequencyScore = Math.min(timing.avgTradesPerDay * 10, 100);

  // Bigger swings (ratio of biggest win to biggest loss) = more degen
  const volatilityScore =
    stats.biggestWinUsd > 0 && stats.biggestLossUsd > 0
      ? Math.min((stats.biggestWinUsd + stats.biggestLossUsd) / 1000, 100)
      : 50;

  // Night trading = more degen
  const nightOwlScore = timing.nightOwlPercent * 100;

  // Weekend trading = slightly more degen
  const weekendScore = timing.weekendTraderPercent * 100;

  const rawScore =
    winRateScore * weights.winRate +
    rugScore * weights.rugCount +
    memecoinScore * weights.memecoinPercent +
    frequencyScore * weights.tradingFrequency +
    volatilityScore * weights.volatility +
    nightOwlScore * weights.nightOwl +
    weekendScore * weights.weekendTrader;

  return Math.round(Math.min(Math.max(rawScore, 0), 100));
}

export function getMainTitle(
  degenScore: number,
  stats: TradeStats,
  preferences: Preferences
): string {
  // Special titles based on specific patterns
  if (stats.rugCount >= 5) {
    return 'Rug Collector';
  }

  if (stats.winRate >= 0.8 && stats.totalTrades >= 10) {
    return 'Lucky Bastard';
  }

  if (stats.winRate <= 0.2 && stats.totalTrades >= 10) {
    return 'Professional Bag Holder';
  }

  if (preferences.memecoinPercent >= 0.9) {
    return 'Full Degen';
  }

  if (stats.totalPnlUsd > 10000) {
    return 'Whale Watcher';
  }

  if (stats.totalPnlUsd < -5000) {
    return 'Generous Donor';
  }

  // Generic titles based on degen score
  if (degenScore >= 90) return 'Certified Degenerate';
  if (degenScore >= 80) return 'High Risk Enjoyer';
  if (degenScore >= 70) return 'Memecoin Maximalist';
  if (degenScore >= 60) return 'Aspiring Degen';
  if (degenScore >= 50) return 'Casual Trader';
  if (degenScore >= 40) return 'Cautious Cat';
  if (degenScore >= 30) return 'DeFi Dad';
  if (degenScore >= 20) return 'Index Hugger';
  if (degenScore >= 10) return 'Paper Hands';
  return 'Tourist';
}

export function getBadges(
  stats: TradeStats,
  preferences: Preferences,
  timing: Timing
): Badge[] {
  const badges: Badge[] = [];

  // Rug-related badges
  if (stats.rugCount >= 10) {
    badges.push({
      emoji: '🪦',
      label: 'Graveyard Keeper',
      description: '10+ rugged tokens in portfolio',
    });
  } else if (stats.rugCount >= 5) {
    badges.push({
      emoji: '💀',
      label: 'Rug Survivor',
      description: '5+ rugged tokens in portfolio',
    });
  } else if (stats.rugCount >= 1) {
    badges.push({
      emoji: '🪤',
      label: 'Got Rugged',
      description: 'At least one rugged token',
    });
  }

  // Win rate badges
  if (stats.winRate >= 0.8 && stats.totalTrades >= 5) {
    badges.push({
      emoji: '🎯',
      label: 'Sharp Shooter',
      description: '80%+ win rate',
    });
  } else if (stats.winRate <= 0.2 && stats.totalTrades >= 5) {
    badges.push({
      emoji: '🎰',
      label: 'Gambling Addict',
      description: 'Less than 20% win rate',
    });
  }

  // Memecoin badges
  if (preferences.memecoinPercent >= 0.9) {
    badges.push({
      emoji: '🐸',
      label: 'Memecoin Maxi',
      description: '90%+ memecoin trades',
    });
  } else if (preferences.memecoinPercent >= 0.7) {
    badges.push({
      emoji: '🦊',
      label: 'Meme Lover',
      description: '70%+ memecoin trades',
    });
  }

  // Trading frequency badges
  if (timing.avgTradesPerDay >= 10) {
    badges.push({
      emoji: '⚡',
      label: 'Speed Demon',
      description: '10+ trades per day average',
    });
  } else if (timing.avgTradesPerDay >= 5) {
    badges.push({
      emoji: '🔥',
      label: 'Active Trader',
      description: '5+ trades per day average',
    });
  }

  // Timing badges
  if (timing.nightOwlPercent >= 0.5) {
    badges.push({
      emoji: '🦉',
      label: 'Night Owl',
      description: '50%+ trades between 10PM-6AM',
    });
  }

  if (timing.weekendTraderPercent >= 0.4) {
    badges.push({
      emoji: '📅',
      label: 'Weekend Warrior',
      description: '40%+ trades on weekends',
    });
  }

  // P&L badges
  if (stats.totalPnlUsd >= 10000) {
    badges.push({
      emoji: '💎',
      label: 'Diamond Hands',
      description: '$10K+ total profit',
    });
  } else if (stats.totalPnlUsd <= -5000) {
    badges.push({
      emoji: '🗑️',
      label: 'Money Burner',
      description: '$5K+ total losses',
    });
  }

  // Volume badges
  if (stats.totalVolumeUsd >= 100000) {
    badges.push({
      emoji: '🐋',
      label: 'Whale',
      description: '$100K+ trading volume',
    });
  } else if (stats.totalVolumeUsd >= 10000) {
    badges.push({
      emoji: '🐬',
      label: 'Dolphin',
      description: '$10K+ trading volume',
    });
  }

  // Holding time badge
  if (stats.avgHoldingTimeMinutes <= 30 && stats.totalTrades >= 5) {
    badges.push({
      emoji: '🏃',
      label: 'Quick Flipper',
      description: 'Average hold time under 30 minutes',
    });
  }

  // Favorite token badge
  if (preferences.favoriteTokenTrades >= 10) {
    badges.push({
      emoji: '❤️',
      label: `${preferences.favoriteToken} Lover`,
      description: `10+ trades with ${preferences.favoriteToken}`,
    });
  }

  return badges.slice(0, 6); // Max 6 badges
}

export function generateRoast(
  degenScore: number,
  stats: TradeStats,
  preferences: Preferences,
  timing: Timing
): string {
  const roasts = [
    // High degen score roasts
    {
      condition: () => degenScore >= 90,
      roasts: [
        "Your portfolio looks like a museum of failed projects. Impressive dedication to losing money.",
        "You don't buy dips, you ARE the dip. Consistent commitment to catching falling knives.",
        "Your trading strategy appears to be 'buy high, sell never, hold until zero'.",
      ],
    },
    // Rug roasts
    {
      condition: () => stats.rugCount >= 5,
      roasts: [
        `${stats.rugCount} rugs? At this point, you could furnish an entire house with your losses.`,
        "You've been rugged so many times, the scammers send you Christmas cards.",
        "Your rug collection is more diverse than most NFT collections. Truly a connoisseur.",
      ],
    },
    // Low win rate roasts
    {
      condition: () => stats.winRate <= 0.3 && stats.totalTrades >= 5,
      roasts: [
        `${Math.round(stats.winRate * 100)}% win rate? A coin flip would outperform you.`,
        "Have you considered doing the opposite of what you think is a good trade?",
        "Your trading history reads like a tutorial on how NOT to invest.",
      ],
    },
    // Memecoin maxi roasts
    {
      condition: () => preferences.memecoinPercent >= 0.8,
      roasts: [
        "Your portfolio is basically a zoo of animal-themed tokens. Dr. Doolittle of crypto.",
        "90% memecoins? At least you're consistent in your questionable life choices.",
        "You put more research into meme formats than token fundamentals.",
      ],
    },
    // Night owl roasts
    {
      condition: () => timing.nightOwlPercent >= 0.5,
      roasts: [
        "Most of your trades are at 3 AM. Sleep deprivation explains a lot about your decisions.",
        "Night trading while half-asleep - that's commitment to bad decision-making.",
        "Your circadian rhythm is as broken as your portfolio.",
      ],
    },
    // Big losses
    {
      condition: () => stats.totalPnlUsd < -1000,
      roasts: [
        `Down ${Math.abs(Math.round(stats.totalPnlUsd)).toLocaleString()}? That's not a loss, that's a donation to liquidity providers.`,
        "You've contributed more to Solana liquidity than most VCs. Thank you for your service.",
        "Think of your losses as expensive tuition for a degree you'll never use.",
      ],
    },
    // Quick flipper roasts
    {
      condition: () => stats.avgHoldingTimeMinutes <= 30 && stats.totalTrades >= 5,
      roasts: [
        "Average hold time under 30 minutes? Your attention span rivals a goldfish.",
        "You call it day trading, I call it expensive fidget spinning.",
        "You swap tokens faster than you swipe on dating apps.",
      ],
    },
    // Default roasts
    {
      condition: () => true,
      roasts: [
        "Your portfolio diversification strategy: buy everything that has a dog in the logo.",
        "Trading isn't for everyone. You're proving that theory daily.",
        "At least you're having fun. You ARE having fun, right?",
        "Some people invest. You collect lottery tickets with extra steps.",
        "Your 'research' consists of checking how many rocket emojis are in the Telegram.",
      ],
    },
  ];

  // Find matching roast category
  for (const category of roasts) {
    if (category.condition()) {
      const randomIndex = Math.floor(Math.random() * category.roasts.length);
      return category.roasts[randomIndex];
    }
  }

  return "Somehow, you've managed to be too boring to roast. That's almost an achievement.";
}
