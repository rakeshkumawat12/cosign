import { MultisigAccount, Transaction, TransactionStatus } from "./types";

export const MOCK_CONNECTED_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1";

export const MOCK_ACCOUNTS: MultisigAccount[] = [
  {
    id: "1",
    name: "Treasury Wallet",
    address: "0x1234567890123456789012345678901234567890",
    balance: "12.5",
    owners: [
      { address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1", name: "Alice" },
      { address: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B", name: "Bob" },
      { address: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed", name: "Charlie" },
    ],
    threshold: 2,
    network: "sepolia",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
  },
  {
    id: "2",
    name: "Operations Fund",
    address: "0x2345678901234567890123456789012345678901",
    balance: "45.8",
    owners: [
      { address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1", name: "Alice" },
      { address: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B", name: "Bob" },
      { address: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed", name: "Charlie" },
      { address: "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359", name: "David" },
    ],
    threshold: 3,
    network: "sepolia",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 60,
  },
  {
    id: "3",
    name: "Development Fund",
    address: "0x3456789012345678901234567890123456789012",
    balance: "8.2",
    owners: [
      { address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1", name: "Alice" },
      { address: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B", name: "Bob" },
    ],
    threshold: 2,
    network: "sepolia",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15,
  },
];

export const MOCK_TRANSACTIONS: Record<string, Transaction[]> = {
  "0x1234567890123456789012345678901234567890": [
    {
      id: "tx-1",
      multisigAddress: "0x1234567890123456789012345678901234567890",
      to: "0xdD870fA1b7C4700F2BD7f44238821C26f7392148",
      value: "2.5",
      status: "pending",
      confirmations: ["0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1"],
      requiredConfirmations: 2,
      createdAt: Date.now() - 1000 * 60 * 60 * 2,
    },
    {
      id: "tx-2",
      multisigAddress: "0x1234567890123456789012345678901234567890",
      to: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
      value: "1.0",
      status: "pending",
      confirmations: [],
      requiredConfirmations: 2,
      createdAt: Date.now() - 1000 * 60 * 30,
    },
    {
      id: "tx-3",
      multisigAddress: "0x1234567890123456789012345678901234567890",
      to: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
      value: "0.5",
      status: "executed",
      confirmations: [
        "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
        "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
      ],
      requiredConfirmations: 2,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
      executedAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    },
  ],
  "0x2345678901234567890123456789012345678901": [
    {
      id: "tx-4",
      multisigAddress: "0x2345678901234567890123456789012345678901",
      to: "0x0D1d4e623D10F9FBA5Db95830F7d3839406C6AF2",
      value: "5.0",
      status: "pending",
      confirmations: [
        "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
        "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
      ],
      requiredConfirmations: 3,
      createdAt: Date.now() - 1000 * 60 * 60 * 5,
    },
  ],
  "0x3456789012345678901234567890123456789012": [],
};

export function formatAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatEth(value: string): string {
  const num = parseFloat(value);
  if (num === 0) return "0 ETH";
  if (num < 0.001) return `${num.toFixed(6)} ETH`;
  if (num < 1) return `${num.toFixed(4)} ETH`;
  return `${num.toFixed(2)} ETH`;
}

export function getNetworkName(network: string): string {
  const networks: Record<string, string> = {
    sepolia: "Sepolia",
  };
  return networks[network] || network;
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
