# Phase 2 Integration Guide

## Overview

This guide explains how to integrate the deployed smart contracts with the existing Phase 1 frontend. The architecture was designed so contracts can be "plugged in" without refactoring the UI.

## Architecture Recap

### Phase 1 (Current)
- Frontend uses mock data from `lib/mock-data.ts`
- State managed via `lib/wallet-context.tsx`
- UI components are contract-agnostic

### Phase 2 (Integration)
- Replace mock data with contract queries
- Update context to call smart contracts
- Add event listeners for real-time updates
- Keep UI components unchanged

## Step-by-Step Integration

### 1. Deploy Contracts

First, deploy to local network:

```bash
# Terminal 1: Start local node
npm run node

# Terminal 2: Deploy contracts
npm run deploy:local

# Terminal 3: Create sample wallet (optional)
npx hardhat run scripts/create-sample-wallet.ts --network localhost
```

This creates `.env.local` with:
```env
NEXT_PUBLIC_FACTORY_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_NETWORK=hardhat
```

### 2. Update Wallet Context

Replace `lib/wallet-context.tsx` with blockchain integration:

```typescript
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { BrowserProvider, Contract, formatEther, parseEther } from "ethers";
import { AppState, MultisigAccount, Transaction } from "./types";
import { getFactoryAddress } from "./contracts/addresses";
import MultisigFactoryABI from "../artifacts/contracts/MultisigFactory.sol/MultisigFactory.json";
import MultisigWalletABI from "../artifacts/contracts/MultisigWallet.sol/MultisigWallet.json";

interface WalletContextType {
  state: AppState;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  loadAccounts: () => Promise<void>;
  createAccount: (owners: string[], threshold: number, name: string) => Promise<void>;
  submitTransaction: (walletAddress: string, to: string, value: string) => Promise<void>;
  approveTransaction: (walletAddress: string, txId: number) => Promise<void>;
  executeTransaction: (walletAddress: string, txId: number) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    wallet: { isConnected: false, address: null, chainId: null },
    accounts: [],
    transactions: {},
    currentSigner: null,
  });

  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [factory, setFactory] = useState<Contract | null>(null);

  // Connect to MetaMask
  const connectWallet = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("MetaMask not installed");
      return;
    }

    try {
      const browserProvider = new BrowserProvider(window.ethereum);
      const signer = await browserProvider.getSigner();
      const address = await signer.getAddress();
      const network = await browserProvider.getNetwork();

      setProvider(browserProvider);

      const factoryAddress = getFactoryAddress(Number(network.chainId));
      const factoryContract = new Contract(
        factoryAddress,
        MultisigFactoryABI.abi,
        signer
      );
      setFactory(factoryContract);

      setState((prev) => ({
        ...prev,
        wallet: {
          isConnected: true,
          address,
          chainId: Number(network.chainId),
        },
        currentSigner: address,
      }));
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  }, []);

  // Load user's multisig accounts
  const loadAccounts = useCallback(async () => {
    if (!factory || !state.currentSigner) return;

    try {
      const walletAddresses = await factory.getWalletsByOwner(state.currentSigner);

      const accounts: MultisigAccount[] = await Promise.all(
        walletAddresses.map(async (address: string) => {
          const multisig = new Contract(address, MultisigWalletABI.abi, provider);

          const [owners, threshold, balance] = await Promise.all([
            multisig.getOwners(),
            multisig.threshold(),
            provider!.getBalance(address),
          ]);

          return {
            id: address,
            name: `Wallet ${address.slice(0, 6)}`,
            address,
            balance: formatEther(balance),
            owners: owners.map((addr: string) => ({ address: addr })),
            threshold: Number(threshold),
            network: "sepolia",
            createdAt: Date.now(),
          };
        })
      );

      setState((prev) => ({ ...prev, accounts }));

      // Load transactions for each account
      for (const account of accounts) {
        await loadTransactions(account.address);
      }
    } catch (error) {
      console.error("Failed to load accounts:", error);
    }
  }, [factory, state.currentSigner, provider]);

  // Load transactions for a wallet
  const loadTransactions = async (walletAddress: string) => {
    if (!provider) return;

    try {
      const multisig = new Contract(walletAddress, MultisigWalletABI.abi, provider);
      const txCount = await multisig.getTransactionCount();

      const transactions: Transaction[] = [];
      for (let i = 0; i < Number(txCount); i++) {
        const [to, value, data, executed, numApprovals] = await multisig.getTransaction(i);
        const approvals = await multisig.getApprovals(i);

        transactions.push({
          id: `${walletAddress}-${i}`,
          multisigAddress: walletAddress,
          to,
          value: formatEther(value),
          data,
          status: executed ? "executed" : "pending",
          confirmations: approvals,
          requiredConfirmations: Number(await multisig.threshold()),
          createdAt: Date.now(),
          executedAt: executed ? Date.now() : undefined,
        });
      }

      setState((prev) => ({
        ...prev,
        transactions: {
          ...prev.transactions,
          [walletAddress]: transactions,
        },
      }));
    } catch (error) {
      console.error("Failed to load transactions:", error);
    }
  };

  // Create new multisig account
  const createAccount = async (owners: string[], threshold: number, name: string) => {
    if (!factory) throw new Error("Factory not initialized");

    const tx = await factory.createMultisig(owners, threshold);
    const receipt = await tx.wait();

    // Reload accounts to include new one
    await loadAccounts();
  };

  // Submit transaction
  const submitTransaction = async (walletAddress: string, to: string, value: string) => {
    if (!provider) return;

    const signer = await provider.getSigner();
    const multisig = new Contract(walletAddress, MultisigWalletABI.abi, signer);

    const tx = await multisig.submitTransaction(to, parseEther(value), "0x");
    await tx.wait();

    await loadTransactions(walletAddress);
  };

  // Approve transaction
  const approveTransaction = async (walletAddress: string, txId: number) => {
    if (!provider) return;

    const signer = await provider.getSigner();
    const multisig = new Contract(walletAddress, MultisigWalletABI.abi, signer);

    const tx = await multisig.approveTransaction(txId);
    await tx.wait();

    await loadTransactions(walletAddress);
  };

  // Execute transaction
  const executeTransaction = async (walletAddress: string, txId: number) => {
    if (!provider) return;

    const signer = await provider.getSigner();
    const multisig = new Contract(walletAddress, MultisigWalletABI.abi, signer);

    const tx = await multisig.executeTransaction(txId);
    await tx.wait();

    await loadTransactions(walletAddress);
  };

  const disconnectWallet = () => {
    setState({
      wallet: { isConnected: false, address: null, chainId: null },
      accounts: [],
      transactions: {},
      currentSigner: null,
    });
    setProvider(null);
    setFactory(null);
  };

  // Load accounts when wallet connects
  useEffect(() => {
    if (state.wallet.isConnected && factory) {
      loadAccounts();
    }
  }, [state.wallet.isConnected, factory]);

  return (
    <WalletContext.Provider
      value={{
        state,
        connectWallet,
        disconnectWallet,
        loadAccounts,
        createAccount,
        submitTransaction,
        approveTransaction,
        executeTransaction,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
```

