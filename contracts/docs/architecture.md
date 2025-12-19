# Cosign - Architecture Documentation

## Overview

Cosign is a production-grade Multi-Signature Wallet DApp frontend built with Next.js, TypeScript, and Tailwind CSS. This Phase 1 implementation provides a complete UI foundation designed to integrate with smart contracts without requiring refactors.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3**: ethers.js (installed, not yet integrated)
- **State Management**: React Context API

## Project Structure

```
cosign/
├── app/                          # Next.js App Router pages
│   ├── accounts/                 # Accounts management
│   │   ├── create/              # Create multisig account
│   │   │   └── page.tsx
│   │   └── page.tsx             # Accounts list (connected/disconnected states)
│   ├── wallet/                   # Wallet dashboard
│   │   └── [address]/           # Dynamic route for wallet details
│   │       └── page.tsx
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Global styles
│
├── components/                   # Reusable components
│   ├── layout/                  # Layout components
│   │   ├── header.tsx          # App header with wallet connection
│   │   ├── footer.tsx          # App footer
│   │   └── app-layout.tsx      # Main layout wrapper
│   ├── wallet/                  # Wallet-specific components
│   │   └── account-card.tsx    # Account display card
│   └── transactions/            # Transaction components
│       └── transaction-card.tsx # Transaction display card
│
├── lib/                         # Core utilities and state
│   ├── types.ts                # TypeScript type definitions
│   ├── mock-data.ts            # Mock data and utility functions
│   └── wallet-context.tsx      # Global state management
│
├── docs/                        # Documentation
│   └── architecture.md         # This file
│
└── [config files]              # Next.js, TypeScript, Tailwind configs
```

## State Management

### Design Philosophy

The state management is built using React Context API with a clear separation between UI state and blockchain state. This design ensures:

1. **Easy smart contract integration**: State shape mirrors on-chain data structures
2. **Predictable updates**: All state mutations go through defined actions
3. **Type safety**: Full TypeScript coverage prevents runtime errors
4. **Scalability**: Can easily migrate to Redux/Zustand if needed

### State Shape

```typescript
interface AppState {
  wallet: WalletState;           // Connected wallet information
  accounts: MultisigAccount[];   // User's multisig accounts
  transactions: Record<string, Transaction[]>; // Transactions by account address
  currentSigner: string | null;  // Active signer address
}
```

### Context Actions

The `WalletProvider` exposes these actions:

- `connectWallet()`: Simulates wallet connection
- `disconnectWallet()`: Clears wallet state
- `addAccount(account)`: Adds new multisig account
- `addTransaction(tx)`: Adds new transaction
- `approveTransaction(address, txId)`: Approves pending transaction
- `executeTransaction(address, txId)`: Executes approved transaction

### How It Maps to On-Chain Events

When smart contracts are integrated:

1. **Wallet Connection**: Will use ethers.js `BrowserProvider` instead of mock address
2. **Accounts**: Will query MultisigFactory contract for user's accounts
3. **Transactions**: Will listen to smart contract events:
   - `TransactionSubmitted` → Add to pending transactions
   - `TransactionConfirmed` → Update confirmation count
   - `TransactionExecuted` → Move to executed status
4. **Actions**: Will trigger smart contract calls:
   - `addAccount` → Call `createMultisig()` on factory
   - `addTransaction` → Call `submitTransaction()` on multisig
   - `approveTransaction` → Call `confirmTransaction()`
   - `executeTransaction` → Call `executeTransaction()`

## Pages & User Flows

### 1. Landing Page (`/`)

**Purpose**: Product introduction and CTA to launch app

**Features**:
- Hero section with clear value proposition
- Feature highlights (security, shared control, transparency)
- Trust indicators and statistics
- "Launch App" CTA → routes to `/accounts`

**State**: No wallet connection required

### 2. Accounts Page (`/accounts`)

**Purpose**: Central hub for managing multisig accounts

**States**:

#### State 1: Wallet Disconnected
- Empty state with wallet icon
- Explanation of read-only access
- "Connect Wallet" button
- Supported wallets list

