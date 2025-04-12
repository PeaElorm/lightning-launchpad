import React, { useState } from 'react';

interface WalletCreationFormProps {
  onWalletCreated: (alias: string) => void;
  onBack: () => void;
}

const WalletCreationForm: React.FC<WalletCreationFormProps> = ({ onWalletCreated, onBack }) => {
  const [alias, setAlias] = useState('My Lightning Wallet');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!alias.trim()) {
      setError('Please enter a wallet name');
      return;
    }
    
    if (!password) {
      setError('Please enter a password');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Simulate wallet creation process
    setIsCreating(true);
    setError('');
    
    // Simulate API call delay
    setTimeout(() => {
      setIsCreating(false);
      onWalletCreated(alias);
    }, 1500);
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Your Lightning Wallet</h2>
      <p className="text-gray-600 mb-6">
        Your Lightning wallet will store your funds and manage your payment channels.
      </p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="alias" className="block text-sm font-medium text-gray-700 mb-1">
            Wallet Name
          </label>
          <input
            id="alias"
            type="text"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lightning-primary focus:border-transparent"
            placeholder="My Lightning Wallet"
          />
          <p className="mt-1 text-sm text-gray-500">This is how your wallet will appear to others on the network</p>
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lightning-primary focus:border-transparent"
          />
          <p className="mt-1 text-sm text-gray-500">Choose a strong password to secure your wallet</p>
        </div>
        
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lightning-primary focus:border-transparent"
          />
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h3 className="font-medium text-gray-900 mb-2">What's happening behind the scenes:</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
            <li>A new Lightning node identity is being created</li>
            <li>A public/private keypair will be generated for security</li>
            <li>Your node will prepare to connect to the Lightning Network</li>
            <li>In a real wallet, you would be given a recovery seed phrase to back up</li>
          </ul>
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isCreating}
            className="px-4 py-2 bg-blue-950 text-white rounded-md hover:bg-blue-800 disabled:opacity-70 flex items-center cursor-pointer"
          >
            {isCreating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : 'Create Wallet'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WalletCreationForm;