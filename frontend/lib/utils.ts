/**
 * Utility functions for formatting and validation
 */

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAddress(address: string, length?: number): string {
  if (!address) return "";
  const chars = length || 4;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatEth(wei: string): string {
  try {
    const eth = parseFloat(wei);
    if (eth === 0) return "0 ETH";
    if (eth < 0.0001) return "< 0.0001 ETH";
    return `${eth.toFixed(4)} ETH`;
  } catch {
    return "0 ETH";
  }
}

export function getNetworkName(chainId: number | string): string {
  // Handle invalid inputs
  if (chainId === null || chainId === undefined) return "Unknown";

  const id = typeof chainId === 'string' ? parseInt(chainId, 10) : chainId;

  // Check for NaN
  if (isNaN(id)) return "Unknown";

  const networks: Record<number, string> = {
    1: "Ethereum",
    11155111: "Sepolia",
    31337: "Localhost",
  };

  return networks[id] || `Chain ${id}`;
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
