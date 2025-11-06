import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork } from 'wagmi';
import { Coins, AlertTriangle } from 'lucide-react';

const Header = () => {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();

  return (
    <header className="glass-effect border-b border-red-600">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-space-red rounded-lg retro-glow">
              <Coins className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-neon-red">BaseToken Forge</h1>
              <p className="text-sm text-gray-400">ERC20 Token Creation Game</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isConnected && chain && chain.id !== 84532 && (
              <div className="flex items-center space-x-2 bg-yellow-500/20 text-yellow-400 px-3 py-2 rounded-lg">
                <AlertTriangle size={16} />
                <span className="text-sm">Switch to Base Sepolia</span>
              </div>
            )}
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
