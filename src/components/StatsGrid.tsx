import { TradeStats } from '@/types';
import { formatUsd, formatPercent, formatDuration } from '@/lib/utils';

interface StatsGridProps {
  stats: TradeStats;
}

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  colorClass?: string;
}

function StatCard({ label, value, subValue, colorClass = 'text-white' }: StatCardProps) {
  return (
    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
      <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className={`text-2xl font-bold ${colorClass}`}>{value}</div>
      {subValue && (
        <div className="text-gray-500 text-sm mt-1">{subValue}</div>
      )}
    </div>
  );
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const winRateColor =
    stats.winRate >= 0.5
      ? 'text-green-400'
      : stats.winRate >= 0.3
      ? 'text-yellow-400'
      : 'text-red-400';

  const pnlColor = stats.totalPnlUsd >= 0 ? 'text-green-400' : 'text-red-400';

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <StatCard
        label="Win Rate"
        value={formatPercent(stats.winRate)}
        subValue={`${stats.winningTrades}W / ${stats.losingTrades}L`}
        colorClass={winRateColor}
      />

      <StatCard
        label="Avg Holding"
        value={formatDuration(stats.avgHoldingTimeMinutes)}
        subValue={`${stats.totalTrades} total trades`}
      />

      <StatCard
        label="Rugs Collected"
        value={stats.rugCount.toString()}
        subValue={stats.rugCount > 0 ? 'F in chat' : 'Lucky so far'}
        colorClass={stats.rugCount > 0 ? 'text-red-400' : 'text-green-400'}
      />

      <StatCard
        label="Best Trade"
        value={formatUsd(stats.biggestWinUsd)}
        colorClass="text-green-400"
      />

      <StatCard
        label="Worst Trade"
        value={`-${formatUsd(stats.biggestLossUsd)}`}
        colorClass="text-red-400"
      />

      <StatCard
        label="Total P&L"
        value={`${stats.totalPnlUsd >= 0 ? '+' : ''}${formatUsd(stats.totalPnlUsd)}`}
        subValue={`${formatUsd(stats.totalVolumeUsd)} volume`}
        colorClass={pnlColor}
      />
    </div>
  );
}
