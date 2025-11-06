import React from 'react';
import { Zap, AlertCircle } from 'lucide-react';

const TokenMinter = ({ userTokens }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neon-red mb-2">Mint & Transfer</h2>
        <p className="text-gray-400">
          Mint new tokens and transfer them to other addresses
        </p>
      </div>

      {userTokens.length === 0 ? (
        <div className="bg-space-light/30 rounded-lg p-8 border border-red-600 text-center retro-card">
          <Zap className="text-red-400 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-semibold text-neon-red mb-2">No Tokens Available</h3>
          <p className="text-gray-400">
            Create a token first to start minting and transferring!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 retro-card">
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-yellow-400 mt-0.5" size={16} />
              <div>
                <h4 className="text-yellow-400 font-medium text-sm mb-2">Coming Soon</h4>
                <p className="text-gray-300 text-sm">
                  Minting and transfer functionality will be available in the next update. 
                  Stay tuned for more features!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-space-light/50 rounded-lg p-6 border border-red-600 retro-card">
            <h3 className="text-lg font-semibold text-neon-red mb-4">Your Tokens</h3>
            <div className="space-y-3">
              {userTokens.map((token, index) => (
                <div key={index} className="bg-space-dark p-4 rounded-lg border border-red-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-neon-red font-medium">{token.name}</h4>
                      <p className="text-gray-400 text-sm">{token.symbol}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-neon-red font-bold">{token.totalSupply?.toLocaleString()}</p>
                      <p className="text-gray-400 text-sm">Total Supply</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenMinter;
