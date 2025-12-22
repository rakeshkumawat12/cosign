# Setup Guide

## Prerequisites

- Node.js 18+ and npm
- MetaMask browser extension
- Git

## Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd cosign
```

### 2. Install dependencies
```bash
# Install contract dependencies
cd contracts
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Configure environment

**Contracts** (`contracts/.env`):
```bash
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_deployer_private_key
ETHERSCAN_API_KEY=your_etherscan_key
```

**Frontend** (`frontend/.env.local`):
```bash
NEXT_PUBLIC_FACTORY_ADDRESS_LOCALHOST=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_FACTORY_ADDRESS_SEPOLIA=0xYourSepoliaFactoryAddress
```

## Running Locally

### Start local blockchain (Terminal 1)
```bash
cd contracts
npx hardhat node
```

This starts a local Ethereum node on `http://127.0.0.1:8545` (Chain ID: 31337).

### Deploy contracts (Terminal 2)
```bash
cd contracts
npx hardhat run scripts/deploy.ts --network localhost
```

Copy the factory address from output and update `frontend/.env.local`.

### Start frontend (Terminal 3)
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000`.

### Configure MetaMask

1. Add Localhost network:
   - Network Name: Localhost
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency: ETH

2. Import test account from Hardhat (see console output for private keys)

## Deploying to Sepolia

### 1. Deploy contracts
```bash
cd contracts
npx hardhat run scripts/deploy.ts --network sepolia
```

### 2. Verify contracts (optional)
```bash
npx hardhat verify --network sepolia <FACTORY_ADDRESS>
```

### 3. Update frontend config
Copy the Sepolia factory address to `frontend/.env.local`.

### 4. Deploy frontend
```bash
cd frontend
npm run build
npm start
```

Or deploy to Vercel:
```bash
npx vercel --prod
```

## Troubleshooting

**MetaMask not connecting:**
- Ensure you're on the correct network
- Clear MetaMask cache: Settings → Advanced → Clear Activity Tab Data

**Contract call fails:**
- Check factory address in `.env.local`
- Ensure MetaMask account has ETH for gas
- Verify contract is deployed on current network

**Frontend not loading:**
- Check that contract artifacts exist in `contracts/artifacts/`
- Restart dev server after contract redeployment
- Clear Next.js cache: `rm -rf .next`

**Transaction reverts:**
- Insufficient ETH for gas
- Threshold > number of owners
- Duplicate owner addresses
- Invalid Ethereum address format
