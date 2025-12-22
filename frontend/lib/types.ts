export type TransactionStatus = "pending" | "executed" | "rejected";

export interface Signer {
  address: string;
  name?: string;
}

export interface MultisigAccount {
  id: string;
  name: string;
  address: string;
  balance: string;
  owners: Signer[];
  threshold: number;
  network: number; // Chain ID (31337 for localhost, 11155111 for Sepolia)
  createdAt: number;
}

export interface Transaction {
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

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
}

export interface AppState {
  wallet: WalletState;
  accounts: MultisigAccount[];
  transactions: Record<string, Transaction[]>;
  currentSigner: string | null;
}