### 3. Update Create Account Page

Update `app/accounts/create/page.tsx` to use the new `createAccount` function:

```typescript
// Replace addAccount with createAccount
const { state, createAccount } = useWallet();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validate()) return;

  try {
    await createAccount(
      signers.map(s => s.address),
      threshold,
      accountName
    );
    router.push("/accounts");
  } catch (error) {
    console.error("Failed to create account:", error);
    setErrors({ general: "Failed to create account" });
  }
};
```

### 4. Update Wallet Dashboard

Update transaction actions in `app/wallet/[address]/page.tsx`:

```typescript
const { submitTransaction, approveTransaction, executeTransaction } = useWallet();

// For new transaction
const handleSubmitTransaction = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await submitTransaction(address, recipientAddress, amount);
    setRecipientAddress("");
    setAmount("");
    setActiveTab("transactions");
  } catch (error) {
    setFormError("Failed to submit transaction");
  }
};

// For approval
const handleApprove = async (txId: number) => {
  try {
    await approveTransaction(address, txId);
  } catch (error) {
    console.error("Failed to approve:", error);
  }
};

// For execution
const handleExecute = async (txId: number) => {
  try {
    await executeTransaction(address, txId);
  } catch (error) {
    console.error("Failed to execute:", error);
  }
};
```

### 5. Add Loading States

Add loading indicators for async operations:

