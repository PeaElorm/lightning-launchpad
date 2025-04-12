import { useState, useEffect, useCallback } from 'react';
import { getLightningApi, initializeLightningApi, createDemoLightningApi } from '../services/LightningApiService';

interface LightningConnectionConfig {
  baseUrl: string;
  macaroonHex: string;
}

interface Channel {
  channelPoint: string;
  active: boolean;
  remotePubkey: string;
  capacity: string;
  localBalance: string;
  remoteBalance: string;
  commitFee: string;
  commitWeight: string;
  feePerKw: string;
  unsettledBalance: string;
  totalSatoshisSent: string;
  totalSatoshisReceived: string;
  numUpdates: string;
  pendingHtlcs: any[];
  csvDelay: number;
  private: boolean;
  initiator: boolean;
  chanStatusFlags: string;
  localChanReserveSat: string;
  remoteChanReserveSat: string;
  staticRemoteKey: boolean;
  lifetime: string;
  uptime: string;
  closeAddress: string;
  pushAmountSat: string;
  thawHeight: number;
  [key: string]: any;
}

interface NodeInfo {
  pubkey: string;
  alias: string;
  channels: number;
  capacity: string;
  score?: number;
  lastUpdate?: number;
  color?: string;
  [key: string]: any;
}

interface NetworkInfo {
  graphDiameter: number;
  avgOutDegree: number;
  maxOutDegree: number;
  numNodes: number;
  numChannels: number;
  totalNetworkCapacity: string;
  avgChannelSize: string;
  minChannelSize: string;
  maxChannelSize: string;
  medianChannelSizeSat: string;
  [key: string]: any;
}

export const useLightning = (demoMode = false) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nodeInfo, setNodeInfo] = useState<any>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [pendingChannels, setPendingChannels] = useState<any[]>([]);
  const [walletBalance, setWalletBalance] = useState<any>(null);
  const [channelBalance, setChannelBalance] = useState<any>(null);
  const [recommendedNodes, setRecommendedNodes] = useState<NodeInfo[]>([]);
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  
  // Connect to Lightning API
  const connect = useCallback(async (config?: LightningConnectionConfig) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use demo or real connection
      if (demoMode) {
        createDemoLightningApi();
      } else if (config) {
        initializeLightningApi(config);
      }
      
      // Test connection by fetching node info
      const api = demoMode ? createDemoLightningApi() : getLightningApi();
      const info = await api.getWalletInfo();
      setNodeInfo(info);
      setIsConnected(true);
      
      // Load initial data
      await refreshData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to Lightning node';
      setError(errorMessage);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, [demoMode]);
  
  // Refresh all data
  const refreshData = useCallback(async () => {
    if (!isConnected && !demoMode) return;
    
    setIsLoading(true);
    
    try {
      const api = demoMode ? createDemoLightningApi() : getLightningApi();
      
      // Load multiple data types in parallel
      const [
        channelsResponse,
        pendingChannelsResponse,
        walletBalanceResponse,
        channelBalanceResponse,
        recommendedNodesResponse,
        networkInfoResponse
      ] = await Promise.all([
        api.listChannels(),
        api.getPendingChannels(),
        api.getWalletBalance(),
        api.getChannelBalance(),
        api.getRecommendedNodes(),
        api.getNetworkInfo()
      ]);
      
      setChannels(channelsResponse || []);
      setPendingChannels(pendingChannelsResponse?.pending_channels || []);
      setWalletBalance(walletBalanceResponse);
      setChannelBalance(channelBalanceResponse);
      setRecommendedNodes(recommendedNodesResponse || []);
      setNetworkInfo(networkInfoResponse);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh Lightning data';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, demoMode]);
  
  // Open a new channel
  const openChannel = useCallback(async (nodePubkey: string, amount: number, pushAmount: number = 0) => {
    if (!isConnected && !demoMode) {
      setError('Not connected to Lightning node');
      return null;
    }
    
    setIsLoading(true);
    
    try {
      const api = demoMode ? createDemoLightningApi() : getLightningApi();
      const result = await api.openChannel(nodePubkey, amount, pushAmount);
      
      // Refresh channels after opening
      await refreshData();
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to open channel';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, demoMode, refreshData]);
  
  // Calculate total inbound and outbound liquidity
  const calculateLiquidity = useCallback(() => {
    const total = channels.reduce((acc, channel) => {
      const localBalance = parseInt(channel.localBalance || '0');
      const remoteBalance = parseInt(channel.remoteBalance || '0');
      
      return {
        inbound: acc.inbound + remoteBalance,
        outbound: acc.outbound + localBalance,
        capacity: acc.capacity + parseInt(channel.capacity || '0')
      };
    }, { inbound: 0, outbound: 0, capacity: 0 });
    
    return total;
  }, [channels]);
  
  // Auto-connect in demo mode
  useEffect(() => {
    if (demoMode) {
      connect();
    }
  }, [demoMode, connect]);
  
  return {
    isConnected,
    isLoading,
    error,
    nodeInfo,
    channels,
    pendingChannels,
    walletBalance,
    channelBalance,
    recommendedNodes,
    networkInfo,
    liquidity: calculateLiquidity(),
    connect,
    refreshData,
    openChannel
  };
};

export default useLightning;