#### State 2: Wallet Connected
- Search bar (filters by name, address, network)
- Grid of account cards showing:
  - Account name and address
  - Balance
  - Threshold (X of Y)
  - Network badge
  - Owner avatars
- "Create Account" button → routes to `/accounts/create`

**Integration Points**:
- Will fetch accounts from MultisigFactory contract
- Will display real balances from blockchain
- Will show only accounts where user is an owner

### 3. Create Account Page (`/accounts/create`)

**Purpose**: Form to deploy new multisig account

**Features**:
- Account name input
- Network selector (Sepolia only in Phase 1)
- Dynamic signer list (add/remove)
- Threshold selector with validation
- Real-time validation:
  - No duplicate addresses
  - Valid Ethereum addresses
  - Threshold ≤ total signers
- Form submission creates mock account

**Validation Rules**:
```typescript
- Account name: Required, non-empty
- Signers: Minimum 2, unique, valid Ethereum addresses
- Threshold: 1 ≤ threshold ≤ signers.length
```

**Integration Points**:
- Will call `createMultisig()` on factory contract
- Will wait for transaction confirmation
- Will redirect to new account's dashboard

### 4. Wallet Dashboard (`/wallet/[address]`)

**Purpose**: Manage individual multisig account and transactions

**Layout**:

#### Summary Section
- Account name, address, network
- Current balance
- Owner count with avatars
- Threshold display
- Pending transaction count

#### Tabs

**Transactions Tab**:
- Pending transactions section
- Executed transactions history
- Each transaction card shows:
  - Recipient address
  - Amount
  - Status badge
  - Confirmation count with avatars
  - Action buttons (Approve/Execute)
  - Timestamp

**Transaction Actions**:
- **Approve**: Enabled only for owners who haven't approved yet
- **Execute**: Enabled only when threshold is met
- State updates optimistically in UI

**New Transaction Tab**:
- Recipient address input (validated)
- Amount input (validated)
- Threshold reminder
- Submit button creates pending transaction

**Access Control**:
- Only account owners can see "New Transaction" tab
- Only owners can approve transactions
- Anyone can execute if threshold met

**Integration Points**:
- Will fetch balance from blockchain
- Will listen to transaction events
- Will call smart contract methods for approve/execute
- Will display gas estimates

## Type System

### Core Types

```typescript
// Network types (expandable)
type Network = "sepolia";

// Transaction lifecycle
type TransactionStatus = "pending" | "executed" | "rejected";

// Account owner
interface Signer {
  address: string;
  name?: string;
}

// Multisig account
interface MultisigAccount {
  id: string;
  name: string;
  address: string;
  balance: string;
  owners: Signer[];
  threshold: number;
  network: Network;
  createdAt: number;
}

// Transaction
interface Transaction {
  id: string;
  multisigAddress: string;
  to: string;
  value: string;
  data?: string;
  status: TransactionStatus;
  confirmations: string[];
  requiredConfirmations: number;
  createdAt: number;
  executedAt?: number;
}
```

### Why This Type System Works

1. **Matches Solidity**: Types mirror smart contract structs
2. **Type Safety**: Prevents invalid states at compile time
3. **Extensible**: Easy to add fields (e.g., `data` for contract calls)
4. **Future-Proof**: Can add networks, transaction types without breaking changes

## Utility Functions

Located in `lib/mock-data.ts`:

- `formatAddress(address, chars)`: Truncates address for display
- `formatEth(value)`: Formats ETH amounts with appropriate decimals
- `getNetworkName(network)`: Maps network ID to human name
- `isValidAddress(address)`: Validates Ethereum address format

These will be extended with ethers.js utilities in Phase 2.

## Design Decisions

### Why React Context over Redux?

- **Simplicity**: No boilerplate for this scale
- **Type Safety**: Works seamlessly with TypeScript
- **Performance**: Sufficient for expected data volumes
- **Future**: Easy migration path if needed

### Why Mock Data Instead of Local Storage?

- **Development Speed**: Faster iteration in Phase 1
- **Clean State**: Easy reset during testing
- **Contract-First**: Emphasizes blockchain as source of truth
- **No Migration**: Won't need to migrate from localStorage → blockchain

