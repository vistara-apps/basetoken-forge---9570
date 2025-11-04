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
  const ERC20_BYTECODE = "0x608060405234801561001057600080fd5b506040516108a93803806108a98339818101604052810190610032919061024a565b8360039081610041919061049c565b50826004908161005191906104a0565b508160058190555080600660006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060055460008060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050505050610570565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61013a826100f1565b810181811067ffffffffffffffff8211171561015957610158610102565b5b80604052505050565b600061016c6100e8565b90506101788282610131565b919050565b600067ffffffffffffffff82111561019857610197610102565b5b6101a1826100f1565b9050602081019050919050565b60005b838110156101cc5780820151818401526020810190506101b1565b838111156101db576000848401525b50505050565b60006101f46101ef8461017d565b610162565b905082815260208101848484011115610210576102056100ec565b5b61021b8482856101ae565b509392505050565b600082601f830112610238576102376100e7565b5b81516102488482602086016101e1565b91505092915050565b60008060008060808587031215610265576102646100dd565b5b600085015167ffffffffffffffff811115610283576102826100e2565b5b61028f87828801610223565b945050602085015167ffffffffffffffff8111156102b0576102af6100e2565b5b6102bc87828801610223565b93505060406102cd87828801610223565b925050606085015167ffffffffffffffff8111156102ee576102ed6100e2565b5b6102fa87828801610223565b91505092959194509250565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061035857607f821691505b60208210810361036b5761036a610311565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026103d37fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82610396565b6103dd8683610396565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b600061042461041f61041a846103f5565b6103ff565b6103f5565b9050919050565b6000819050919050565b61043e83610409565b61045261044a8261042b565b8484546103a3565b825550505050565b600090565b61046761045a565b610472818484610435565b505050565b5b818110156104965761048b60008261045f565b600181019050610478565b5050565b601f8211156104db576104ac81610371565b6104b584610386565b810160208510156104c4578190505b6104d86104d085610386565b830182610477565b50505b505050565b600082821c905092915050565b60006104fe600019846008026104e0565b1980831691505092915050565b600061051783836104ed565b9150826002028217905092915050565b61053082610306565b67ffffffffffffffff81111561054957610548610102565b5b6105538254610340565b61055e8282856104a0565b600060209050601f8311600181146105915760008415610581578287015190505b61058b858261050b565b8655506105f3565b601f1984166105a186610371565b60005b828110156105c9578489015182556001820191506020850194506020810190506105a4565b868310156105e657848901516105e2601f8916826104ed565b8355505b6001600288020188555050505b505050505050565b610340806106096000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c806306fdde031461005c578063095ea7b31461007a57806318160ddd1461009857806323b872dd146100b6578063a9059cbb146100d4575b600080fd5b6100646100f2565b6040516100719190610180565b60405180910390f35b610082610184565b60405161008f91906101db565b60405180910390f35b6100a0610194565b6040516100ad91906101f6565b60405180910390f35b6100be61019e565b6040516100cb91906101db565b60405180910390f35b6100dc6101ae565b6040516100e991906101db565b60405180910390f35b60606003805461010190610240565b80601f016020809104026020016040519081016040528092919081815260200182805461012d90610240565b801561017a5780601f1061014f5761010080835404028352916020019161017a565b820191906000526020600020905b81548152906001019060200180831161015d57829003601f168201915b50505050509050919050565b60006001905092915050565b6000600554905090565b60006001905092915050565b60006001905092915050565b600081519050919050565b600082825260208201905092915050565b60005b838110156101f05780820151818401526020810190506101d5565b838111156101ff576000848401525b50505050565b6000601f19601f8301169050919050565b6000610221826101b6565b61022b81856101c1565b935061023b8185602086016101d2565b61024481610205565b840191505092915050565b6000602082019050818103600083015261026981846102166565b905092915050565b60008115159050919050565b61028681610271565b82525050565b60006020820190506102a1600083018461027d565b92915050565b6000819050919050565b6102ba816102a7565b82525050565b60006020820190506102d560008301846102b1565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061032857607f821691505b60208210810361033b5761033a6102db565b5b5091905056fea2646970667358221220a8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b864736f6c634300080f0033";

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
                className={`w-full px-4 py-3 bg-space-dark border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-blue ${
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
                className={`w-full px-4 py-3 bg-space-dark border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-blue ${
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
                className={`w-full px-4 py-3 bg-space-dark border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-blue ${
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
                className={`w-full px-4 py-3 bg-space-dark border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-blue ${
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
                className="w-full px-4 py-3 bg-space-dark border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
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

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="text-blue-400 mt-0.5" size={16} />
                <div>
                  <h4 className="text-blue-400 font-medium text-sm">Token Economics Tip</h4>
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
            <div className="bg-space-light/50 rounded-lg p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4">Token Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Name</p>
                  <p className="text-white font-medium">{formData.name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Symbol</p>
                  <p className="text-white font-medium">{formData.symbol}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Supply</p>
                  <p className="text-white font-medium">{Number(formData.totalSupply).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Decimals</p>
                  <p className="text-white font-medium">{formData.decimals}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-400 text-sm">Description</p>
                <p className="text-white">{formData.description}</p>
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

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
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
          <h2 className="text-2xl font-bold text-white mb-2">Create Token</h2>
          <p className="text-gray-400">
            Launch your own ERC20 token on Base Sepolia testnet
          </p>
        </div>
        <div className="flex items-center space-x-2 text-neon-blue">
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
                ? 'bg-neon-blue border-neon-blue text-white'
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
      <div className="bg-space-light/30 rounded-lg p-6 border border-white/10">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-2">
            {steps[currentStep - 1].title}
          </h3>
          <p className="text-gray-400">
            {steps[currentStep - 1].description}
          </p>
        </div>

        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        {currentStep < 3 ? (
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-neon-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Next
          </button>
        ) : (
          <button
            onClick={deployToken}
            disabled={isCreating}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isCreating ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Deploying...</span>
              </>
            ) : (
              <span>Deploy Token</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default TokenCreator;