# CoSign Multisig Wallet - Integration Guide

## Overview

The CoSign multisig wallet frontend is now **fully integrated** with the smart contracts. All mock data has been replaced with real blockchain interactions using ethers.js v6.

---

## ✅ What's Been Integrated

### 1. **Smart Contract Integration** (Frontend)

#### Core Context & Hooks
- **[wallet-context.tsx](frontend/lib/wallet-context.tsx)** - Complete Web3 integration layer
  - `connectWallet()` - MetaMask connection
  - `createAccount()` - Deploy multisig via factory contract
  - `submitTransaction()` - Submit transaction to multisig
  - `approveTransaction()` - Approve pending transaction
  - `revokeApproval()` - Revoke your approval
  - `executeTransaction()` - Execute approved transaction
  - `loadAccounts()` - Load user's multisig wallets
  - `loadTransactions()` - Load transactions for a wallet

- **[hooks.ts](frontend/lib/hooks.ts)** - Custom React hooks for Web3
  - `useEthersProvider()` - Get ethers.js provider
  - `useEthersSigner()` - Get connected signer
  - `useFactoryContract()` - Factory contract instance
  - `useMultisigContract()` - Multisig contract instance
  - `useFactoryEvents()` - Listen to factory events
  - `useMultisigEvents()` - Listen to multisig events

#### Contract Configuration
- **[addresses.ts](frontend/lib/addresses.ts)** - Contract addresses by chain ID
  - Supports Localhost (31337) and Sepolia (11155111)
  - Reads from `NEXT_PUBLIC_FACTORY_ADDRESS` environment variable

### 2. **Updated Pages**

#### ✅ Create Account Page
**[frontend/app/accounts/create/page.tsx](frontend/app/accounts/create/page.tsx)**
- ✅ **Removed:** Mock data generation
- ✅ **Added:** Real smart contract deployment via `createAccount()`
- ✅ **Features:**
  - Auto-fills first signer with connected wallet
  - Deploys MultisigWallet through MultisigFactory
  - Shows loading state during on-chain transaction
  - Returns actual wallet address from blockchain
  - Validates addresses and threshold requirements

#### ✅ Wallet Detail Page
**[frontend/app/wallet/[address]/page.tsx](frontend/app/wallet/[address]/page.tsx)**
- ✅ **Removed:** Mock transaction creation (`addTransaction`)
- ✅ **Added:** Real transaction submission via `submitTransaction()`
- ✅ **Features:**
  - Loads transactions from blockchain on mount
  - Submit new transactions (calls smart contract)
  - Approve transactions (with async handling)
  - Revoke approvals (new functionality added)
  - Execute transactions when threshold is met
  - Shows loading states for all on-chain operations

#### ✅ Accounts List Page
**[frontend/app/accounts/page.tsx](frontend/app/accounts/page.tsx)**
- ✅ Loads accounts from blockchain via `loadAccounts()`
- ✅ Shows real wallet data (addresses, balances, owners, thresholds)
- ✅ Dark theme styling consistent with design system

### 3. **Smart Contracts**

#### MultisigFactory.sol
**Location:** [contracts/contracts/MultisigFactory.sol](contracts/contracts/MultisigFactory.sol)
- **Purpose:** Factory pattern for deploying multisig wallets
- **Key Functions:**
  - `createMultisig(address[] owners, uint256 threshold)` → returns wallet address
  - `getWalletsByOwner(address owner)` → array of wallet addresses
  - `getWalletInfo(address wallet)` → creator, timestamp, owners, threshold
- **Events:** `MultisigCreated` (indexed for frontend listening)
- **Storage:** Tracks all wallets, creator mappings, creation timestamps

#### MultisigWallet.sol
**Location:** [contracts/contracts/MultisigWallet.sol](contracts/contracts/MultisigWallet.sol)
- **Purpose:** Core multisig wallet with threshold-based approvals
- **Key Functions:**
  - `submitTransaction(address to, uint256 value, bytes data)` → returns txId
  - `approveTransaction(uint256 txId)` → add approval
  - `revokeApproval(uint256 txId)` → remove approval
  - `executeTransaction(uint256 txId)` → execute when threshold met
  - `getTransaction(uint256 txId)` → transaction details
  - `getApprovals(uint256 txId)` → array of approver addresses
- **Security:** Reentrancy guard, owner-only access, threshold validation
- **Events:** `TransactionSubmitted`, `TransactionApproved`, `TransactionRevoked`, `TransactionExecuted`

---

## 🚀 Deployment Instructions

### Prerequisites
1. Node.js v18+ installed
2. MetaMask wallet with Sepolia ETH (or local Hardhat node)
3. Git repository cloned

### Step 1: Install Dependencies

```bash
# Install contract dependencies
cd contracts
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Configure Environment (Optional for Local)

Create `contracts/.env` for private key (Sepolia deployment only):
```bash
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key  # for verification
```

### Step 3: Deploy Contracts

#### **Option A: Local Hardhat Network**

```bash
cd contracts

# Terminal 1 - Start local Hardhat node
npx hardhat node

