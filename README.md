# CoSign

**Multi-signature wallet for Ethereum. Require multiple approvals before executing transactions.**

[![Solidity](https://img.shields.io/badge/Solidity-0.8.27-blue?style=flat-square)](https://soliditylang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square)](https://www.typescriptlang.org/)

---

## What is CoSign?

CoSign is a multi-signature wallet that protects your crypto with shared control. Configure M-of-N approvals (e.g., 2-of-3, 3-of-5) so no single person can move funds alone.

**Use cases:**
- Team treasury management
- Shared custody for DAOs
- Personal security (split keys across devices)
- Joint accounts

---

## Quick Start

```bash
# 1. Clone and install
git clone <repo-url>
cd cosign
cd contracts && npm install
cd ../frontend && npm install

# 2. Start local blockchain
cd contracts && npx hardhat node

# 3. Deploy contracts (new terminal)
npx hardhat run scripts/deploy.ts --network localhost

# 4. Start frontend (new terminal)
cd frontend && npm run dev
```

Visit `http://localhost:3000` and connect MetaMask to Localhost network (Chain ID: 31337).

**See [docs/setup.md](docs/setup.md) for detailed instructions.**

---

## Features

✅ **Multi-signature security** - M-of-N approval threshold
✅ **Transaction management** - Submit, approve, revoke, execute
✅ **Factory pattern** - Deploy unlimited wallets
✅ **Dark theme UI** - Responsive design for mobile and desktop
✅ **MetaMask integration** - Connect and transact seamlessly

---

## Architecture

```
Frontend (Next.js + ethers.js)
    ↓
MultisigFactory.sol → Deploys new wallets
    ↓
MultisigWallet.sol → Manages transactions + approvals
```

**Read more:**
- [Architecture Overview](docs/architecture.md)
- [Smart Contracts](docs/smart-contracts.md)
- [Frontend Details](docs/frontend.md)

---

## Project Structure

```
cosign/
├── contracts/          # Solidity contracts + Hardhat
├── frontend/           # Next.js app
└── docs/              # Documentation
```

---

## Security

⚠️ **This code has NOT been audited. Use at your own risk.**

**Security features implemented:**
- Reentrancy guard on execution
- Owner-only transaction submission
- Threshold validation
- No duplicate approvals
- Execute once per transaction

**Before mainnet deployment:**
- Get professional audit
- Test thoroughly on testnets
- Review all contract code
- Use hardware wallets for owner keys

---

## Documentation

- **[Setup Guide](docs/setup.md)** - Installation and deployment
- **[Architecture](docs/architecture.md)** - System design and data flow
- **[Smart Contracts](docs/smart-contracts.md)** - Contract details and API
- **[Frontend](docs/frontend.md)** - React components and state management

---

## Tech Stack

**Contracts:**
- Solidity 0.8.27
- Hardhat
- OpenZeppelin (ReentrancyGuard)

**Frontend:**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- ethers.js v6

---

## Networks

Currently supports:
- **Localhost** (31337) - Development
- **Sepolia** (11155111) - Testnet

---

## License

MIT

---

**Built for the decentralized future.**
