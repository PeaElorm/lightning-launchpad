import React from 'react';
import ChannelAnimation from './ChannelAnimation';
import NetworkExplainer from './NetworkExplainer';

const VisualExplainer: React.FC = () => {
  return (
    <div className="space-y-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Understanding Lightning Network
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Interactive visualizations that explain how Lightning works
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">What is Lightning Network?</h2>
          <p className="text-gray-600 mb-4">
            The Lightning Network is a "Layer 2" payment protocol designed to work on top of Bitcoin. 
            It enables fast transactions between participating nodes and has been proposed as a solution 
            to the Bitcoin scalability problem.
          </p>
          <p className="text-gray-600 mb-4">
            Lightning transactions are typically much faster and cheaper than regular Bitcoin transactions, 
            as they don't need to be recorded on the blockchain until the channel is closed.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium">Off-Chain Transactions</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Most transactions happen "off-chain" between participants, reducing blockchain congestion
                </p>
              </div>
            </div>
            <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium">Multi-Hop Payments</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Payments can be routed through multiple channels to reach their destination
                </p>
              </div>
            </div>
            <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium">Low-Cost Micro-Payments</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Enables transactions as small as a few satoshis (fractions of a cent)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Channel Animation Section */}
      <ChannelAnimation />

      {/* Network Routing Section */}
      <NetworkExplainer />
    </div>
  );
};

export default VisualExplainer;