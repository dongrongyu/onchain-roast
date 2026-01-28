import axios from 'axios';
import { SwapTransaction } from '@/types';

const HELIUS_API_KEY = process.env.HELIUS_API_KEY || '';
const HELIUS_BASE_URL = 'https://api.helius.xyz/v0';

// Known DEX program IDs
const DEX_PROGRAMS = [
  'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4', // Jupiter v6
  'JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB', // Jupiter v4
  'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc', // Orca Whirlpool
  '9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP', // Orca v1
  '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8', // Raydium AMM v4
  'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK', // Raydium CLMM
  'srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX', // Serum DEX
];

interface HeliusTransaction {
  signature: string;
  timestamp: number;
  type: string;
  source: string;
  fee: number;
  feePayer: string;
  description?: string;
  nativeTransfers?: Array<{
    fromUserAccount: string;
    toUserAccount: string;
    amount: number;
  }>;
  tokenTransfers?: Array<{
    fromUserAccount: string;
    toUserAccount: string;
    fromTokenAccount: string;
    toTokenAccount: string;
    tokenAmount: number;
    mint: string;
    tokenStandard: string;
  }>;
  accountData?: Array<{
    account: string;
    nativeBalanceChange: number;
    tokenBalanceChanges?: Array<{
      mint: string;
      rawTokenAmount: {
        tokenAmount: string;
        decimals: number;
      };
    }>;
  }>;
  events?: {
    swap?: {
      nativeInput?: {
        account: string;
        amount: string;
      };
      nativeOutput?: {
        account: string;
        amount: string;
      };
      tokenInputs?: Array<{
        userAccount: string;
        tokenAccount: string;
        mint: string;
        rawTokenAmount: {
          tokenAmount: string;
          decimals: number;
        };
      }>;
      tokenOutputs?: Array<{
        userAccount: string;
        tokenAccount: string;
        mint: string;
        rawTokenAmount: {
          tokenAmount: string;
          decimals: number;
        };
      }>;
      tokenFees?: Array<{
        mint: string;
        rawTokenAmount: {
          tokenAmount: string;
          decimals: number;
        };
      }>;
      nativeFees?: Array<{
        account: string;
        amount: string;
      }>;
      innerSwaps?: Array<{
        programInfo: {
          source: string;
          account: string;
          programName: string;
          instructionName: string;
        };
        tokenInputs: Array<{
          mint: string;
          rawTokenAmount: {
            tokenAmount: string;
            decimals: number;
          };
        }>;
        tokenOutputs: Array<{
          mint: string;
          rawTokenAmount: {
            tokenAmount: string;
            decimals: number;
          };
        }>;
      }>;
    };
  };
}

export async function getSwapTransactions(address: string, limit = 100): Promise<SwapTransaction[]> {
  if (!HELIUS_API_KEY) {
    throw new Error('HELIUS_API_KEY is not configured');
  }

  const allSwaps: SwapTransaction[] = [];
  let lastSignature: string | undefined;
  let fetchCount = 0;
  const maxFetches = 5; // Fetch up to 500 transactions

  while (fetchCount < maxFetches) {
    try {
      const params: Record<string, string | number> = {
        'api-key': HELIUS_API_KEY,
        limit: 100,
      };

      if (lastSignature) {
        params.before = lastSignature;
      }

      const response = await axios.get<HeliusTransaction[]>(
        `${HELIUS_BASE_URL}/addresses/${address}/transactions`,
        { params, timeout: 15000 }
      );

      if (!response.data || response.data.length === 0) {
        break;
      }

      for (const tx of response.data) {
        // Parse swap transactions (both with events.swap and type SWAP)
        const swap = parseSwapTransaction(tx, address);
        if (swap) {
          allSwaps.push(swap);
        }
      }

      lastSignature = response.data[response.data.length - 1].signature;
      fetchCount++;

      // Stop if we have enough swaps
      if (allSwaps.length >= limit) {
        break;
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;

        // Handle pagination error - extract the before-signature and continue
        if (errorData?.error?.includes('before-signature')) {
          // Extract signature - it ends with a period in the error message
          const match = errorData.error.match(/set to ([A-Za-z0-9]+)\./);
          if (match && match[1]) {
            lastSignature = match[1];
            fetchCount++;
            console.log(`Pagination hint received, continuing from ${lastSignature.slice(0, 20)}...`);
            await new Promise(resolve => setTimeout(resolve, 300));
            continue;
          }
        }

        console.error('Helius API error:', errorData || error.message);

        // If we already have some swaps, return them instead of throwing
        if (allSwaps.length > 0) {
          console.log(`Returning ${allSwaps.length} swaps despite error`);
          break;
        }

        throw new Error(`Failed to fetch transactions: ${errorData?.error || error.message}`);
      }
      throw error;
    }
  }

  console.log(`Fetched ${allSwaps.length} swaps from ~${fetchCount * 100} transactions`);
  return allSwaps.slice(0, limit);
}

