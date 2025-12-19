"use client";

import { useEffect, useState, useCallback } from "react";
import { BrowserProvider, Contract, Signer } from "ethers";
import { getFactoryAddress } from "./addresses";
import MultisigFactoryABI from "../../artifacts/contracts/MultisigFactory.sol/MultisigFactory.json";
import MultisigWalletABI from "../../artifacts/contracts/MultisigWallet.sol/MultisigWallet.json";

/**
 * Hook to get ethers provider from window.ethereum
 */
export function useEthersProvider() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const browserProvider = new BrowserProvider(window.ethereum);
      setProvider(browserProvider);
    }
  }, []);

  return provider;
}

/**
 * Hook to get connected signer
 */
export function useEthersSigner() {
  const provider = useEthersProvider();
  const [signer, setSigner] = useState<Signer | null>(null);

  useEffect(() => {
    if (provider) {
      provider.getSigner().then(setSigner).catch(console.error);
    }
  }, [provider]);

  return signer;
}

/**
 * Hook to get factory contract instance
 */
export function useFactoryContract() {
  const signer = useEthersSigner();
  const [factory, setFactory] = useState<Contract | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFactory() {
      if (!signer) return;

      try {
        const network = await signer.provider?.getNetwork();
        if (!network) {
          setError("Network not available");
          return;
        }

        const chainId = Number(network.chainId);
        const factoryAddress = getFactoryAddress(chainId);

        const factoryContract = new Contract(
          factoryAddress,
          MultisigFactoryABI.abi,
          signer
        );

        setFactory(factoryContract);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setFactory(null);
      }
    }

    loadFactory();
  }, [signer]);

  return { factory, error };
}

/**
 * Hook to get multisig wallet contract instance
 */
export function useMultisigContract(address: string) {
  const signer = useEthersSigner();
  const [multisig, setMultisig] = useState<Contract | null>(null);

  useEffect(() => {
    if (signer && address) {
      const contract = new Contract(address, MultisigWalletABI.abi, signer);
      setMultisig(contract);
    }
  }, [signer, address]);

  return multisig;
}

/**
 * Hook to listen to factory events
 */
export function useFactoryEvents(
  onWalletCreated?: (wallet: string, creator: string, owners: string[], threshold: bigint) => void
) {
  const { factory } = useFactoryContract();

  useEffect(() => {
    if (!factory || !onWalletCreated) return;

    const filter = factory.filters.MultisigCreated();

    const handleEvent = (
      wallet: string,
      creator: string,
      owners: string[],
      threshold: bigint
    ) => {
      onWalletCreated(wallet, creator, owners, threshold);
    };

    factory.on(filter, handleEvent);

    return () => {
      factory.off(filter, handleEvent);
    };
  }, [factory, onWalletCreated]);
}

/**
 * Hook to listen to multisig wallet events
 */
export function useMultisigEvents(
  address: string,
  callbacks?: {
    onTransactionSubmitted?: (txId: bigint, to: string, value: bigint) => void;
    onTransactionApproved?: (txId: bigint, owner: string) => void;
    onTransactionExecuted?: (txId: bigint) => void;
  }
) {
  const multisig = useMultisigContract(address);

  useEffect(() => {
    if (!multisig || !callbacks) return;

    const cleanupFns: (() => void)[] = [];

    if (callbacks.onTransactionSubmitted) {
      const filter = multisig.filters.TransactionSubmitted();
      multisig.on(filter, callbacks.onTransactionSubmitted);
      cleanupFns.push(() => multisig.off(filter, callbacks.onTransactionSubmitted!));
    }

    if (callbacks.onTransactionApproved) {
      const filter = multisig.filters.TransactionApproved();
      multisig.on(filter, callbacks.onTransactionApproved);
      cleanupFns.push(() => multisig.off(filter, callbacks.onTransactionApproved!));
    }

    if (callbacks.onTransactionExecuted) {
      const filter = multisig.filters.TransactionExecuted();
      multisig.on(filter, callbacks.onTransactionExecuted);
      cleanupFns.push(() => multisig.off(filter, callbacks.onTransactionExecuted!));
    }

    return () => {
      cleanupFns.forEach((cleanup) => cleanup());
    };
  }, [multisig, callbacks]);
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