```typescript
const [loading, setLoading] = useState(false);

const handleApprove = async (txId: number) => {
  setLoading(true);
  try {
    await approveTransaction(address, txId);
  } finally {
    setLoading(false);
  }
};
```

### 6. Event Listeners for Real-Time Updates

Add event listeners to wallet context:

```typescript
useEffect(() => {
  if (!factory) return;

  const filter = factory.filters.MultisigCreated();
  const handleWalletCreated = () => {
    loadAccounts(); // Reload when new wallet created
  };

  factory.on(filter, handleWalletCreated);
  return () => factory.off(filter, handleWalletCreated);
}, [factory]);
```

## Testing Integration

### 1. Local Testing

```bash
# Start local node
npm run node

# Deploy contracts (in another terminal)
npm run deploy:local

# Start frontend
npm run dev

# Visit http://localhost:3000
```

### 2. Test Flow

1. Click "Connect Wallet" → MetaMask popup
2. Switch MetaMask to "Localhost 8545"
3. Approve connection
4. Click "Create Account"
5. Add owner addresses (use test accounts from Hardhat)
6. Set threshold
7. Submit → Wait for transaction
8. See new account in list
9. Click account → View dashboard
10. Fund wallet via MetaMask
11. Create transaction
12. Approve with required owners
13. Execute transaction

### 3. Sepolia Testing

```bash
# Deploy to Sepolia
npm run deploy:sepolia

# Update .env.local with Sepolia factory address

# Restart frontend
npm run dev

# Switch MetaMask to Sepolia
# Test full flow
```

## Common Issues & Solutions

### MetaMask Not Connecting

**Problem:** "MetaMask not installed" error

**Solution:**
- Install MetaMask extension
- Refresh page after installation
- Check browser console for errors

### Wrong Network

**Problem:** Factory address not found

**Solution:**
- Check MetaMask network matches deployed network
- Verify `NEXT_PUBLIC_FACTORY_ADDRESS` in `.env.local`
- Ensure contracts are deployed to that network

### Transaction Fails

**Problem:** Transaction reverts

**Solution:**
- Check console for revert reason
- Verify account has ETH for gas
- Check multisig has balance for transfer
- Ensure threshold is met for execution

### Events Not Updating

**Problem:** UI doesn't update after transaction

**Solution:**
- Check event listeners are set up
- Verify transaction was mined (check block explorer)
- Reload page to force data refresh
- Add manual refresh button

## Performance Optimization

### 1. Caching

Cache frequently accessed data:

```typescript
const [accountsCache, setAccountsCache] = useState<Map<string, MultisigAccount>>();
```

### 2. Pagination

For large transaction lists:

```typescript
const [page, setPage] = useState(0);
const pageSize = 10;
const visibleTxs = transactions.slice(page * pageSize, (page + 1) * pageSize);
```

### 3. Lazy Loading

Load transaction details on demand:

```typescript
const [loadedTxIds, setLoadedTxIds] = useState<Set<number>>(new Set());
```

## Security Considerations

### 1. Input Validation

Always validate before submitting to blockchain:

```typescript
if (!isValidAddress(address)) {
  throw new Error("Invalid address");
}
if (parseFloat(value) <= 0) {
  throw new Error("Invalid amount");
}
```

### 2. Error Handling

Never expose private keys or sensitive data:

```typescript
catch (error) {
  console.error("Transaction failed:", error.message);
  // Don't log full error object (may contain sensitive data)
}
```

### 3. Transaction Confirmation

Always wait for confirmations:

```typescript
const tx = await contract.submitTransaction(...);
await tx.wait(); // Wait for 1 confirmation
// For high value: await tx.wait(3); // Wait for 3 confirmations
```

## Next Steps

1. ✅ Deploy contracts locally and test integration
2. ✅ Deploy to Sepolia testnet
3. ✅ Test with multiple wallets
4. ⏳ Get contracts audited
5. ⏳ Deploy to mainnet
6. ⏳ Launch to production

## Resources

- [Ethers.js Docs](https://docs.ethers.org/)
- [Hardhat Docs](https://hardhat.org/docs)
- [MetaMask Docs](https://docs.metamask.io/)
- [Sepolia Faucet](https://sepoliafaucet.com/)

## Support

For integration issues:
- Check `docs/smart-contracts/` for contract documentation
- Review `docs/security-considerations.md` for security best practices
- See `docs/deployment.md` for deployment guide
