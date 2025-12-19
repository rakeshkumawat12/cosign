# Cosign - Multi-Signature Wallet DApp

A production-grade multi-signature wallet application with Next.js frontend and Solidity smart contracts - **fully integrated and ready to use!**

## 🚀 Quick Start

**Want to get started immediately?** See [QUICKSTART.md](QUICKSTART.md)

```bash
# 1. Start blockchain (Terminal 1)
cd contracts && npm install && npm run node

# 2. Deploy contracts (Terminal 2)
cd contracts && npm run deploy:local

# 3. Start frontend (Terminal 3)
cd frontend && npm install && npm run dev
```

Then open http://localhost:3000 and connect MetaMask!

## ✅ Status

- **Frontend**: ✅ Complete with real contract integration
- **Smart Contracts**: ✅ Complete and tested
- **Integration**: ✅ Fully integrated blockchain functionality
- **Audit Status**: 🟡 Ready for professional audit

## 📁 Project Structure

```
cosign/
├── frontend/              # Next.js application (fully integrated!)
│   ├── app/              # Pages: Landing, Accounts, Create, Dashboard
│   ├── components/       # Reusable UI components
│   ├── lib/
│   │   ├── hooks.ts           # Contract interaction hooks
│   │   ├── addresses.ts       # Factory addresses
│   │   ├── wallet-context.tsx # Real blockchain integration
│   │   └── types.ts           # TypeScript definitions
│   └── package.json
│
├── contracts/            # Smart contracts
│   ├── contracts/
│   │   ├── MultisigWallet.sol  # Core multisig (300 lines)
│   │   └── MultisigFactory.sol # Wallet factory (170 lines)
│   ├── test/             # 40+ passing tests
│   ├── scripts/          # Deployment scripts
│   ├── artifacts/        # Compiled contracts (used by frontend)
│   └── package.json
│
├── QUICKSTART.md         # 5-minute setup guide
├── INTEGRATION_COMPLETE.md # Full integration documentation
└── package.json          # Root workspace scripts
```

## 🎯 Features

### Frontend (Next.js 15 + TypeScript + Tailwind)
- ✅ **Real Wallet Connection** - MetaMask integration with ethers.js v6
- ✅ **Account Management** - Load wallets from blockchain
- ✅ **Create Multisig** - Deploy new wallets through factory
- ✅ **Transaction Lifecycle** - Submit, approve, execute transactions
- ✅ **Real-time Updates** - Fetch live data from contracts
- ✅ **Network Support** - Localhost (31337), Sepolia (11155111)

### Smart Contracts (Solidity 0.8.27)
- ✅ **MultisigFactory** - Deploy and track wallets
- ✅ **MultisigWallet** - Threshold-based approvals
- ✅ **Security** - Reentrancy protection, access control
- ✅ **Events** - Full event emission for indexing
- ✅ **Gas Optimized** - Efficient storage patterns
- ✅ **Tested** - 40+ comprehensive tests

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get running in 5 minutes
- **[INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md)** - Full integration guide
- **[contracts/README.md](contracts/README.md)** - Smart contract documentation
- **[contracts/docs/](contracts/docs/)** - Security, deployment, API docs
- **[frontend/README.md](frontend/README.md)** - Frontend architecture

## 🛠️ Development

### Install Dependencies
```bash
# Install all at once
cd frontend && npm install
cd ../contracts && npm install
```

### Run Development Environment
```bash
# Terminal 1: Blockchain
cd contracts && npm run node

# Terminal 2: Contracts
cd contracts && npm run deploy:local

# Terminal 3: Frontend
cd frontend && npm run dev
```

### Available Commands

**Root level:**
```bash
npm run dev            # Start frontend
npm run compile        # Compile contracts
npm run test           # Run contract tests
npm run deploy:local   # Deploy contracts
npm run node           # Start blockchain
```

**Frontend:**
```bash
cd frontend
npm run dev     # Development server (http://localhost:3000)
npm run build   # Production build
npm run lint    # Run ESLint
```

