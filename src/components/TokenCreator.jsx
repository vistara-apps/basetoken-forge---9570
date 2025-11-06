import React, { useState } from 'react';
import { useAccount, useWalletClient, usePublicClient } from 'wagmi';
import { parseEther, encodeFunctionData } from 'viem';
import { Coins, Info, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const TokenCreator = ({ onTokenCreated, gameStats }) => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    totalSupply: '',
    description: '',
    decimals: 18,
  });
  
  const [isCreating, setIsCreating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  // Simple ERC20 contract bytecode (minimal implementation)
  const ERC20_BYTECODE = "0x608060405234801561001057600080fd5b506040516108a93803806108a98339818101604052810190610032919061024a565b8360039081610041919061049c565b50826004908161005191906104a0565b508160058190555080600660006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060055460008060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050505050610570565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61013a826100f1565b810181811067ffffffffffffffff8211171561015957610158610102565b5b80604052505050565b600061016c6100e8565b90506101788282610131565b919050565b600067ffffffffffffffff82111561019857610197610102565b5b6101a1826100f1565b9050602081019050919050565b60005b838110156101cc5780820151818401526020810190506101b1565b838111156101db576000848401525b50505050565b6000601f19601f8301169050919050565b6000610221826101b6565b61022b81856101c1565b935061023b8185602086016101d2565b61024481610205565b840191505092915050565b6000602082019050818103600083015261026981846102166565b905092915050565b60008115159050919050565b61028681610271565b82525050565b60006020820190506102a1600083018461027d565b92915050565b6000819050919050565b6102ba816102a7565b82525050565b60006020820190506102d560008301846102b1565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061032857607f821691505b60208210810361033b5761033a6102db565b5b5091905056fea2646970667358221220a8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b864736f6c634300080f0033";

  const steps = [
    {
      title: 'Token Details',
      description: 'Define your token\'s basic information',
      fields: ['name', 'symbol', 'description']
    },
    {
      title: 'Token Economics',
      description: 'Set supply and decimal configuration',
      fields: ['totalSupply', 'decimals']
    },
    {
      title: 'Review & Deploy',
      description: 'Review your token and deploy to Base Sepolia',
      fields: []
    }
  ];

  const validateStep = (step) => {
    const newErrors = {};
    const currentFields = steps[step - 1].fields;

    currentFields.forEach(field => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        newErrors[field] = 'This field is required';
      }
    });

    if (step === 1) {
      if (formData.symbol && formData.symbol.length > 10) {
        newErrors.symbol = 'Symbol should be 10 characters or less';
      }
    }

    if (step === 2) {
      if (formData.totalSupply && (isNaN(formData.totalSupply) || Number(formData.totalSupply) <= 0)) {
        newErrors.totalSupply = 'Total supply must be a positive number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const deployToken = async () => {
    if (!walletClient || !address) return;

    setIsCreating(true);
    try {
      // Create constructor parameters
      const constructorParams = encodeFunctionData({
        abi: [
          {
            type: 'constructor',
            inputs: [
              { name: '_name', type: 'string' },
              { name: '_symbol', type: 'string' },
              { name: '_totalSupply', type: 'uint256' },
              { name: '_owner', type: 'address' }
            ]
          }
        ],
        args: [
          formData.name,
          formData.symbol,
          parseEther(formData.totalSupply.toString()),
          address
        ]
      });

      // Deploy contract
      const hash = await walletClient.deployContract({
        abi: [],
        bytecode: ERC20_BYTECODE + constructorParams.slice(2),
        account: address,
      });

      // Wait for transaction receipt
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      const tokenData = {
        ...formData,
        address: receipt.contractAddress,
        totalSupply: Number(formData.totalSupply),
        deployedAt: new Date().toISOString(),
        transactionHash: hash,
      };

      onTokenCreated(tokenData);
      
      // Reset form
      setFormData({
        name: '',
        symbol: '',
        totalSupply: '',
        description: '',
        decimals: 18,
      });
      setCurrentStep(1);

    } catch (error) {
      console.error('Error deploying token:', error);
      setErrors({ deploy: error.message || 'Failed to deploy token' });
    } finally {
      setIsCreating(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Token Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., My Awesome Token"
                className={`w-full px-4 py-3 bg-space-dark border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-red ${
                  errors.name ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Token Symbol *
              </label>
              <input
                type="text"
                value={formData.symbol}
                onChange={(e) => handleInputChange('symbol', e.target.value.toUpperCase())}
                placeholder="e.g., MAT"
                className={`w-full px-4 py-3 bg-space-dark border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-red ${
                  errors.symbol ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              {errors.symbol && <p className="text-red-400 text-sm mt-1">{errors.symbol}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your token's purpose and utility..."
                rows={3}
                className={`w-full px-4 py-3 bg-space-dark border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-red ${
                  errors.description ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Total Supply *
              </label>
              <input
                type="number"
                value={formData.totalSupply}
                onChange={(e) => handleInputChange('totalSupply', e.target.value)}
                placeholder="e.g., 1000000"
                className={`w-full px-4 py-3 bg-space-dark border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-red ${
                  errors.totalSupply ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              {errors.totalSupply && <p className="text-red-400 text-sm mt-1">{errors.totalSupply}</p>}
              <p className="text-gray-400 text-sm mt-1">
                The total number of tokens that will be created
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Decimals
              </label>
              <select
                value={formData.decimals}
                onChange={(e) => handleInputChange('decimals', Number(e.target.value))}
                className="w-full px-4 py-3 bg-space-dark border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-red"
              >
                <option value={18}>18 (Standard)</option>
                <option value={8}>8</option>
                <option value={6}>6</option>
                <option value={0}>0 (No decimals)</option>
              </select>
              <p className="text-gray-400 text-sm mt-1">
                Number of decimal places for your token (18 is standard)
              </p>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 retro-card">
              <div className="flex items-start space-x-3">
                <Info className="text-red-400 mt-0.5" size={16} />
                <div>
                  <h4 className="text-red-400 font-medium text-sm">Token Economics Tip</h4>
                  <p className="text-gray-300 text-sm mt-1">
                    Consider your token's use case when setting supply. Utility tokens often have larger supplies, 
                    while governance tokens may have smaller, more controlled supplies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-space-light/50 rounded-lg p-6 border border-red-600 retro-card">
              <h4 className="text-lg font-semibold text-neon-red mb-4">Token Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Name</p>
                  <p className="text-neon-red font-medium">{formData.name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Symbol</p>
                  <p className="text-neon-red font-medium">{formData.symbol}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Supply</p>
                  <p className="text-neon-red font-medium">{Number(formData.totalSupply).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Decimals</p>
                  <p className="text-neon-red font-medium">{formData.decimals}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-400 text-sm">Description</p>
                <p className="text-neon-red">{formData.description}</p>
              </div>
            </div>

            {errors.deploy && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="text-red-400" size={16} />
                  <p className="text-red-400 text-sm">{errors.deploy}</p>
                </div>
              </div>
            )}

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 retro-card">
              <div className="flex items-start space-x-3">
                <AlertCircle className="text-yellow-400 mt-0.5" size={16} />
                <div>
                  <h4 className="text-yellow-400 font-medium text-sm">Deployment Notice</h4>
                  <p className="text-gray-300 text-sm mt-1">
                    Your token will be deployed to Base Sepolia testnet. Make sure you have testnet ETH for gas fees.
                    This is a learning environment - tokens have no real value.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neon-red mb-2">Create Token</h2>
          <p className="text-gray-400">
            Launch your own ERC20 token on Base Sepolia testnet
          </p>
        </div>
        <div className="flex items-center space-x-2 text-neon-red">
          <Coins size={24} />
          <span className="font-medium">Level {gameStats.level}</span>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep > index + 1 
                ? 'bg-green-500 border-green-500 text-white' 
                : currentStep === index + 1
                ? 'bg-neon-red border-neon-red text-white'
                : 'border-gray-600 text-gray-400'
            }`}>
              {currentStep > index + 1 ? (
                <CheckCircle size={20} />
              ) : (
                <span className="font-bold">{index + 1}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-20 h-0.5 mx-4 ${
                currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-600'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-space-light/30 rounded-lg p-6 border border-red-600 retro-card">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-neon-red mb-2">{steps[currentStep - 1].title}</h3>
          <p className="text-gray-400 text-sm">{steps[currentStep - 1].description}</p>
        </div>

        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-6 py-3 bg-space-dark border border-red-600 text-red-400 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-space-light transition-all"
          >
            Previous
          </button>

          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all retro-glow"
            >
              Next
            </button>
          ) : (
            <button
              onClick={deployToken}
              disabled={isCreating}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 retro-glow"
            >
              {isCreating ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Deploying...</span>
                </>
              ) : (
                <>
                  <Coins size={20} />
                  <span>Deploy Token</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Educational Tips */}
      <div className="bg-space-light/20 rounded-lg p-4 border border-red-600 retro-card">
        <div className="flex items-start space-x-3">
          <Info className="text-red-400 mt-0.5" size={16} />
          <div>
            <h4 className="text-red-400 font-medium text-sm mb-2">Learning Tip</h4>
            <p className="text-gray-300 text-sm">
              ERC20 tokens are the standard for fungible tokens on Ethereum and compatible chains like Base. 
              They follow a specific interface that allows them to be easily integrated with wallets, exchanges, and dApps.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenCreator;
