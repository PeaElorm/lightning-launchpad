import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

enum ChannelState {
  CLOSED = 'closed',
  OPENING = 'opening',
  OPEN = 'open',
  TRANSACTING = 'transacting',
  CLOSING = 'closing'
}

const ChannelAnimation: React.FC = () => {
  const [channelState, setChannelState] = useState<ChannelState>(ChannelState.CLOSED);
  const [localBalance, setLocalBalance] = useState(500000); // 500k sats
  const [remoteBalance, setRemoteBalance] = useState(500000);
  const [explanation, setExplanation] = useState<string>('This visualization demonstrates how Lightning channels work. Click "Create Channel" to begin.');

  // Handle state transitions
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    if (channelState === ChannelState.OPENING) {
      setExplanation('Opening a channel requires an on-chain Bitcoin transaction. This transaction locks funds that both parties can use for payments.');
      timer = setTimeout(() => {
        setChannelState(ChannelState.OPEN);
      }, 3000);
    } 
    else if (channelState === ChannelState.OPEN) {
      setExplanation('Channel open! Both parties can now transact instantly without touching the blockchain. Try sending a payment to see how balances shift.');
    }
    else if (channelState === ChannelState.TRANSACTING) {
      setExplanation('Payments update the balance sheet between parties. This happens instantly and with minimal fees.');
      timer = setTimeout(() => {
        setChannelState(ChannelState.OPEN);
      }, 2000);
    }
    else if (channelState === ChannelState.CLOSING) {
      setExplanation('Closing a channel settles the final balances back to the blockchain. Each party receives their respective funds.');
      timer = setTimeout(() => {
        setChannelState(ChannelState.CLOSED);
        setLocalBalance(500000);
        setRemoteBalance(500000);
      }, 3000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [channelState]);

  // Format satoshis to BTC
  const formatSats = (sats: number) => {
    return (sats / 100000000).toFixed(8);
  };

  return (
    <div className="bg-white shadow overflow-hidden rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Lightning Channels Explained</h2>
        
        <div className="mb-4">
          <p className="text-gray-600">{explanation}</p>
        </div>
        
        <div className="relative h-64 mb-8 border-2 border-gray-200 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-between p-4">
            {/* Your Node */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-800 rounded-full flex items-center justify-center mb-2">
                <span className="text-white text-2xl">👤</span>
              </div>
              <p className="font-medium">Your Node</p>
              <p className="text-sm text-gray-600">{formatSats(localBalance)} BTC</p>
            </div>
            
            {/* Channel */}
            <div className="flex-1 mx-4 relative">
              {channelState === ChannelState.CLOSED && (
                <div className="h-2 bg-gray-300 rounded-full"></div>
              )}
              
              {channelState === ChannelState.OPENING && (
                <motion.div 
                  className="h-2 bg-yellow-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2 }}
                ></motion.div>
              )}
              
              {(channelState === ChannelState.OPEN || channelState === ChannelState.TRANSACTING) && (
                <div className="flex h-2 rounded-full overflow-hidden">
                  <motion.div 
                    className="bg-blue-800 h-full"
                    initial={{ width: `${(localBalance / (localBalance + remoteBalance)) * 100}%` }}
                    animate={{ width: `${(localBalance / (localBalance + remoteBalance)) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  ></motion.div>
                  <motion.div 
                    className="bg-lightning-accent h-full"
                    initial={{ width: `${(remoteBalance / (localBalance + remoteBalance)) * 100}%` }}
                    animate={{ width: `${(remoteBalance / (localBalance + remoteBalance)) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  ></motion.div>
                </div>
              )}
              
              {channelState === ChannelState.CLOSING && (
                <motion.div 
                  className="h-2 bg-red-500 rounded-full"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 2 }}
                ></motion.div>
              )}
              
              {channelState === ChannelState.TRANSACTING && (
                <motion.div
                  className="w-6 h-6 rounded-full bg-green-500 absolute"
                  style={{ top: "-10px" }}
                  initial={{ x: 0 }}
                  animate={{ x: 350 }}
                  transition={{ duration: 1 }}
                >
                  <span className="text-white text-xs flex items-center justify-center h-full">₿</span>
                </motion.div>
              )}
            </div>
            
            {/* Remote Node */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-lightning-accent rounded-full flex items-center justify-center mb-2">
                <span className="text-white text-2xl">🏪</span>
              </div>
              <p className="font-medium">Coffee Shop</p>
              <p className="text-sm text-gray-600">{formatSats(remoteBalance)} BTC</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 justify-center">
          {channelState === ChannelState.CLOSED && (
            <button 
              onClick={() => setChannelState(ChannelState.OPENING)}
              className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-800/90 cursor-pointer"
            >
              Create Channel
            </button>
          )}
          
          {(channelState === ChannelState.OPEN) && (
            <>
              <button 
                onClick={() => {
                  if (localBalance >= 100000) {
                    setChannelState(ChannelState.TRANSACTING);
                    setLocalBalance(prev => prev - 100000);
                    setRemoteBalance(prev => prev + 100000);
                  }
                }}
                disabled={localBalance < 100000}
                className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-800/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Send Payment (0.001 BTC)
              </button>
              
              <button 
                onClick={() => setChannelState(ChannelState.CLOSING)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 cursor-pointer"
              >
                Close Channel
              </button>
            </>
          )}
        </div>
        
        <div className="mt-6">
          <h3 className="font-semibold text-gray-700 mb-2">Key Concepts:</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Channels allow instant, low-fee transactions between two connected parties</li>
            <li>Only channel opening and closing require on-chain Bitcoin transactions</li>
            <li>Each channel has a capacity (total funds) that can be moved back and forth</li>
            <li>Channel balances update with each payment, shifting funds between parties</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChannelAnimation;