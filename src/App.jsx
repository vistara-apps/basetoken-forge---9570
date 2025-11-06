import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TokenCreator from './components/TokenCreator';
import TokenMinter from './components/TokenMinter';
import AIInsights from './components/AIInsights';
import GameProgress from './components/GameProgress';
import { Coins, Zap, Brain, Trophy } from 'lucide-react';

function App() {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userTokens, setUserTokens] = useState([]);
  const [gameStats, setGameStats] = useState({
    tokensCreated: 0,
    totalSupply: 0,
    level: 1,
    experience: 0,
  });

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Trophy },
    { id: 'create', label: 'Create Token', icon: Coins },
    { id: 'mint', label: 'Mint & Transfer', icon: Zap },
    { id: 'insights', label: 'AI Insights', icon: Brain },
  ];

  const handleTokenCreated = (tokenData) => {
    setUserTokens(prev => [...prev, tokenData]);
    setGameStats(prev => ({
      ...prev,
      tokensCreated: prev.tokensCreated + 1,
      experience: prev.experience + 100,
      level: Math.floor((prev.experience + 100) / 500) + 1,
    }));
  };

  return (
    <div className="min-h-screen bg-space-gradient">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="glass-effect rounded-2xl p-8 max-w-md w-full">
              <h1 className="text-3xl font-bold text-red-600 mb-4">
                Welcome to BaseToken Forge
              </h1>
              <p className="text-gray-300 mb-6">
                Learn ERC20 token creation through an interactive game experience on Base Sepolia testnet.
              </p>
              <ConnectButton />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="glass-effect rounded-xl p-4 mb-6">
                <GameProgress stats={gameStats} />
              </div>
              
              <nav className="glass-effect rounded-xl p-4">
                <div className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                          activeTab === tab.id
                            ? 'bg-space-blue text-red-600 neon-border'
                            : 'text-gray-300 hover:bg-space-light hover:text-white'
                        }`}
                      >
                        <Icon size={20} />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </nav>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="glass-effect rounded-xl p-6">
                {activeTab === 'dashboard' && (
                  <Dashboard 
                    userTokens={userTokens} 
                    gameStats={gameStats}
                    onTabChange={setActiveTab}
                  />
                )}
                {activeTab === 'create' && (
                  <TokenCreator 
                    onTokenCreated={handleTokenCreated}
                    gameStats={gameStats}
                  />
                )}
                {activeTab === 'mint' && (
                  <TokenMinter 
                    userTokens={userTokens}
                    onStatsUpdate={setGameStats}
                  />
                )}
                {activeTab === 'insights' && (
                  <AIInsights 
                    userTokens={userTokens}
                    gameStats={gameStats}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;