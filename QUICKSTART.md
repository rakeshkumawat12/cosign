# 🚀 Cosign Quick Start Guide

Get your multi-signature wallet DApp running in 5 minutes!

## Prerequisites

- Node.js v18+ installed
- MetaMask browser extension
- Terminal access

## Quick Start (3 Terminals)

### Terminal 1: Start Blockchain
```bash
cd contracts
npm install
npm run node
```
✅ Leaves terminal running with local blockchain

### Terminal 2: Deploy Contracts
```bash
cd contracts
npm run compile
npm run deploy:local
```
✅ Factory contract deployed!

### Terminal 3: Start Frontend
```bash
cd frontend
npm install
npm run dev
```
✅ App running at http://localhost:3000

## Configure MetaMask

1. **Add Hardhat Network**
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency: `ETH`

2. **Import Test Account**
   - Copy a private key from Terminal 1 output
   - Example: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - MetaMask → Import Account → Paste key

## Use the App

1. Open http://localhost:3000
2. Click **Connect Wallet**
3. Go to **Accounts** → **Create New Account**
4. Add 2-3 owner addresses (from Hardhat node)
5. Set threshold (e.g., 2-of-3)
6. Create account (confirm in MetaMask)
7. Send ETH to your multisig address
8. Create and approve transactions!

## Test Accounts (Hardhat Node)

Use these addresses as owners:

```
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Account #2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
```

Import their private keys (shown in Terminal 1) to MetaMask to use them.

## What's Next?

- See [INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md) for full documentation
- Check [contracts/README.md](contracts/README.md) for smart contract details
- Review [frontend/README.md](frontend/README.md) for frontend architecture

## Troubleshooting

**Contracts not deployed?**
```bash
cd contracts
npm run deploy:local
```

**Frontend not loading?**
```bash
cd frontend
npm install
npm run dev
```

**MetaMask not connecting?**
- Make sure you're on "Hardhat Local" network
- Chain ID must be 31337
- Hardhat node must be running

**Need help?**
- Read [INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md)
- Check console for errors
- Ensure all 3 terminals are running

---

**Happy Building! 🎉**
