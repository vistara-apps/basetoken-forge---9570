import React from 'react';
import { Coins, Zap, Brain, TrendingUp, Users, DollarSign } from 'lucide-react';

const Dashboard = ({ userTokens, gameStats, onTabChange }) => {
  const quickActions = [
    {
      title: 'Create New Token',
      description: 'Launch your first ERC20 token',
      icon: Coins,
      action: () => onTabChange('create'),
      color: 'bg-blue-500',
    },
    {
      title: 'Mint Tokens',
      description: 'Mint tokens to your wallet',
      icon: Zap,
      action: () => onTabChange('mint'),
      color: 'bg-purple-500',
    },
    {
      title: 'AI Analysis',
      description: 'Get insights on your tokens',
      icon: Brain,
      action: () => onTabChange('insights'),
      color: 'bg-green-500',
    },
  ];

  const stats = [
    {
      label: 'Tokens Created',
      value: gameStats.tokensCreated,
      icon: Coins,
      color: 'text-blue-400',
    },
    {
      label: 'Total Supply',
      value: gameStats.totalSupply.toLocaleString(),
      icon: TrendingUp,
      color: 'text-green-400',
    },
    {
      label: 'Current Level',
      value: gameStats.level,
      icon: Users,
      color: 'text-purple-400',
    },
    {
      label: 'Experience',
      value: gameStats.experience,
      icon: DollarSign,
      color: 'text-yellow-400',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-red-600 mb-2">Dashboard</h2>
        <p className="text-gray-400">
          Welcome to BaseToken Forge! Create, mint, and manage ERC20 tokens on Base Sepolia.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-space-light/50 rounded-lg p-4 border border-red-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-red-600">{stat.value}</p>
                </div>
                <Icon className={stat.color} size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-semibold text-red-600 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className="bg-space-light/50 rounded-lg p-6 border border-red-600 hover-glow transition-all text-left group"
              >
                <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="text-white" size={24} />
                </div>
                <h4 className="text-lg font-semibold text-red-600 mb-2">{action.title}</h4>
                <p className="text-gray-400 text-sm">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Tokens */}
      {userTokens.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-red-600 mb-4">Your Tokens</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userTokens.slice(0, 4).map((token, index) => (
              <div key={index} className="bg-space-light/50 rounded-lg p-4 border border-red-600">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-semibold text-red-600">{token.name}</h4>
                  <span className="text-sm text-gray-400">{token.symbol}</span>
                </div>
                <p className="text-gray-400 text-sm mb-2">{token.description}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Supply:</span>
                  <span className="text-red-600">{token.totalSupply?.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Getting Started */}
      {userTokens.length === 0 && (
        <div className="bg-space-light/30 rounded-lg p-6 border border-red-600">
          <h3 className="text-xl font-semibold text-red-600 mb-4">Getting Started</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
              <span className="text-gray-300">Connect your wallet to Base Sepolia testnet</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
              <span className="text-gray-300">Create your first ERC20 token</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
              <span className="text-gray-300">Mint tokens and explore features</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;