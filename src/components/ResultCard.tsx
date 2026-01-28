import { WalletAnalysis } from '@/types';
import { shortenAddress } from '@/lib/utils';
import DegenMeter from './DegenMeter';
import StatsGrid from './StatsGrid';
import BadgeList from './BadgeList';
import RoastMessage from './RoastMessage';
import ShareButtons from './ShareButtons';

interface ResultCardProps {
  analysis: WalletAnalysis;
  onRoastAnother: () => void;
}

export default function ResultCard({ analysis, onRoastAnother }: ResultCardProps) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <p className="text-gray-400 mb-2">Results for</p>
        <p className="text-white font-mono text-lg">
          {shortenAddress(analysis.address, 6)}
        </p>
      </div>

      <DegenMeter score={analysis.personality.degenScore} />

      <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
        <RoastMessage
          title={analysis.personality.mainTitle}
          roast={analysis.personality.roast}
        />
      </div>

      <StatsGrid stats={analysis.stats} />

      <BadgeList badges={analysis.personality.badges} />

      <ShareButtons analysis={analysis} onRoastAnother={onRoastAnother} />
    </div>
  );
}