function parseSwapTransaction(tx: HeliusTransaction, walletAddress: string): SwapTransaction | null {
  // Method 1: Parse from events.swap (preferred)
  if (tx.events?.swap) {
    const swap = parseFromSwapEvent(tx);
    if (swap) return swap;
  }

  // Method 2: Parse from tokenTransfers for SWAP type transactions
  if (tx.type === 'SWAP' && tx.tokenTransfers && tx.tokenTransfers.length >= 2) {
    const swap = parseFromTokenTransfers(tx, walletAddress);
    if (swap) return swap;
  }

  return null;
}

function parseFromSwapEvent(tx: HeliusTransaction): SwapTransaction | null {
  const swapEvent = tx.events!.swap!;

  // Get input token
  let tokenIn = '';
  let amountIn = 0;

  if (swapEvent.nativeInput && swapEvent.nativeInput.amount !== '0') {
    tokenIn = 'So11111111111111111111111111111111111111112'; // Wrapped SOL
    amountIn = parseInt(swapEvent.nativeInput.amount) / 1e9;
  } else if (swapEvent.tokenInputs && swapEvent.tokenInputs.length > 0) {
    const input = swapEvent.tokenInputs[0];
    tokenIn = input.mint;
    const decimals = input.rawTokenAmount.decimals;
    amountIn = parseInt(input.rawTokenAmount.tokenAmount) / Math.pow(10, decimals);
  }

  // Get output token
  let tokenOut = '';
  let amountOut = 0;

  if (swapEvent.nativeOutput && swapEvent.nativeOutput.amount !== '0') {
    tokenOut = 'So11111111111111111111111111111111111111112'; // Wrapped SOL
    amountOut = parseInt(swapEvent.nativeOutput.amount) / 1e9;
  } else if (swapEvent.tokenOutputs && swapEvent.tokenOutputs.length > 0) {
    const output = swapEvent.tokenOutputs[0];
    tokenOut = output.mint;
    const decimals = output.rawTokenAmount.decimals;
    amountOut = parseInt(output.rawTokenAmount.tokenAmount) / Math.pow(10, decimals);
  }

  // Skip if we couldn't parse the swap properly
  if (!tokenIn || !tokenOut || amountIn === 0 || amountOut === 0) {
    return null;
  }

  // Determine the program ID from inner swaps if available
  let programId = 'unknown';
  if (swapEvent.innerSwaps && swapEvent.innerSwaps.length > 0) {
    programId = swapEvent.innerSwaps[0].programInfo.account;
  }

  return {
    signature: tx.signature,
    timestamp: tx.timestamp * 1000, // Convert to milliseconds
    tokenIn,
    tokenOut,
    amountIn,
    amountOut,
    programId,
  };
}

function parseFromTokenTransfers(tx: HeliusTransaction, walletAddress: string): SwapTransaction | null {
  const transfers = tx.tokenTransfers!;

  // Find tokens sent from wallet (input) and received by wallet (output)
  const sentTransfers = transfers.filter(t =>
    t.fromUserAccount === walletAddress && t.tokenAmount > 0
  );
  const receivedTransfers = transfers.filter(t =>
    t.toUserAccount === walletAddress && t.tokenAmount > 0
  );

  if (sentTransfers.length === 0 || receivedTransfers.length === 0) {
    return null;
  }

  const sent = sentTransfers[0];
  const received = receivedTransfers[0];

  return {
    signature: tx.signature,
    timestamp: tx.timestamp * 1000,
    tokenIn: sent.mint,
    tokenOut: received.mint,
    amountIn: sent.tokenAmount,
    amountOut: received.tokenAmount,
    programId: tx.source || 'unknown',
  };
}

export async function getTransactionHistory(address: string): Promise<HeliusTransaction[]> {
  if (!HELIUS_API_KEY) {
    throw new Error('HELIUS_API_KEY is not configured');
  }

  try {
    const response = await axios.get<HeliusTransaction[]>(
      `${HELIUS_BASE_URL}/addresses/${address}/transactions`,
      {
        params: {
          'api-key': HELIUS_API_KEY,
          limit: 100,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Helius API error:', error.response?.data || error.message);
      throw new Error(`Failed to fetch transaction history: ${error.response?.data?.error || error.message}`);
    }
    throw error;
  }
}

export { DEX_PROGRAMS };
