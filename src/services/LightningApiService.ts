// src/services/LightningApiService.ts
import axios from 'axios';

interface LndRestConfig {
  baseUrl: string;
  macaroonHex: string;
}

class LightningApiService {
  private baseUrl: string;
  private macaroonHex: string;
  
  constructor(config: LndRestConfig) {
    this.baseUrl = config.baseUrl;
    this.macaroonHex = config.macaroonHex;
  }

  private getHeaders() {
    return {
      'Grpc-Metadata-macaroon': this.macaroonHex
    };
  }

  // Get wallet information
  async getWalletInfo() {
    try {
      const response = await axios.get(`${this.baseUrl}/v1/getinfo`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching wallet info:', error);
      throw error;
    }
  }

  // List all channels
  async listChannels(activeOnly = true) {
    try {
      const response = await axios.get(`${this.baseUrl}/v1/channels${activeOnly ? '?active_only=true' : ''}`, {
        headers: this.getHeaders()
      });
      return response.data.channels;
    } catch (error) {
      console.error('Error listing channels:', error);
      throw error;
    }
  }

  // Get node information
  async getNodeInfo(pubKey: string, includeChannels = true) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/v1/graph/node/${pubKey}?include_channels=${includeChannels}`, 
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching node info:', error);
      throw error;
    }
  }

  // Open a new channel
  async openChannel(nodePubkey: string, localFundingAmount: number, pushSat = 0) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/channels`, 
        {
          node_pubkey_string: nodePubkey,
          local_funding_amount: localFundingAmount.toString(),
          push_sat: pushSat.toString()
        },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error opening channel:', error);
      throw error;
    }
  }

  // Get network information
  async getNetworkInfo() {
    try {
      const response = await axios.get(`${this.baseUrl}/v1/graph/info`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching network info:', error);
      throw error;
    }
  }

  // Get pending channels
  async getPendingChannels() {
    try {
      const response = await axios.get(`${this.baseUrl}/v1/channels/pending`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching pending channels:', error);
      throw error;
    }
  }

  // Get wallet balance
  async getWalletBalance() {
    try {
      const response = await axios.get(`${this.baseUrl}/v1/balance/blockchain`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      throw error;
    }
  }

  // Get channel balance
  async getChannelBalance() {
    try {
      const response = await axios.get(`${this.baseUrl}/v1/balance/channels`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching channel balance:', error);
      throw error;
    }
  }

  // Get recommended nodes for connecting
  // This uses a heuristic based on node centrality and reliability
  async getRecommendedNodes(limit = 5) {
    try {
      // First get general network information
      const networkInfo = await this.getNetworkInfo();
      const graphNodes = networkInfo.nodes || [];
      
      // Sort nodes by a simplified metric (highest channel count & capacity)
      const sortedNodes = graphNodes
        .filter((node: any) => node.last_update > Date.now()/1000 - 86400) // Only recently active nodes
        .sort((a: any, b: any) => {
          const aScore = a.num_channels * parseInt(a.capacity || '0');
          const bScore = b.num_channels * parseInt(b.capacity || '0');
          return bScore - aScore;
        })
        .slice(0, limit);
      
      // Get more details for each recommended node
      const recommendedNodes = await Promise.all(
        sortedNodes.map(async (node: any) => {
          try {
            const nodeDetails = await this.getNodeInfo(node.pub_key, false);
            return {
              ...nodeDetails.node,
              score: node.num_channels * parseInt(node.capacity || '0') / 1e12, // Normalized score
              channels: node.num_channels,
              capacity: node.capacity
            };
          } catch (e) {
            return node;
          }
        })
      );
      
      return recommendedNodes;
    } catch (error) {
      console.error('Error fetching recommended nodes:', error);
      throw error;
    }
  }
}

// Create singleton instance
let lightningApi: LightningApiService | null = null;

// For hackathon purposes, we'll provide a way to initialize the API with user-provided credentials
export const initializeLightningApi = (config: LndRestConfig) => {
  lightningApi = new LightningApiService(config);
  return lightningApi;
};

// Get the singleton instance
export const getLightningApi = () => {
  if (!lightningApi) {
    throw new Error('Lightning API not initialized. Call initializeLightningApi first.');
  }
  return lightningApi;
};

// For testing/demo without actual LND connection
export const createDemoLightningApi = () => {
  return new LightningApiService({
    baseUrl: 'http://localhost:8080', // This will be ignored in demo mode
    macaroonHex: 'demo'
  });
};