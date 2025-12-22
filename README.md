# CoSign - Multisignature Wallet Protocol

> Protect your crypto with shared control. Require multiple approvals before any transaction is executed.

![CoSign Banner](https://img.shields.io/badge/CoSign-Multisig%20Wallet-cyan?style=for-the-badge)
![Solidity](https://img.shields.io/badge/Solidity-0.8.27-blue?style=for-the-badge&logo=solidity)
![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd cosign

# 2. Install dependencies
cd contracts && npm install
cd ../frontend && npm install

# 3. Start local Hardhat node (Terminal 1)
cd contracts
npx hardhat node

# 4. Deploy contracts (Terminal 2)
cd contracts
npx hardhat run scripts/deploy.ts --network localhost

# 5. Start frontend (Terminal 3)
cd frontend
npm run dev

# 6. Open browser
# Visit http://localhost:3000 (or :3002)
# Connect MetaMask to Localhost network (Chain ID: 31337)
```

---

## 📋 Features

### ✅ **Multi-Signature Security**
- Threshold-based approvals (e.g., 2-of-3, 3-of-5)
- Multiple owners per wallet
- Secure on-chain execution

### ✅ **Transaction Management**
- Submit transactions
- Approve/revoke approvals
- Execute when threshold is met
- Full transaction history

### ✅ **Factory Pattern**
- Deploy unlimited multisig wallets
- Track all created wallets
- Query wallets by owner

### ✅ **Modern UI/UX**
- Dark theme design
- Real-time blockchain data
- MetaMask integration
- Responsive mobile design

---

## 🔒 Security

### ⚠️ **Important Security Notes**

- **NOT AUDITED** - This code has not been professionally audited
- **Use at your own risk** - Test thoroughly before mainnet deployment
- **Private keys** - Never expose private keys in frontend code

### **Security Features**
✅ Reentrancy guard on execution
✅ Owner-only transaction submission
✅ Threshold validation on deployment
✅ No double approvals allowed
✅ Execute once per transaction

---

## 📚 Documentation

- **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** - Detailed integration documentation
- **[Deployment Guide](INTEGRATION_GUIDE.md#-deployment-instructions)** - Step-by-step deployment
- **[Architecture](INTEGRATION_GUIDE.md#-how-it-works)** - System architecture & flows
- **[Troubleshooting](INTEGRATION_GUIDE.md#-troubleshooting)** - Common issues & solutions

---

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ by the CoSign team**

Multi-Signature Wallet • Built on Ethereum • Open & Transparent
