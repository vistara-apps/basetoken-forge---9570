import React from 'react';
import { Trophy, Star, Zap } from 'lucide-react';

const GameProgress = ({ stats }) => {
  const { level, experience } = stats;
  const nextLevelExp = level * 500;
  const currentLevelExp = experience % 500;
  const progressPercentage = (currentLevelExp / 500) * 100;

  const achievements = [
    { id: 1, name: 'First Token', unlocked: stats.tokensCreated >= 1, icon: Trophy },
    { id: 2, name: 'Token Master', unlocked: stats.tokensCreated >= 5, icon: Star },
    { id: 3, name: 'High Roller', unlocked: stats.totalSupply >= 1000000, icon: Zap },
  ];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-2">Level {level}</h3>
        <div className="w-full bg-space-dark rounded-full h-2 mb-2">
          <div 
            className="bg-gradient-to-r from-neon-blue to-neon-purple h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-400">
          {currentLevelExp} / 500 XP
        </p>
      </div>

      <div>
        <h4 className="text-sm font-medium text-white mb-2">Achievements</h4>
        <div className="space-y-2">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div 
                key={achievement.id}
                className={`flex items-center space-x-2 p-2 rounded ${
                  achievement.unlocked 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-gray-500/20 text-gray-500'
                }`}
              >
                <Icon size={16} />
                <span className="text-xs">{achievement.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GameProgress;