# Terminal 2 - Deploy to localhost
npx hardhat run scripts/deploy.ts --network localhost
```

**Output Example:**
```
Deploying Cosign Multisig System...

Deploying contracts with account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Account balance: 10000.0 ETH

Deploying MultisigFactory...
MultisigFactory deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3

Network: hardhat
Chain ID: 31337

Deployment info saved to: deployments/hardhat-31337.json
Environment file created: frontend/.env.local

Deployment Summary:
===================
Factory Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Network: hardhat
Chain ID: 31337
```

The deployment script automatically creates `frontend/.env.local`:
```env
NEXT_PUBLIC_FACTORY_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_NETWORK=hardhat
```

#### **Option B: Sepolia Testnet**

```bash
cd contracts

# Deploy to Sepolia
npx hardhat run scripts/deploy.ts --network sepolia
```

**Get Sepolia ETH:**
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)

### Step 4: Start Frontend

```bash
cd frontend
npm run dev
```

**Access:** http://localhost:3000 (or http://localhost:3002 if port 3000 is in use)

### Step 5: Connect Wallet & Test

1. **Connect MetaMask**
   - Click "Connect Wallet" button
   - Approve connection in MetaMask
   - **Important:** Switch MetaMask to Localhost network (Chain ID: 31337) or Sepolia

2. **Create a Multisig Wallet**
   - Go to "Create Account"
   - First signer is auto-filled (your wallet)
   - Add 2+ more signers
   - Set threshold (e.g., 2 of 3)
   - Click "Create Account"
   - Approve transaction in MetaMask
   - Wait for deployment confirmation

3. **Submit a Transaction**
   - Click on your newly created wallet
   - Go to "New Transaction" tab
   - Enter recipient address and amount
   - Click "Submit Transaction"
   - Approve in MetaMask

4. **Approve & Execute**
   - View pending transaction
   - Click "Approve" (with different wallet addresses)
   - Once threshold is met, click "Execute"

---

## 📁 Project Structure

```
cosign/
├── contracts/                          # Smart contracts
│   ├── contracts/
│   │   ├── MultisigFactory.sol        # Factory for deploying wallets
│   │   └── MultisigWallet.sol         # Core multisig wallet
│   ├── scripts/
│   │   └── deploy.ts                  # Deployment script
│   ├── deployments/                    # Generated deployment info
│   └── artifacts/                      # Compiled contract ABIs
│
└── frontend/                           # Next.js frontend
    ├── app/
    │   ├── page.tsx                   # Landing page
    │   ├── accounts/
    │   │   ├── page.tsx               # Accounts list (integrated)
    │   │   └── create/
    │   │       └── page.tsx           # Create account (integrated)
    │   └── wallet/
    │       └── [address]/
    │           └── page.tsx           # Wallet detail (integrated)
    ├── components/
    │   ├── layout/
    │   │   ├── header.tsx             # Navigation with wallet connect
    │   │   ├── footer.tsx             # Footer
    │   │   └── app-layout.tsx         # Layout wrapper
    │   ├── wallet/
    │   │   └── account-card.tsx       # Wallet card component
    │   └── transactions/
    │       └── transaction-card.tsx   # Transaction display
    ├── lib/
    │   ├── wallet-context.tsx         # ✅ Web3 integration layer
    │   ├── hooks.ts                   # ✅ Custom Web3 hooks
    │   ├── addresses.ts               # ✅ Contract addresses config
    │   ├── types.ts                   # TypeScript types
    │   └── mock-data.ts               # Helper functions only
    └── .env.local                      # Generated by deploy script
```

---

## 🔗 How It Works

### 1. **Wallet Connection Flow**
```
User clicks "Connect Wallet"
  ↓
`connectWallet()` in wallet-context.tsx
  ↓
Request accounts from window.ethereum
  ↓
Store address and chainId in state
  ↓
Load user's multisig wallets via `loadAccounts()`
  ↓
Query factory.getWalletsByOwner(userAddress)
  ↓
For each wallet, load details (owners, threshold, balance)
  ↓
Display wallets in UI
```

### 2. **Create Account Flow**
```
User fills form and clicks "Create Account"
  ↓
`createAccount(owners, threshold, name)` in wallet-context.tsx
  ↓
Call factory.createMultisig(owners, threshold)
  ↓
MetaMask prompts user to sign transaction
  ↓
Wait for transaction confirmation
  ↓
Parse MultisigCreated event for wallet address
  ↓
Reload accounts list
  ↓
Redirect to /accounts
```

### 3. **Transaction Flow**
```
User submits transaction
  ↓
`submitTransaction(walletAddress, to, value)` in wallet-context.tsx
  ↓
Call wallet.submitTransaction(to, value, "0x")
  ↓
MetaMask prompts for approval
  ↓
Transaction added to blockchain
  ↓
Load transactions via `loadTransactions()`
  ↓
Display in UI with approval status

Owner clicks "Approve"
  ↓
`approveTransaction(walletAddress, txId)`
  ↓
Call wallet.approveTransaction(txId)
  ↓
