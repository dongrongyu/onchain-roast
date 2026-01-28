'use client';

import { WalletAnalysis } from '@/types';
import { shortenAddress } from '@/lib/utils';

interface ShareButtonsProps {
  analysis: WalletAnalysis;
  onRoastAnother: () => void;
}

export default function ShareButtons({ analysis, onRoastAnother }: ShareButtonsProps) {
  const shareText = `I just got roasted by OnChain Roast!\n\nDegen Score: ${analysis.personality.degenScore}/100\nTitle: ${analysis.personality.mainTitle}\n\n"${analysis.personality.roast}"\n\nGet roasted: `;

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        `${shareText}\n\nWallet: ${shortenAddress(analysis.address)}`
      );
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <button
        onClick={handleTwitterShare}
        className="flex items-center gap-2 px-6 py-3 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-semibold rounded-xl transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Share on X
      </button>

      <button
        onClick={handleCopyToClipboard}
        className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        Copy
      </button>

      <button
        onClick={onRoastAnother}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Roast Another
      </button>
    </div>
  );
}
