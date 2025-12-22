/**
 * Contract Addresses by Chain ID
 * Update these after deployment
 */

export const FACTORY_ADDRESSES: Record<number, string> = {
  // Local Hardhat
  31337: process.env.NEXT_PUBLIC_FACTORY_ADDRESS_LOCALHOST || "",

  // Sepolia Testnet
  11155111: process.env.NEXT_PUBLIC_FACTORY_ADDRESS_SEPOLIA || "",

  // Ethereum Mainnet (when ready)
  // 1: "0x...",
};

export function getFactoryAddress(chainId: number): string {
  const address = FACTORY_ADDRESSES[chainId];
  if (!address) {
    throw new Error(`No factory address configured for chain ID ${chainId}`);
  }
  return address;
}

export const SUPPORTED_CHAINS = [31337, 11155111];

export function isSupportedChain(chainId: number): boolean {
  return SUPPORTED_CHAINS.includes(chainId);
}
