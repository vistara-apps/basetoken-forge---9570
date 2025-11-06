import React from 'react';
import { Brain, TrendingUp, AlertCircle } from 'lucide-react';

const AIInsights = ({ userTokens, gameStats }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neon-red mb-2">AI Insights</h2>
        <p className="text-gray-400">
          Get intelligent analysis and recommendations for your tokens
        </p>
      </div>

      {userTokens.length === 0 ? (
        <div className="bg-space-light/30 rounded-lg p-8 border border-red-600 text-center retro-card">
          <Brain className="text-red-400 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-semibold text-neon-red mb-2">No Tokens Yet</h3>
          <p className="text-gray-400">
            Create your first token to receive AI-powered insights and recommendations!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-space-light/50 rounded-lg p-6 border border-red-600 retro-card">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="text-green-400" size={24} />
              <h3 className="text-lg font-semibold text-neon-red">Portfolio Analysis</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Total Tokens Created</p>
                <p className="text-2xl font-bold text-neon-red">{userTokens.length}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Combined Supply</p>
                <p className="text-2xl font-bold text-neon-red">
                  {userTokens.reduce((sum, token) => sum + (token.totalSupply || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 retro-card">
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-red-400 mt-0.5" size={16} />
              <div>
                <h4 className="text-red-400 font-medium text-sm mb-2">AI Recommendation</h4>
                <p className="text-gray-300 text-sm">
                  Your tokens are performing well! Consider implementing additional features like 
                  burning mechanisms or staking rewards to increase utility and engagement.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
