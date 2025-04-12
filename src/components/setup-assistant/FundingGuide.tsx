import React, { useState } from 'react';

interface FundingOption {
  id: string;
  name: string;
  amount: number;
  description: string;
  channels: number;
}

interface FundingGuideProps {
  onFundingSelected: (amount: number) => void;
  onBack: () => void;
}

const FundingGuide: React.FC<FundingGuideProps> = ({ onFundingSelected, onBack }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const fundingOptions: FundingOption[] = [
    {
      id: 'beginner',
      name: 'Beginner',
      amount: 100000, // 100,000 sats
      description: 'Perfect for learning and small transactions',
      channels: 2
    },
    {
      id: 'standard',
      name: 'Standard',
      amount: 500000, // 500,000 sats
      description: 'Balanced for most users',
      channels: 3
    },
    {
      id: 'advanced',
      name: 'Advanced',
      amount: 2000000, // 2,000,000 sats
      description: 'For frequent users with higher volume',
      channels: 5
    }
  ];
  
  const handleContinue = () => {
    if (!selectedOption) return;
    
    const option = fundingOptions.find(opt => opt.id === selectedOption);
    if (option) {
      onFundingSelected(option.amount);
    }
  };
  
  // Format satoshis to both BTC and USD
  const formatSats = (sats: number) => {
    const btc = (sats / 100000000).toFixed(8);
    // Assuming 1 BTC = $50,000 for demo purposes
    const usd = ((sats / 100000000) * 50000).toFixed(2);
    
    return {
      btc,
      usd
    };
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Fund Your Lightning Wallet</h2>
      <p className="text-gray-600 mb-6">
        Choose how much you'd like to fund your wallet with. This amount will determine how many channels you can open and the total payment capacity.
      </p>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Recommended Funding Amounts:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fundingOptions.map((option) => {
            const { btc, usd } = formatSats(option.amount);
            
            return (
              <div
                key={option.id}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedOption === option.id 
                    ? 'border-lightning-primary bg-lightning-primary/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedOption(option.id)}
              >
                <h4 className="font-medium text-lg">{option.name}</h4>
                <div className="text-lightning-primary font-bold mt-1">
                  {option.amount.toLocaleString()} sats
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {btc} BTC (≈ ${usd})
                </div>
                <div className="mt-2 text-sm text-gray-600">{option.description}</div>
                <div className="mt-2 text-sm font-medium">Recommended channels: {option.channels}</div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md mb-8">
        <h3 className="font-medium text-gray-900 mb-2">What Are Lightning Channels?</h3>
        <p className="text-sm text-gray-600 mb-3">
          Lightning channels are connections between your node and other nodes on the network. Each channel:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
          <li>Requires on-chain Bitcoin to open (one-time fee)</li>
          <li>Determines your payment capacity to different parts of the network</li>
          <li>Can be rebalanced as you send and receive payments</li>
          <li>More channels = better connectivity and reliability</li>
        </ul>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!selectedOption}
          className="px-4 py-2 bg-blue-950 text-white rounded-md hover:bg-blue-800 disabled:opacity-70 flex items-center cursor-pointer"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default FundingGuide;