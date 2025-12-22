"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { BrowserProvider, Contract, formatEther, parseEther } from "ethers";
import { AppState, MultisigAccount, Transaction } from "./types";
import { getFactoryAddress } from "./addresses";

interface WalletContextType {
  state: AppState;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  loadAccounts: () => Promise<void>;
  createAccount: (owners: string[], threshold: number, name: string) => Promise<string>;
  submitTransaction: (multisigAddress: string, to: string, value: string, data: string) => Promise<void>;
  approveTransaction: (multisigAddress: string, txId: number) => Promise<void>;
  executeTransaction: (multisigAddress: string, txId: number) => Promise<void>;
  revokeApproval: (multisigAddress: string, txId: number) => Promise<void>;
  loadTransactions: (multisigAddress: string) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    wallet: {
      isConnected: false,
      address: null,
      chainId: null,
    },
    accounts: [],
    transactions: {},
    currentSigner: null,
  });

  // Note: We create fresh provider/signer instances in each function
  // instead of using hooks to avoid timing issues with wallet connection

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window === 'undefined' || !window.ethereum) return;

      try {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_accounts", []);

        if (accounts.length > 0) {
          // Wallet is already connected
          const network = await provider.getNetwork();
          const signer = await provider.getSigner();
          const address = await signer.getAddress();

          setState((prev) => ({
            ...prev,
            wallet: {
              isConnected: true,
              address,
              chainId: Number(network.chainId),
            },
            currentSigner: address,
          }));

          // Load accounts
          await loadAccountsInternal(address, provider);
        }
      } catch (error) {
        console.error("Failed to check wallet connection:", error);
      }
    };

    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected
          disconnectWallet();
        } else {
          // Account changed - reconnect
          checkConnection();
        }
      };

      const handleChainChanged = () => {
        // Chain changed - reload page to reset state
        window.location.reload();
      };

      window.ethereum.on?.('accountsChanged', handleAccountsChanged);
      window.ethereum.on?.('chainChanged', handleChainChanged);

      return () => {
        window.ethereum?.removeListener?.('accountsChanged', handleAccountsChanged);
        window.ethereum?.removeListener?.('chainChanged', handleChainChanged);
      };
    }
  }, []);

  // Connect wallet using MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setState((prev) => ({
        ...prev,
        wallet: {
          isConnected: true,
          address,
          chainId: Number(network.chainId),
        },
        currentSigner: address,
      }));

      // Load accounts after connection
      await loadAccountsInternal(address, provider);
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      alert(error.message || "Failed to connect wallet");
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setState({
      wallet: {
        isConnected: false,
        address: null,
        chainId: null,
      },
      accounts: [],
      transactions: {},
      currentSigner: null,
    });
  };

  // Load accounts for connected wallet
  const loadAccountsInternal = async (userAddress: string, providerInstance: BrowserProvider) => {
    try {
      const chainId = (await providerInstance.getNetwork()).chainId;
      const factoryAddress = getFactoryAddress(Number(chainId));

      // Get factory contract
      const factorySigner = await providerInstance.getSigner();
      const factoryContract = new Contract(
        factoryAddress,
        (await import("../../contracts/artifacts/contracts/MultisigFactory.sol/MultisigFactory.json")).abi,
        factorySigner
      );

      // Get wallets where user is owner
      const walletAddresses = await factoryContract.getWalletsByOwner(userAddress);

      // Load details for each wallet
      const accounts: MultisigAccount[] = [];

      for (const walletAddress of walletAddresses) {
        const MultisigWalletABI = (await import("../../contracts/artifacts/contracts/MultisigWallet.sol/MultisigWallet.json")).abi;
        const walletContract = new Contract(walletAddress, MultisigWalletABI, factorySigner);

        const [owners, threshold, balance] = await Promise.all([
          walletContract.getOwners(),
          walletContract.threshold(),
          providerInstance.getBalance(walletAddress),
        ]);

        const network = await providerInstance.getNetwork();

        accounts.push({
          id: walletAddress, // Use wallet address as unique ID
          name: `Multisig ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
          address: walletAddress,
          network: Number(network.chainId), // Store chain ID as number
          balance: formatEther(balance),
          threshold: Number(threshold),
          owners: owners.map((addr: string) => ({ address: addr })),
          createdAt: Date.now(), // Add creation timestamp
        });
      }

      setState((prev) => ({
        ...prev,
        accounts,
      }));
    } catch (error) {
      console.error("Failed to load accounts:", error);
    }
  };

  // Public load accounts
  const loadAccounts = async () => {
    if (!state.wallet.address || !window.ethereum) return;

    try {
      const provider = new BrowserProvider(window.ethereum);
      await loadAccountsInternal(state.wallet.address, provider);
    } catch (error) {
      console.error("Failed to load accounts:", error);
    }
  };

  // Create new multisig account
  const createAccount = async (owners: string[], threshold: number, name: string): Promise<string> => {
    if (!state.wallet.isConnected || !window.ethereum) {
      throw new Error("Wallet not connected");
    }

    try {
      // Get fresh provider and signer
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);
      const factoryAddress = getFactoryAddress(chainId);

      // Get factory contract
      const MultisigFactoryABI = (await import("../../contracts/artifacts/contracts/MultisigFactory.sol/MultisigFactory.json")).abi;
      const factoryContract = new Contract(factoryAddress, MultisigFactoryABI, signer);

      // Deploy multisig
      const tx = await factoryContract.createMultisig(owners, threshold);
      const receipt = await tx.wait();

      // Find MultisigCreated event to get wallet address
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = factoryContract.interface.parseLog(log);
          return parsed?.name === "MultisigCreated";
        } catch {
          return false;
        }
      });

      if (event) {
        const parsed = factoryContract.interface.parseLog(event);
        const walletAddress = parsed?.args[0];

        // Reload accounts
        await loadAccountsInternal(state.wallet.address!, provider);

        return walletAddress;
      }

      throw new Error("Failed to get wallet address from event");
    } catch (error: any) {
      console.error("Failed to create account:", error);
      throw error;
    }
  };

  // Submit transaction
  const submitTransaction = async (multisigAddress: string, to: string, value: string, data: string = "0x") => {
    if (!state.wallet.isConnected || !window.ethereum) {
      throw new Error("Wallet not connected");
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const MultisigWalletABI = (await import("../../contracts/artifacts/contracts/MultisigWallet.sol/MultisigWallet.json")).abi;
      const walletContract = new Contract(multisigAddress, MultisigWalletABI, signer);

      const valueInWei = parseEther(value);
      const tx = await walletContract.submitTransaction(to, valueInWei, data);
      await tx.wait();

      // Reload transactions
      await loadTransactions(multisigAddress);
    } catch (error: any) {
      console.error("Failed to submit transaction:", error);
      throw error;
    }
  };

  // Approve transaction
  const approveTransaction = async (multisigAddress: string, txId: number) => {
    if (!state.wallet.isConnected || !window.ethereum) {
      throw new Error("Wallet not connected");
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const MultisigWalletABI = (await import("../../contracts/artifacts/contracts/MultisigWallet.sol/MultisigWallet.json")).abi;
      const walletContract = new Contract(multisigAddress, MultisigWalletABI, signer);

      const tx = await walletContract.approveTransaction(txId);
      await tx.wait();

      // Reload transactions
      await loadTransactions(multisigAddress);
    } catch (error: any) {
      console.error("Failed to approve transaction:", error);
      throw error;
    }
  };

  // Revoke approval
  const revokeApproval = async (multisigAddress: string, txId: number) => {
    if (!state.wallet.isConnected || !window.ethereum) {
      throw new Error("Wallet not connected");
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const MultisigWalletABI = (await import("../../contracts/artifacts/contracts/MultisigWallet.sol/MultisigWallet.json")).abi;
      const walletContract = new Contract(multisigAddress, MultisigWalletABI, signer);

      const tx = await walletContract.revokeApproval(txId);
      await tx.wait();

      // Reload transactions
      await loadTransactions(multisigAddress);
    } catch (error: any) {
      console.error("Failed to revoke approval:", error);
      throw error;
    }
  };

  // Execute transaction
  const executeTransaction = async (multisigAddress: string, txId: number) => {
    if (!state.wallet.isConnected || !window.ethereum) {
      throw new Error("Wallet not connected");
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const MultisigWalletABI = (await import("../../contracts/artifacts/contracts/MultisigWallet.sol/MultisigWallet.json")).abi;
      const walletContract = new Contract(multisigAddress, MultisigWalletABI, signer);

      const tx = await walletContract.executeTransaction(txId);
      await tx.wait();

      // Reload transactions
      await loadTransactions(multisigAddress);
    } catch (error: any) {
      console.error("Failed to execute transaction:", error);
      throw error;
    }
  };

  // Load transactions for a wallet
  const loadTransactions = async (multisigAddress: string) => {
    if (!state.wallet.isConnected || !window.ethereum) return;

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const MultisigWalletABI = (await import("../../contracts/artifacts/contracts/MultisigWallet.sol/MultisigWallet.json")).abi;
      const walletContract = new Contract(multisigAddress, MultisigWalletABI, signer);

      const txCount = await walletContract.getTransactionCount();
      const transactions: Transaction[] = [];

      for (let i = 0; i < Number(txCount); i++) {
        const [to, value, data, executed, numApprovals] = await walletContract.getTransaction(i);
        const approvals = await walletContract.getApprovals(i);

        const account = state.accounts.find(acc => acc.address === multisigAddress);
        const threshold = account?.threshold || 2;

        transactions.push({
          id: i.toString(),
          multisigAddress,
          to,
          value: formatEther(value),
          data: data === "0x" ? undefined : data,
          status: executed ? "executed" : "pending",
          confirmations: approvals,
          requiredConfirmations: threshold,
          createdAt: Date.now(), // We don't have this on-chain
          executedAt: executed ? Date.now() : undefined,
        });
      }

      setState((prev) => ({
        ...prev,
        transactions: {
          ...prev.transactions,
          [multisigAddress]: transactions,
        },
      }));
    } catch (error) {
      console.error("Failed to load transactions:", error);
    }
  };

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
        revokeApproval,
        loadTransactions,
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
