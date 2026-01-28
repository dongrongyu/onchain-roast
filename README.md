# OnChain Roast

**Your Solana wallet's brutally honest therapist.**

Ever wondered how degen your trading really is? OnChain Roast analyzes your Solana wallet and roasts you based on your on-chain trading history. No mercy. No filter. Just cold, hard truths wrapped in savage humor.

## What It Does

Paste your Solana wallet address and get:

- **Degen Score (0-100)** - How degenerate are you, really?
- **Personality Title** - "Diamond Hands Legend" or "Certified Rug Collector"?
- **Trading Stats** - Win rate, P&L, holding time, and more
- **Achievement Badges** - Unlock badges like "Night Owl", "Weekend Warrior", "Paper Hands"
- **Personalized Roast** - AI-generated roast based on your actual trading behavior

## Screenshots

```
+------------------------------------------+
|           YOUR DEGEN SCORE               |
|                                          |
|              🔥 87 🔥                    |
|           "Full Degen Mode"              |
|                                          |
|  Win Rate: 21%    |    Rugs: 37          |
|  Avg Hold: 1min   |    P&L: -$69.52      |
|                                          |
|  "You've collected more rugs than a      |
|   Persian carpet dealer. Impressive."    |
+------------------------------------------+
```

## Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Helius API** - Solana transaction data
- **Jupiter API** - Token pricing

## Getting Started

### Prerequisites

- Node.js 18+
- Helius API Key (free at [helius.xyz](https://helius.xyz))

### Installation

```bash
# Clone the repo
git clone https://github.com/dongrongyu/onchain-roast.git
cd onchain-roast

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and add your HELIUS_API_KEY

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and get roasted.

### Build for Production

```bash
npm run build
npm run start
```

## How It Works

1. **Fetch Transactions** - Pulls your recent swap transactions from Helius API
2. **Analyze Trades** - Calculates win rate, P&L, holding times, rug pulls
3. **Score Your Degen Level** - Weighted algorithm based on:
   - Win rate (lower = more degen)
   - Rug count
   - Memecoin percentage
   - Night/weekend trading
   - Trade frequency
4. **Generate Roast** - Creates personalized roast based on your trading patterns

## Supported DEXes

- Jupiter (v4 & v6)
- Raydium (AMM & CLMM)
- Orca (Whirlpool & v1)
- Serum DEX

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/dongrongyu/onchain-roast&env=HELIUS_API_KEY&envDescription=Get%20your%20free%20API%20key%20at%20helius.xyz)

Or deploy manually:

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add `HELIUS_API_KEY` environment variable
4. Deploy

## Contributing

PRs welcome. If you can make the roasts more savage, even better.

## License

MIT

---

**Disclaimer**: This is for entertainment purposes only. Not financial advice. If you're losing money trading memecoins, that's on you.

*Built for Solana Hackathon*
