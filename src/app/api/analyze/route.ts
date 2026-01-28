import { NextRequest, NextResponse } from 'next/server';
import { analyzeWallet } from '@/lib/analyzer';
import { isValidSolanaAddress } from '@/lib/utils';
import { AnalyzeResponse } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse<AnalyzeResponse>> {
  try {
    const body = await request.json();
    const { address } = body;

    // Validate address
    if (!address || typeof address !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Wallet address is required',
        },
        { status: 400 }
      );
    }

    const trimmedAddress = address.trim();

    if (!isValidSolanaAddress(trimmedAddress)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid Solana wallet address',
        },
        { status: 400 }
      );
    }

    // Check for Helius API key
    if (!process.env.HELIUS_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'Server configuration error: Missing API key',
        },
        { status: 500 }
      );
    }

    // Analyze wallet
    const analysis = await analyzeWallet(trimmedAddress);

    return NextResponse.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('Analysis error:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      success: false,
      error: 'Method not allowed. Use POST with { address: "your-wallet-address" }',
    },
    { status: 405 }
  );
}
