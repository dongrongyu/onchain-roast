'use client';

import { useEffect, useState } from 'react';

interface DegenMeterProps {
  score: number;
}

export default function DegenMeter({ score }: DegenMeterProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  const getScoreColor = (value: number) => {
    if (value >= 80) return 'from-red-500 to-orange-500';
    if (value >= 60) return 'from-orange-500 to-yellow-500';
    if (value >= 40) return 'from-yellow-500 to-green-500';
    if (value >= 20) return 'from-green-500 to-blue-500';
    return 'from-blue-500 to-cyan-500';
  };

  const getScoreLabel = (value: number) => {
    if (value >= 90) return 'MAXIMUM DEGEN';
    if (value >= 70) return 'HIGH RISK';
    if (value >= 50) return 'MODERATE';
    if (value >= 30) return 'CAUTIOUS';
    return 'SAFE';
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-4">
        <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">
          Degen Score
        </h3>
        <div className="text-6xl font-bold text-white mb-1">
          {animatedScore}
          <span className="text-2xl text-gray-500">/100</span>
        </div>
        <div
          className={`text-sm font-semibold bg-gradient-to-r ${getScoreColor(
            animatedScore
          )} bg-clip-text text-transparent`}
        >
          {getScoreLabel(animatedScore)}
        </div>
      </div>

      <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${getScoreColor(
            animatedScore
          )} transition-all duration-1000 ease-out`}
          style={{ width: `${animatedScore}%` }}
        />
        <div className="absolute inset-0 flex">
          {[20, 40, 60, 80].map((mark) => (
            <div
              key={mark}
              className="h-full w-px bg-gray-700"
              style={{ marginLeft: `${mark}%` }}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>Safe</span>
        <span>Degen</span>
      </div>
    </div>
  );
}
