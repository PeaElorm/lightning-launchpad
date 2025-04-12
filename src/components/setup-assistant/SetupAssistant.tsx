import React, { useState } from 'react';
import WalletCreationForm from './WalletCreationForm';
import FundingGuide from './FundingGuide';

enum SetupStep {
  INTRO = 'intro',
  CREATE_WALLET = 'create_wallet',
  FUNDING = 'funding',
  CHANNELS = 'channels',
  COMPLETE = 'complete'
}

const SetupAssistant: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<SetupStep>(SetupStep.INTRO);
  const [walletInfo, setWalletInfo] = useState<{alias: string, balance: number} | null>(null);
  
  const goToNextStep = () => {
    switch (currentStep) {
      case SetupStep.INTRO:
        setCurrentStep(SetupStep.CREATE_WALLET);
        break;
      case SetupStep.CREATE_WALLET:
        setCurrentStep(SetupStep.FUNDING);
        break;
      case SetupStep.FUNDING:
        setCurrentStep(SetupStep.CHANNELS);
        break;
      case SetupStep.CHANNELS:
        setCurrentStep(SetupStep.COMPLETE);
        break;
      default:
        break;
    }
  };
  
  const goToPreviousStep = () => {
    switch (currentStep) {
      case SetupStep.CREATE_WALLET:
        setCurrentStep(SetupStep.INTRO);
        break;
      case SetupStep.FUNDING:
        setCurrentStep(SetupStep.CREATE_WALLET);
        break;
      case SetupStep.CHANNELS:
        setCurrentStep(SetupStep.FUNDING);
        break;
      case SetupStep.COMPLETE:
        setCurrentStep(SetupStep.CHANNELS);
        break;
      default:
        break;
    }
  };
  
  const handleWalletCreated = (alias: string) => {
    setWalletInfo({ alias, balance: 0 });
    goToNextStep();
  };
  
  const handleFundingSelected = (amount: number) => {
    setWalletInfo(prev => prev ? { ...prev, balance: amount } : { alias: 'My Wallet', balance: amount });
    goToNextStep();
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case SetupStep.INTRO:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your Lightning Journey?</h2>
            <p className="text-lg text-gray-600 mb-8">
              We'll guide you through creating your first Lightning wallet, funding it, and setting up channels.
            </p>
            <button
              onClick={goToNextStep}
              className="nline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white  bg-blue-950 hover:bg-blue-800"
            >
              Let's Get Started
            </button>
          </div>
        );
      
      case SetupStep.CREATE_WALLET:
        return <WalletCreationForm onWalletCreated={handleWalletCreated} onBack={goToPreviousStep} />;
      
      case SetupStep.FUNDING:
        return <FundingGuide onFundingSelected={handleFundingSelected} onBack={goToPreviousStep} />;
      
      case SetupStep.CHANNELS:
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recommended Channels</h2>
            <p className="text-gray-600 mb-6">
              Based on your funding amount, here are some recommended channels to open:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-800 transition-colors">
                <h3 className="font-medium text-lg mb-2">ACINQ</h3>
                <div className="text-sm text-gray-600 mb-2">
                  <p>Well-connected node with high uptime</p>
                  <p>Reasonable fees and good routing</p>
                </div>
                <button className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-800/90 w-full mt-2">
                  Connect (Simulated)
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-800 transition-colors">
                <h3 className="font-medium text-lg mb-2">Lightning Labs</h3>
                <div className="text-sm text-gray-600 mb-2">
                  <p>Highly reliable with great connectivity</p>
                  <p>Excellent for first-time users</p>
                </div>
                <button className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-800/90 w-full mt-2">
                  Connect (Simulated)
                </button>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={goToPreviousStep}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Back
              </button>
              <button
                onClick={goToNextStep}
                className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-800/90"
              >
                Continue
              </button>
            </div>
          </div>
        );
      
      case SetupStep.COMPLETE:
        return (
          <div className="text-center">
            <div className="inline-block mb-6">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Setup Complete!</h2>
            <p className="text-lg text-gray-600 mb-6">
              Congratulations! You've successfully set up your Lightning wallet.
            </p>
            
            {walletInfo && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6 inline-block">
                <h3 className="font-medium text-gray-900 mb-2">Your Wallet Summary</h3>
                <div className="text-left">
                  <p><span className="font-medium">Alias:</span> {walletInfo.alias}</p>
                  <p><span className="font-medium">Balance:</span> {walletInfo.balance.toLocaleString()} sats</p>
                  <p><span className="font-medium">Channels:</span> 2 (simulated)</p>
                </div>
              </div>
            )}
            
            <p className="text-gray-600 mb-8">
              In a real Lightning wallet, you would now be ready to make payments, receive funds, and manage your channels.
            </p>
            
            <button
              onClick={() => setCurrentStep(SetupStep.INTRO)}
              className="px-6 py-3 bg-blue-800 text-white font-medium rounded-md hover:bg-blue-800/90"
            >
              Start Over
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  // Progress bar calculation
  const getProgressPercentage = () => {
    switch (currentStep) {
      case SetupStep.INTRO:
        return 0;
      case SetupStep.CREATE_WALLET:
        return 25;
      case SetupStep.FUNDING:
        return 50;
      case SetupStep.CHANNELS:
        return 75;
      case SetupStep.COMPLETE:
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Lightning Wallet Setup
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Your step-by-step guide to getting started with Lightning
        </p>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-8 bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-800 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
          style={{ width: `${getProgressPercentage()}%` }}
        ></div>
      </div>
      
      {/* Step Labels */}
      <div className="grid grid-cols-5 mb-8 text-sm">
        <div className={`text-center ${currentStep === SetupStep.INTRO ? 'text-blue-800 font-medium' : ''}`}>Intro</div>
        <div className={`text-center ${currentStep === SetupStep.CREATE_WALLET ? 'text-blue-800 font-medium' : ''}`}>Create Wallet</div>
        <div className={`text-center ${currentStep === SetupStep.FUNDING ? 'text-blue-800 font-medium' : ''}`}>Funding</div>
        <div className={`text-center ${currentStep === SetupStep.CHANNELS ? 'text-blue-800 font-medium' : ''}`}>Channels</div>
        <div className={`text-center ${currentStep === SetupStep.COMPLETE ? 'text-blue-800 font-medium' : ''}`}>Complete</div>
      </div>
      
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-8 sm:p-10">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default SetupAssistant;