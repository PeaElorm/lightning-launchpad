# Lightning Launchpad

An interactive Lightning Network onboarding experience that connects to Lightning Labs' LND API to help new users understand and use the Lightning Network. This project was created for the Accra Lightning Bootcamp hackathon.

## Project Overview

Lightning Launchpad addresses a critical barrier to Lightning Network adoption: technical complexity. By providing clear visual explanations and a guided setup process that connects to real Lightning Network data, we make Lightning more accessible to everyone.

### Key Features

1. **Interactive Visual Explainer**
   - Animated illustrations of Lightning channels
   - Network routing visualization using real Lightning Network data
   - Simple explanations of complex concepts

2. **Lightning Labs API Integration**
   - Connects to Lightning Labs' LND REST API
   - Fetches real network statistics and node data
   - Recommends nodes for connections based on network data

3. **Guided Setup Assistant**
   - Step-by-step wallet connection flow
   - Funding recommendations based on actual network averages
   - Channel setup guidance with real node suggestions

## Technical Implementation

### Lightning Labs API Integration

This project connects to the Lightning Network via Lightning Labs' LND REST API. We use the following endpoints:

- `/v1/getinfo` - Get node information
- `/v1/channels` - List active channels
- `/v1/channels/pending` - List pending channels
- `/v1/graph/info` - Get network information
- `/v1/graph/node/{pubkey}` - Get detailed node information
- `/v1/balance/blockchain` - Get on-chain wallet balance
- `/v1/balance/channels` - Get channel balances

For the hackathon, we've implemented a "demo mode" that simulates the API responses but can easily be switched to use a real LND node.

### Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **API Integration**: Custom hooks and context providers
- **State Management**: React Context API
- **Visualization**: Framer Motion for animations

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- (Optional) Access to an LND node for full functionality

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/lightning-launchpad.git
cd lightning-launchpad
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Start the development server
```bash
npm start
# or
yarn start
```
3. Run the project in your browser
```bash
npm start

### Connecting to Your LND Node (Optional)

1. Start your LND node and ensure REST API is enabled
2. Get your admin.macaroon file and convert it to hex format:
   ```
   xxd -ps -u -c 1000 admin.macaroon
   ```
3. In the Connection Setup screen, disable demo mode and enter:
   - Your LND REST API URL (e.g., https://localhost:8080)
   - Your macaroon in hex format

## Demo Mode

For the hackathon, the app starts in demo mode by default, which simulates LND API responses. This allows you to explore the full functionality without needing a real Lightning node.

## Learn More about Lightning Network

- [Lightning Labs Documentation](https://docs.lightning.engineering/)
- [LND API Documentation](https://api.lightning.community/)
- [Lightning Network Specification](https://github.com/lightning/bolts)