Reload transactions to show updated approvals

When threshold met, owner clicks "Execute"
  ↓
`executeTransaction(walletAddress, txId)`
  ↓
Call wallet.executeTransaction(txId)
  ↓
Transaction executes on-chain
  ↓
Reload transactions to show executed status
```

---

## 🎨 Design System

### Dark Theme
- Background: `bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950`
- Glass cards: `.glass-card` with backdrop blur
- Accent colors: Cyan (`#00FFFF`), Purple (`#8A2BE2`), Pink (`#FF1493`)

### Typography
- Display font: **Syne** (ultra-modern geometric)
- Monospace: **JetBrains Mono** (for addresses, numbers)
- Extreme weight contrast (100/200 vs 800/900)

### Components
- `.btn-neon` - Gradient buttons with glow effect
- `.gradient-text` - Cyan to purple text gradient
- `.glass-card` - Glassmorphism with blur
- `.animate-pulse-glow` - Pulsing glow animation

---

## 🔧 Troubleshooting

### Issue: "No factory address configured for chain ID X"
**Solution:** Ensure `NEXT_PUBLIC_FACTORY_ADDRESS` is set in `frontend/.env.local`

### Issue: MetaMask shows wrong network
**Solution:** Switch MetaMask to:
- **Localhost:** Add network manually (RPC: `http://127.0.0.1:8545`, Chain ID: `31337`)
- **Sepolia:** Select from MetaMask network dropdown

### Issue: "Wallet not connected" error
**Solution:**
1. Click "Connect Wallet" in header
2. Approve connection in MetaMask
3. Refresh page if needed

### Issue: Transactions not loading
**Solution:**
1. Check browser console for errors
2. Verify correct network in MetaMask
3. Ensure factory contract is deployed
4. Try reloading the page

### Issue: Create account fails
**Solution:**
1. Ensure you have enough ETH for gas
2. Check all addresses are valid Ethereum addresses
3. Threshold must be ≤ number of signers

---

## 📊 Testing Checklist

- [ ] Connect wallet (MetaMask)
- [ ] Switch to correct network (Localhost/Sepolia)
- [ ] Create new multisig account
  - [ ] First signer auto-fills with your address
  - [ ] Add 2+ more signers
  - [ ] Set threshold (e.g., 2 of 3)
  - [ ] Transaction confirms in MetaMask
  - [ ] Wallet appears in accounts list
- [ ] View wallet details
  - [ ] Shows correct balance
  - [ ] Shows all owners
  - [ ] Shows threshold
- [ ] Submit transaction
  - [ ] Enter valid recipient and amount
  - [ ] Transaction submits to blockchain
  - [ ] Appears in pending list
- [ ] Approve transaction (with different addresses)
  - [ ] Approval count increases
  - [ ] Shows who approved
- [ ] Execute transaction
  - [ ] Only available when threshold met
  - [ ] Executes successfully
  - [ ] Moves to executed list

---

## 🚢 Production Deployment

### Sepolia Testnet
1. Get Sepolia ETH from faucet
2. Add `.env` file to `contracts/` with private key
3. Run: `npx hardhat run scripts/deploy.ts --network sepolia`
4. Frontend automatically picks up address from `.env.local`
5. Deploy frontend to Vercel/Netlify

### Mainnet (When Ready)
1. **AUDIT SMART CONTRACTS FIRST** 🚨
2. Update `addresses.ts` with mainnet factory address
3. Test thoroughly on testnet
4. Deploy factory to mainnet
5. Verify contract on Etherscan
6. Update frontend `.env.local` with mainnet address
7. Deploy frontend

---

## 🔐 Security Notes

### Smart Contracts
- ✅ Reentrancy guard on `executeTransaction`
- ✅ Owner-only access controls
- ✅ Threshold validation
- ✅ No double approvals
- ✅ Execute once per transaction
- ⚠️ **NOT AUDITED** - Use at your own risk

### Frontend
- ✅ Address validation
- ✅ Input sanitization
- ✅ Error handling for all contract calls
- ✅ MetaMask signature required for all state changes
- ⚠️ Private keys never exposed to frontend

---

## 📚 Additional Resources

- **Smart Contracts:** [contracts/](../contracts/)
- **Frontend:** [frontend/](../frontend/)
- **ethers.js v6 Docs:** https://docs.ethers.org/v6/
- **Hardhat Docs:** https://hardhat.org/docs
- **Next.js 15 Docs:** https://nextjs.org/docs

---

## ✅ Summary

The CoSign multisig wallet is **fully integrated** with smart contracts:

1. ✅ **All pages use real blockchain data** (no mock data in core flows)
2. ✅ **Factory pattern deployment** working end-to-end
3. ✅ **Complete transaction lifecycle** (submit → approve → execute)
4. ✅ **MetaMask integration** with proper error handling
5. ✅ **Dark theme design system** applied consistently
6. ✅ **Loading states** for all async operations
7. ✅ **Deployment scripts** auto-generate `.env.local`

**Ready to deploy and test!** 🚀