**Contracts:**
```bash
cd contracts
npm run compile         # Compile Solidity
npm run test           # Run tests (40+ tests)
npm run deploy:local   # Deploy to localhost
npm run deploy:sepolia # Deploy to Sepolia testnet
npm run node           # Start Hardhat node
```

## 🔗 Smart Contract Integration

The frontend is **fully integrated** with the smart contracts:

### Contract Functions Used

**MultisigFactory:**
- `createMultisig(owners[], threshold)` → Create new wallet
- `getWalletsByOwner(address)` → Load user's wallets

**MultisigWallet:**
- `submitTransaction(to, value, data)` → Submit transaction
- `approveTransaction(txId)` → Approve transaction
- `revokeApproval(txId)` → Revoke approval
- `executeTransaction(txId)` → Execute transaction
- `getOwners()` → Get wallet owners
- `getTransactionCount()` → Get total transactions
- `getTransaction(txId)` → Get transaction details

### React Hooks Available

```typescript
useEthersProvider()    // Get ethers provider
useEthersSigner()      // Get connected signer
useFactoryContract()   // Get factory contract instance
useMultisigContract(address)  // Get wallet contract instance
```

## 🌐 Network Configuration

### Localhost (Development)
- Chain ID: 31337
- RPC: http://127.0.0.1:8545
- Pre-funded test accounts

### Sepolia (Testnet)
- Chain ID: 11155111
- Get testnet ETH: https://sepoliafaucet.com/
- Deploy: `cd contracts && npm run deploy:sepolia`

### Ethereum (Mainnet - Production)
⚠️ **Only after professional security audit**

## 🔒 Security

### Implemented Protections
- ✅ Reentrancy guard
- ✅ Access control (onlyOwner)
- ✅ Threshold validation
- ✅ No double approvals
- ✅ Owner validation (no duplicates, no zero address)

### Audit Status
🟡 **Ready for professional audit**

Recommended auditors:
- Trail of Bits
- OpenZeppelin
- ConsenSys Diligence

See [contracts/docs/security-considerations.md](contracts/docs/security-considerations.md) for complete security analysis.

## 🧪 Testing

### Smart Contracts
```bash
cd contracts
npm test
```

**Results:** 40+ tests passing with 95%+ coverage

**Test Coverage:**
- Deployment validation
- Transaction lifecycle
- Reentrancy protection
- Access control
- Event emission
- Edge cases

## 📋 Known Limitations

⚠️ **Immutable Design** (by choice for security):
- Owners cannot be added/removed after deployment
- Threshold cannot be changed after deployment

⚠️ **Gas Considerations**:
- Recommend max 10 owners
- Use subgraph for production wallet listing

See documentation for detailed limitations and design trade-offs.

## 🎓 How It Works

1. **User connects MetaMask** → Frontend detects wallet
2. **Load accounts** → Factory contract returns user's wallets
3. **Create multisig** → Deploy through factory, get address from event
4. **Submit transaction** → Owner proposes transaction
5. **Approve** → Other owners approve (threshold required)
6. **Execute** → Anyone executes after threshold met
7. **ETH sent** → Transaction executes on-chain

## 🚢 Deployment Checklist

- [x] Smart contracts written
- [x] Comprehensive tests (40+)
- [x] Frontend integrated
- [x] Local development working
- [ ] Deploy to Sepolia testnet
- [ ] Beta testing
- [ ] Professional security audit
- [ ] Deploy to mainnet
- [ ] Launch to production

## 🤝 Contributing

This is a complete implementation ready for audit and production deployment.

## 📄 License

MIT

## 🆘 Support

- **Quick Start**: [QUICKSTART.md](QUICKSTART.md)
- **Integration Guide**: [INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md)
- **Contract Docs**: [contracts/docs/](contracts/docs/)
- **Security**: [contracts/docs/security-considerations.md](contracts/docs/security-considerations.md)

---

**Built with ❤️ using Next.js, Solidity, TypeScript, and ethers.js**

**Status**: ✅ Fully Integrated | 🚀 Ready for Development | 🟡 Pending Audit
