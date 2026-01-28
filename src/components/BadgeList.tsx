import { Badge } from '@/types';

interface BadgeListProps {
  badges: Badge[];
}

export default function BadgeList({ badges }: BadgeListProps) {
  if (badges.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No badges earned yet. Keep trading!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-3">
        Badges Earned
      </h3>
      <div className="flex flex-wrap gap-2">
        {badges.map((badge, index) => (
          <div
            key={index}
            className="group relative inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-full hover:border-purple-500/50 transition-colors cursor-default"
          >
            <span className="text-xl">{badge.emoji}</span>
            <span className="text-white font-medium">{badge.label}</span>

            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
              {badge.description}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
