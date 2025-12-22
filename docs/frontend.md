# Frontend Architecture

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **ethers.js v6** - Ethereum library

## Project Structure

```
frontend/
├── app/                          # Next.js App Router pages
│   ├── accounts/                 # Account management
│   │   ├── page.tsx             # List all wallets
│   │   └── create/page.tsx      # Create new wallet form
│   ├── wallet/[address]/        # Wallet dashboard (dynamic route)
│   │   └── page.tsx             # Transaction management
│   ├── layout.tsx               # Root layout with providers
│   ├── globals.css              # Global styles & utilities
│   └── page.tsx                 # Landing page
├── components/                   # Reusable UI components
│   ├── layout/
│   │   ├── app-layout.tsx       # Main app wrapper
│   │   ├── header.tsx           # Navigation + wallet button
│   │   └── footer.tsx           # Footer
│   ├── wallet/
│   │   └── account-card.tsx     # Account display card
│   └── transactions/
│       └── transaction-card.tsx # Transaction item
├── lib/                          # Core utilities
│   ├── wallet-context.tsx       # Global state + contract calls
│   ├── types.ts                 # TypeScript definitions
│   └── addresses.ts             # Contract addresses per chain
└── public/                       # Static assets (logos, icons)
```

## State Management

### WalletContext

Central state provider wrapping the entire app.

**State:**
```typescript
{
  connectedAddress: string | null
  accounts: Account[]
  transactions: { [walletAddress: string]: Transaction[] }
}
```

**Actions:**
- `connectWallet()` - Connect MetaMask
- `disconnectWallet()` - Clear state
- `createAccount(owners, threshold, name)` - Deploy multisig
- `loadUserAccounts()` - Fetch wallets from factory
- `loadTransactions(address)` - Fetch wallet transactions
- `submitTransaction(address, to, value, data)` - Create tx
- `approveTransaction(address, txId)` - Approve tx
- `executeTransaction(address, txId)` - Execute tx
- `revokeApproval(address, txId)` - Revoke approval

## Contract Integration

### Factory Contract
```typescript
const factoryContract = new ethers.Contract(
  FACTORY_ADDRESSES[chainId],
  MultisigFactoryABI,
  signer
);

await factoryContract.createMultisig(owners, threshold, name);
const wallets = await factoryContract.getWalletsByCreator(address);
```

### Multisig Contract
```typescript
const walletContract = new ethers.Contract(
  walletAddress,
  MultisigWalletABI,
  signer
);

await walletContract.submitTransaction(to, value, data);
await walletContract.approveTransaction(txId);
await walletContract.executeTransaction(txId);
```

## Pages

### Landing Page (`app/page.tsx`)
- Hero section with CTA
- Feature highlights
- Security callouts
- Wallet connection required

### Accounts Page (`app/accounts/page.tsx`)
- Lists all user's multisig wallets
- Search/filter by name or address
- Connect wallet prompt when disconnected
- Links to create new wallet

### Create Account Page (`app/accounts/create/page.tsx`)
- Form with validation:
  - Wallet name
  - Dynamic owner list (add/remove)
  - Threshold slider/input
- Real-time validation:
  - Valid Ethereum addresses
  - No duplicate owners
  - Threshold ≤ owner count
- Deploys contract on submit

### Wallet Dashboard (`app/wallet/[address]/page.tsx`)
- **Summary Tab:**
  - Balance, owners, threshold
  - Pending transaction count
- **Transactions Tab:**
  - Pending transactions with approve/execute buttons
  - Transaction history
- **New Transaction Tab:**
  - Create new transaction
  - Recipient and amount fields

## Components

### AccountCard
Displays wallet summary:
- Name and address
- Balance
- Owner count and threshold
- Click to view dashboard

### TransactionCard
Shows transaction details:
- Recipient, amount, status
- Approval progress bar
- Action buttons (approve/execute/revoke)
- Only shows actions for connected owner

## Styling

### Design System
- **Font:** Syne (headings) + JetBrains Mono (addresses/data)
- **Theme:** Dark mode with cyan accents
- **Effects:** Glassmorphism, subtle gradients

### Typography Scale
```css
.text-display → Hero sections (text-6xl+)
.text-headline → Section headers (text-4xl+)
.text-title → Page titles (text-2xl+)
```

### Responsive Breakpoints
- Mobile: < 640px (sm)
- Tablet: 640px - 1024px (md)
- Desktop: > 1024px (lg)

## Type Definitions

```typescript
interface Account {
  address: string
  name: string
  owners: string[]
  threshold: number
  balance: string
  network: string
}

interface Transaction {
  id: number
  to: string
  value: string
  data: string
  executed: boolean
  approvals: number
  timestamp?: number
}
```

## Environment Variables

```bash
NEXT_PUBLIC_FACTORY_ADDRESS_LOCALHOST=0x...
NEXT_PUBLIC_FACTORY_ADDRESS_SEPOLIA=0x...
```

Read in `lib/addresses.ts`:
```typescript
export const FACTORY_ADDRESSES = {
  31337: process.env.NEXT_PUBLIC_FACTORY_ADDRESS_LOCALHOST,
  11155111: process.env.NEXT_PUBLIC_FACTORY_ADDRESS_SEPOLIA,
};
```

## Error Handling

All contract calls wrapped in try/catch:
```typescript
try {
  const tx = await contract.method();
  await tx.wait();
} catch (error) {
  console.error("Transaction failed:", error);
  alert("Failed to execute transaction");
}
```

## Development

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
```

## Future Enhancements

- Event listeners for real-time updates
- Gas estimation UI
- ENS resolution
- Transaction history pagination
- Multi-network switching
- Contract interaction support (not just ETH transfers)
