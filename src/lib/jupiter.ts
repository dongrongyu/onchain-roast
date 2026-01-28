import axios from 'axios';

// Use Jupiter Price API v1 (free) or Birdeye as fallback
const JUPITER_PRICE_API_V1 = 'https://price.jup.ag/v4/price';
const BIRDEYE_API = 'https://public-api.birdeye.so/public/price';

// Well-known token mints
export const KNOWN_TOKENS: Record<string, { symbol: string; name: string; isMemecoin: boolean }> = {
  'So11111111111111111111111111111111111111112': { symbol: 'SOL', name: 'Wrapped SOL', isMemecoin: false },
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': { symbol: 'USDC', name: 'USD Coin', isMemecoin: false },
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': { symbol: 'USDT', name: 'Tether USD', isMemecoin: false },
  'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So': { symbol: 'mSOL', name: 'Marinade SOL', isMemecoin: false },
  'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263': { symbol: 'BONK', name: 'Bonk', isMemecoin: true },
  'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm': { symbol: 'WIF', name: 'dogwifhat', isMemecoin: true },
  '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr': { symbol: 'POPCAT', name: 'Popcat', isMemecoin: true },
  'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN': { symbol: 'JUP', name: 'Jupiter', isMemecoin: false },
  'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3': { symbol: 'PYTH', name: 'Pyth Network', isMemecoin: false },
  'RLBxxFkseAZ4RgJH3Sqn8jXxhmGoz9jWxDNJMh8pL7a': { symbol: 'RNDR', name: 'Render Token', isMemecoin: false },
  '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R': { symbol: 'RAY', name: 'Raydium', isMemecoin: false },
  'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE': { symbol: 'ORCA', name: 'Orca', isMemecoin: false },
};

// Fallback prices for common tokens (approximate USD values)
const FALLBACK_PRICES: Record<string, number> = {
  'So11111111111111111111111111111111111111112': 180, // SOL
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 1, // USDC
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': 1, // USDT
  'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So': 200, // mSOL
  'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263': 0.00003, // BONK
  'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm': 2.5, // WIF
  'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN': 1.2, // JUP
  '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R': 5, // RAY
  'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE': 4, // ORCA
};

// Cache for token prices to reduce API calls
const priceCache: Map<string, { price: number; timestamp: number }> = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minute cache

function getFallbackPrice(mint: string): number {
  return FALLBACK_PRICES[mint] || 0;
}

export async function getTokenPrice(mint: string): Promise<number> {
  // Check cache first
  const cached = priceCache.get(mint);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.price;
  }

  // Try Jupiter v4 API first
  try {
    const response = await axios.get<{
      data: Record<string, { price: number }>;
    }>(JUPITER_PRICE_API_V1, {
      params: {
        ids: mint,
      },
      timeout: 5000,
    });

    const priceData = response.data.data[mint];
    if (priceData && priceData.price) {
      const price = priceData.price;
      priceCache.set(mint, { price, timestamp: Date.now() });
      return price;
    }
  } catch (error) {
    console.log(`Jupiter v4 API failed for ${mint}, using fallback`);
  }

  // Use fallback price
  const fallback = getFallbackPrice(mint);
  priceCache.set(mint, { price: fallback, timestamp: Date.now() });
  return fallback;
}

export async function getMultipleTokenPrices(mints: string[]): Promise<Map<string, number>> {
  const prices = new Map<string, number>();
  const mintsToFetch: string[] = [];

  // Check cache for each mint
  for (const mint of mints) {
    const cached = priceCache.get(mint);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      prices.set(mint, cached.price);
    } else {
      mintsToFetch.push(mint);
    }
  }

  if (mintsToFetch.length === 0) {
    return prices;
  }

  // Try Jupiter v4 API
  try {
    const response = await axios.get<{
      data: Record<string, { price: number }>;
    }>(JUPITER_PRICE_API_V1, {
      params: {
        ids: mintsToFetch.join(','),
      },
      timeout: 10000,
    });

    for (const mint of mintsToFetch) {
      const priceData = response.data.data[mint];
      const price = priceData?.price || getFallbackPrice(mint);
      prices.set(mint, price);
      priceCache.set(mint, { price, timestamp: Date.now() });
    }

    console.log(`Fetched ${Object.keys(response.data.data).length} prices from Jupiter`);
  } catch (error) {
    console.error('Jupiter API failed, using fallback prices');

    // Use fallback prices
    for (const mint of mintsToFetch) {
      const fallback = getFallbackPrice(mint);
      prices.set(mint, fallback);
      priceCache.set(mint, { price: fallback, timestamp: Date.now() });
    }
  }

  return prices;
}

export function isMemecoin(mint: string): boolean {
  const known = KNOWN_TOKENS[mint];
  if (known) {
    return known.isMemecoin;
  }
  // Default assumption: unknown tokens are more likely memecoins on Solana
  return true;
}

export function isStablecoin(mint: string): boolean {
  const stablecoins = [
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
    'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT
    'USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX', // USDH
    '7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj', // stSOL
  ];
  return stablecoins.includes(mint);
}

export function getTokenSymbol(mint: string): string {
  return KNOWN_TOKENS[mint]?.symbol || mint.slice(0, 6);
}
