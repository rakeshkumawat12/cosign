# Deployment Guide

## Prerequisites

- Node.js 18+ installed
- MetaMask or other Web3 wallet
- ETH for gas fees (Sepolia testnet or mainnet)
- Alchemy/Infura RPC endpoint (for testnet/mainnet)

## Environment Setup

1. **Clone and Install**
```bash
git clone <repository>
cd cosign
npm install
```

2. **Configure Environment**

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
# For Sepolia Testnet
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
PRIVATE_KEY=your_deployer_private_key_here
```

**Security Warning:**
- Never commit `.env` to git
- Use a dedicated deployer wallet
- Fund only with necessary amount for deployment

## Local Development

### 1. Start Local Node

```bash
npm run node
```

This starts a local Hardhat network on `http://127.0.0.1:8545`

### 2. Deploy to Local Network

In a new terminal:
```bash
npm run deploy:local
```

Expected output:
```
Deploying Cosign Multisig System...

Deploying contracts with account: 0x...
Account balance: 10000.0 ETH

Deploying MultisigFactory...
MultisigFactory deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3

Network: hardhat
Chain ID: 31337

Deployment info saved to: deployments/hardhat-31337.json
Environment file created: .env.local
```

### 3. Create Sample Wallet

```bash
npx hardhat run scripts/create-sample-wallet.ts --network localhost
```

### 4. Start Frontend

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## Testnet Deployment (Sepolia)

### 1. Get Testnet ETH

- Visit [Sepolia Faucet](https://sepoliafaucet.com/)
- Request ETH to your deployer address
- Wait for confirmation

### 2. Verify Environment

```bash
# Check your configuration
cat .env

# Verify deployer has funds
# (Use block explorer: sepolia.etherscan.io)
```

### 3. Deploy Factory

```bash
npm run deploy:sepolia
```

Wait for deployment confirmation (1-2 minutes).

### 4. Save Deployment Info

Deployment details saved to:
- `deployments/sepolia-11155111.json` - Contract addresses
- `.env.local` - Frontend environment variables

### 5. Verify Contract on Etherscan

```bash
npx hardhat verify --network sepolia <FACTORY_ADDRESS>
```

---

## Mainnet Deployment

⚠️ **WARNING:** Deploying to mainnet involves real funds. Triple-check everything.

### Pre-Deployment Checklist

- [ ] Smart contracts audited by reputable firm
- [ ] All tests passing (`npm test`)
- [ ] Deployment script reviewed
- [ ] Deployer wallet funded with exact gas needed
- [ ] Team coordination for deployment timing
- [ ] Rollback plan documented
- [ ] Monitoring systems ready

### Deployment Steps

1. **Final Testing**
```bash
# Run full test suite
npm test

# Compile with production settings
npm run compile

# Estimate gas costs
npx hardhat run scripts/estimate-gas.ts --network mainnet
```

2. **Update Configuration**

Create `.env.mainnet`:
```env
MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
PRIVATE_KEY=your_deployer_private_key
```

3. **Deploy**
```bash
npm run deploy:mainnet
```

4. **Verify Immediately**
```bash
npx hardhat verify --network mainnet <FACTORY_ADDRESS>
```

5. **Update Frontend**

Update environment variables:
```env
NEXT_PUBLIC_FACTORY_ADDRESS=<mainnet_address>
NEXT_PUBLIC_CHAIN_ID=1
NEXT_PUBLIC_NETWORK=mainnet
```

6. **Announce**
- Tweet/blog post with verified contract address
- Update documentation
- Add to DeFi safety lists

---

## Post-Deployment

### 1. Verify Deployment

```typescript
// Verify factory is accessible
const factory = await ethers.getContractAt(
  "MultisigFactory",
  FACTORY_ADDRESS
);

// Should return 0 initially
const count = await factory.getWalletCount();
console.log("Wallet count:", count);
```

### 2. Test Wallet Creation

```bash
# Create test wallet
npx hardhat run scripts/create-sample-wallet.ts --network <network>
```

### 3. Frontend Integration

Update `lib/contracts/addresses.ts`:
```typescript
export const FACTORY_ADDRESSES = {
  1: "0x...",      // Mainnet
  11155111: "0x...", // Sepolia
  31337: "0x5FbDB...", // Local
};
```

### 4. Monitoring

Set up monitoring for:
- New wallet deployments
- Transaction submissions
- Failed executions
- Unusual approval patterns

---

## Troubleshooting

### "Insufficient funds"
- Check deployer wallet balance
- Estimate gas: `gasPrice * gasLimit * 1.2`
- Fund wallet and retry

### "Nonce too low"
- Reset MetaMask account
- Or: Use `--reset` flag in Hardhat

### "Contract deployment failed"
- Check Solidity version matches
- Verify optimizer settings
- Check constructor parameters

### "Verification failed"
- Wait 1-2 minutes after deployment
- Ensure exact compiler settings
- Check constructor arguments

---

## Gas Cost Estimates

Based on Sepolia testing:

| Operation | Gas Cost | ETH (30 gwei) |
|-----------|----------|---------------|
| Deploy Factory | ~800k | ~0.024 ETH |
| Create Wallet (3 owners) | ~500k | ~0.015 ETH |
| Submit Transaction | ~100k | ~0.003 ETH |
| Approve Transaction | ~50k | ~0.0015 ETH |
| Execute Transaction | ~70k | ~0.0021 ETH |

Total for full workflow: ~0.05 ETH

---

## Deployment Artifacts

After deployment, you'll have:

```
deployments/
  └── <network>-<chainId>.json    # Contract addresses

.env.local                        # Frontend environment

typechain-types/                  # Generated TypeScript types
  ├── MultisigFactory.ts
  └── MultisigWallet.ts
```

---

## Network Information

### Supported Networks

| Network | Chain ID | RPC URL Pattern |
|---------|----------|-----------------|
| Hardhat Local | 31337 | http://127.0.0.1:8545 |
| Sepolia Testnet | 11155111 | https://sepolia.infura.io/v3/... |
| Ethereum Mainnet | 1 | https://mainnet.infura.io/v3/... |

### Adding New Networks

Edit `hardhat.config.cjs`:
```javascript
networks: {
  newNetwork: {
    url: process.env.NEW_NETWORK_RPC,
    accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    chainId: 12345,
  },
}
```

---

## Security Best Practices

1. **Private Key Management**
   - Use hardware wallet for mainnet deploys
   - Never share private keys
   - Use different keys for testnet/mainnet

2. **Deployment Verification**
   - Always verify contracts on Etherscan
   - Compare bytecode with local compilation
   - Check contract state after deployment

3. **Gas Price Management**
   - Monitor gas prices before deployment
   - Use `--gas-price` flag if needed
   - Consider using Flashbots for MEV protection

4. **Rollback Plan**
   - Document factory address
   - Have migration script ready
   - Test migration on testnet first

---

## Upgrade Strategy

Contracts are immutable. To upgrade:

1. Deploy new factory version
2. Update frontend to use new address
3. Migrate users gradually
4. Deprecate old factory (but it remains functional)

Users can migrate wallets by:
1. Creating new wallet with new factory
2. Submitting transaction to transfer funds
3. Approving and executing transfer

---

## Support

**Issues:** https://github.com/your-repo/issues
**Docs:** https://docs.cosign.app
**Discord:** https://discord.gg/cosign

For deployment issues, provide:
- Network name
- Transaction hash
- Error message
- Deployer address (not private key!)
