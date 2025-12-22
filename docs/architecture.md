# Architecture

CoSign is a multi-signature wallet that requires M-of-N approvals before executing transactions.

## System Design

```
┌─────────────┐      ┌──────────────┐      ┌─────────────────┐
│   Browser   │─────▶│   Frontend   │─────▶│ Smart Contracts │
│  (MetaMask) │◀─────│  (Next.js)   │◀─────│   (Ethereum)    │
└─────────────┘      └──────────────┘      └─────────────────┘
```

### Frontend Stack
- **Next.js 15** - App Router, Server Components
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **ethers.js v6** - Blockchain interaction

### Smart Contracts
- **MultisigFactory.sol** - Deploys new wallets
- **MultisigWallet.sol** - Handles transactions and approvals

## Data Flow

### Creating a Wallet
1. User fills form (owners, threshold, name)
2. Frontend calls `factoryContract.createMultisig()`
3. Factory deploys new MultisigWallet contract
4. Frontend queries `walletsByCreator[userAddress]`
5. New wallet appears in accounts list

### Submitting a Transaction
1. Owner calls `submitTransaction(to, value, data)`
2. Contract stores transaction with ID
3. Emits `TransactionSubmitted` event
4. Frontend updates pending transactions

### Approving & Executing
1. Owner calls `approveTransaction(txId)`
2. Approval count increments
3. When count ≥ threshold, transaction becomes executable
4. Any owner calls `executeTransaction(txId)`
5. Contract sends ETH and marks transaction executed

## State Management

### WalletContext (`frontend/lib/wallet-context.tsx`)
Global state provider with:
- `connectedAddress` - Current wallet
- `accounts` - Array of multisig wallets
- `transactions` - Pending and executed txs

### Actions
- `connectWallet()` - Connect MetaMask
- `createAccount()` - Deploy new multisig
- `submitTransaction()` - Create new tx
- `approveTransaction()` - Add approval
- `executeTransaction()` - Execute when threshold met
- `revokeApproval()` - Remove approval

## Security

### Contract Level
- Reentrancy guard on execution
- Owner-only transaction submission
- No double approvals
- Threshold validation on deployment

### Frontend Level
- Address validation (UX only)
- Duplicate owner detection
- Amount validation
- All critical validation on-chain

## Network Support

Currently supports:
- **Localhost** (Chain ID: 31337) - Development
- **Sepolia** (Chain ID: 11155111) - Testnet

Factory addresses configured in `frontend/lib/addresses.ts`.
