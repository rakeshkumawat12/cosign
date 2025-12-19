# Cosign - Multi-Signature Wallet DApp

A production-grade Multi-Signature Wallet DApp built with Next.js, TypeScript, and Tailwind CSS.

## Phase 1: Complete Frontend Foundation

This phase delivers a fully functional UI with mock data, designed for seamless smart contract integration in Phase 2.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **ethers.js** (installed, integration pending)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
cosign/
├── app/                    # Next.js pages (App Router)
│   ├── accounts/          # Account management
│   ├── wallet/[address]/  # Wallet dashboard
│   └── page.tsx           # Landing page
├── components/            # Reusable components
│   ├── layout/           # Header, footer, app layout
│   ├── wallet/           # Account cards
│   └── transactions/     # Transaction cards
├── lib/                  # Core utilities
│   ├── types.ts         # TypeScript definitions
│   ├── mock-data.ts     # Mock data & utilities
│   └── wallet-context.tsx # State management
└── docs/                # Documentation
    └── architecture.md  # Architecture guide
```

## Features

### Landing Page
- Product overview with value proposition
- Feature highlights
- Trust indicators
- Launch app CTA

### Accounts Page
**Disconnected State:**
- Empty state with wallet connection prompt
- Explanation of read-only access

**Connected State:**
- List of multisig accounts
- Search by name, address, or network
- Account details (balance, threshold, owners)
- Create new account button

### Create Account Page
- Form with validation:
  - Account name
  - Network selection (Sepolia)
  - Dynamic signer list
  - Threshold configuration
- Real-time validation:
  - No duplicate addresses
  - Valid Ethereum addresses
  - Threshold ≤ total signers

### Wallet Dashboard
**Summary:**
- Account details (name, address, network)
- Current balance
- Owner information
- Pending transaction count

**Transactions Tab:**
- Pending transactions (with approve/execute actions)
- Transaction history
- Confirmation tracking

**New Transaction Tab:**
- Create new transactions
- Recipient validation
- Amount input
- Threshold reminder

## Mock Data

The application uses mock data to simulate:
- Wallet connection (address: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1`)
- Three multisig accounts
- Sample transactions in various states

All data resets on page refresh. This is intentional for Phase 1.

## State Management

Built with React Context API:
- `WalletProvider` wraps the entire app
- Global state for wallet, accounts, and transactions
- Actions: connect/disconnect wallet, add accounts/transactions, approve/execute

See [docs/architecture.md](docs/architecture.md) for detailed state shape and integration plan.

## Key Design Decisions

### Why Mock Data?
- Faster Phase 1 iteration
- Emphasizes blockchain as source of truth
- No migration needed from localStorage → contracts

### Why React Context?
- Sufficient for this scale
- Type-safe with TypeScript
- Easy contract integration
- Simple migration path if needed

### Smart Contract Readiness
- State shape mirrors on-chain data
- Actions map directly to contract calls
- No refactors required for Phase 2
- ethers.js already installed

## Validation

### Frontend Validation (UX Only)
- Address format validation
- Duplicate signer detection
- Threshold bounds checking
- Amount validation

**Note:** All critical validation happens on-chain. Frontend validation is for UX only.

## Next Steps (Phase 2)

1. Deploy smart contracts (MultisigFactory, Multisig)
2. Integrate wallet connection via ethers.js
3. Replace mock actions with contract calls
4. Add event listeners for real-time updates
5. Implement gas estimation
6. Add ENS resolution
7. Support contract interactions (not just ETH transfers)

## Documentation

- [Architecture Guide](docs/architecture.md) - Detailed architecture, state management, and integration plan

## Development Notes

### Wallet Connection
Click "Connect Wallet" to simulate connection with mock address. No actual wallet extension required in Phase 1.

### Creating Accounts
Use any valid Ethereum addresses for signers. Example:
- `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1`
- `0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B`

### Approving Transactions
Only the connected wallet (mock address) can approve transactions. Other signers' approvals are simulated.

## Intentional Limitations (Phase 1)

- ❌ No real blockchain integration
- ❌ No persistent storage
- ❌ No gas estimation
- ❌ Only ETH transfers (no contract calls)
- ❌ Single network (Sepolia)

All limitations are by design and will be addressed in Phase 2.

## License

MIT