### Why App Router over Pages Router?

- **Modern**: Aligns with Next.js future
- **Performance**: Better code splitting and streaming
- **Layouts**: Shared layouts without prop drilling
- **Type Safety**: Better TypeScript support

## Smart Contract Integration Readiness

### Current State (Phase 1)
- ✅ UI fully functional with mock data
- ✅ State shape matches expected contract data
- ✅ Validation logic in place
- ✅ Error handling patterns established
- ✅ ethers.js installed but not used

### Phase 2 Integration Plan

1. **Wallet Connection**
   ```typescript
   // Replace mock connection in wallet-context.tsx
   const provider = new BrowserProvider(window.ethereum);
   const signer = await provider.getSigner();
   const address = await signer.getAddress();
   ```

2. **Account Fetching**
   ```typescript
   // Query factory contract for user's multisigs
   const factory = new Contract(FACTORY_ADDRESS, factoryABI, signer);
   const accounts = await factory.getUserMultisigs(address);
   ```

3. **Transaction Listening**
   ```typescript
   // Subscribe to contract events
   multisig.on("TransactionSubmitted", (txId, to, value) => {
     // Add to state.transactions
   });
   ```

4. **Action Integration**
   ```typescript
   // Replace mock actions with contract calls
   const approveTransaction = async (address, txId) => {
     const multisig = new Contract(address, multisigABI, signer);
     const tx = await multisig.confirmTransaction(txId);
     await tx.wait(); // Wait for confirmation
     // Update state
   };
   ```

### No Refactors Required

The architecture ensures:
- State structure won't change
- Component props remain the same
- Only context implementation changes
- UI logic untouched

## Performance Considerations

### Current Optimizations
- `useMemo` for filtered lists (accounts, transactions)
- Component-level code splitting via dynamic imports
- Optimistic UI updates for better UX

### Future Optimizations
- Transaction list virtualization for large histories
- Account list pagination if user has many multisigs
- Service worker for offline account viewing
- GraphQL/TheGraph for efficient blockchain queries

## Security Considerations

### Frontend Validation
- ✅ Address format validation
- ✅ Duplicate signer detection
- ✅ Threshold bounds checking
- ✅ Amount validation

### Important Notes
- Frontend validation is UX only
- Smart contracts are source of truth
- Never trust client-side data
- All critical validation happens on-chain

## Testing Strategy (Phase 2)

### Unit Tests
- Utility functions (formatting, validation)
- Context actions and state updates
- Form validation logic

### Integration Tests
- Wallet connection flow
- Account creation flow
- Transaction approval flow
- Contract interaction mocking

### E2E Tests
- Complete user journeys
- Multi-wallet approval scenarios
- Error handling

## Deployment

### Environment Variables (Future)
```env
NEXT_PUBLIC_NETWORK=sepolia
NEXT_PUBLIC_FACTORY_ADDRESS=0x...
NEXT_PUBLIC_ALCHEMY_KEY=...
```

### Build Command
```bash
npm run build
```

### Deployment Targets
- Vercel (recommended)
- Netlify
- AWS Amplify
- Any static hosting

## Known Limitations (Phase 1)

1. **Mock Data**: Resets on page refresh
2. **No Persistence**: No database or localStorage
3. **Single Network**: Only Sepolia supported
4. **No Gas Estimates**: Will be added with contracts
5. **No Transaction Data**: ETH transfers only (no contract calls)

These are intentional for Phase 1 and will be addressed in Phase 2.

## Next Steps (Phase 2)

1. Deploy MultisigFactory and Multisig smart contracts
2. Integrate ethers.js for wallet connection
3. Connect context actions to contract calls
4. Add event listeners for real-time updates
5. Implement gas estimation
6. Add transaction data support
7. Add ENS resolution for addresses
8. Implement error handling for failed transactions

## Conclusion

This architecture provides a solid foundation for a production-grade multisig wallet. The clear separation between UI and blockchain logic, coupled with a well-designed state management system, ensures that smart contract integration will be seamless and require minimal changes to the existing codebase.
