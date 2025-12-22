"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/app-layout";
import { useWallet } from "@/lib/wallet-context";
import { MultisigAccount, Signer } from "@/lib/types";
import { isValidAddress } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export default function CreateAccountPage() {
  const router = useRouter();
  const { state, createAccount } = useWallet();

  const [accountName, setAccountName] = useState("");
  const [network] = useState<"sepolia">("sepolia");
  const [signers, setSigners] = useState<Signer[]>([
    { address: "", name: "" },
  ]);
  const [threshold, setThreshold] = useState(1);
  const [isCreating, setIsCreating] = useState(false);

  // Auto-fill first signer with connected wallet
  useEffect(() => {
    if (!state.wallet.isConnected) {
      router.push("/accounts");
    } else if (state.wallet.address && signers[0]?.address === "") {
      setSigners([{ address: state.wallet.address, name: "You" }]);
    }
  }, [state.wallet.isConnected, state.wallet.address, router]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addSigner = () => {
    setSigners([...signers, { address: "", name: "" }]);
  };

  const removeSigner = (index: number) => {
    // Don't allow removing if less than 1 signer or if trying to remove first signer (yourself)
    if (signers.length <= 1 || index === 0) return;
    setSigners(signers.filter((_, i) => i !== index));
    if (threshold > signers.length - 1) {
      setThreshold(signers.length - 1);
    }
  };

  const updateSigner = (index: number, field: keyof Signer, value: string) => {
    const newSigners = [...signers];
    newSigners[index][field] = value;
    setSigners(newSigners);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!accountName.trim()) {
      newErrors.accountName = "Account name is required";
    }

    const addresses = signers.map((s) => s.address.toLowerCase()).filter(Boolean);
    const uniqueAddresses = new Set(addresses);

    signers.forEach((signer, idx) => {
      if (!signer.address.trim()) {
        newErrors[`signer-${idx}-address`] = "Address is required";
      } else if (!isValidAddress(signer.address)) {
        newErrors[`signer-${idx}-address`] = "Invalid Ethereum address";
      } else if (
        addresses.filter((a) => a === signer.address.toLowerCase()).length > 1
      ) {
        newErrors[`signer-${idx}-address`] = "Duplicate address";
      }
    });

    if (threshold < 1) {
      newErrors.threshold = "Threshold must be at least 1";
    }

    if (threshold > signers.length) {
      newErrors.threshold = `Threshold cannot exceed number of signers (${signers.length})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsCreating(true);

    try {
      // Extract owner addresses
      const ownerAddresses = signers.map((s) => s.address);

      // Create multisig via smart contract
      const walletAddress = await createAccount(ownerAddresses, threshold, accountName);

      console.log("Created multisig wallet at:", walletAddress);

      // Success - redirect to accounts page
      router.push("/accounts");
    } catch (error: any) {
      console.error("Failed to create account:", error);
      alert(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  if (!state.wallet.isConnected) {
    return null;
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 stagger-fade-in">
          <h1 className="text-headline text-white mb-4 gradient-text">
            Create Multi-Signature Account
          </h1>
          <p className="text-xl text-neutral-400">
            Set up threshold-based consensus with custom approval requirements
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 md:p-10">
          {/* Account Name */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-neutral-300 mb-3 uppercase tracking-wider">
              Account Name
            </label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="e.g., Team Treasury"
              className={`w-full px-5 py-4 glass-dark border rounded-xl text-white placeholder-neutral-500 focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300 ${
                errors.accountName ? "border-red-500/50 focus:border-red-500" : "border-neutral-700/50 focus:border-cyan-500/50"
              }`}
            />
            {errors.accountName && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.accountName}
              </p>
            )}
          </div>

          {/* Network */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-neutral-300 mb-3 uppercase tracking-wider">
              Network
            </label>
            <div className="px-5 py-4 bg-neutral-900/50 border border-neutral-700/50 rounded-xl text-neutral-300 font-mono flex items-center justify-between">
              <span>Sepolia Testnet</span>
              <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400 text-xs font-bold uppercase">
                Active
              </span>
            </div>
            <p className="mt-2 text-sm text-neutral-500 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Currently only Sepolia testnet is supported
            </p>
          </div>

          {/* Signers */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-neutral-300 mb-4 uppercase tracking-wider">
              Signers ({signers.length})
            </label>

            <div className="space-y-4">
              {signers.map((signer, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={signer.address}
                      onChange={(e) => updateSigner(idx, "address", e.target.value)}
                      placeholder="0x..."
                      disabled={idx === 0}
                      className={`w-full px-5 py-3 border rounded-xl font-mono text-sm transition-all duration-300 ${
                        idx === 0
                          ? "bg-neutral-900/50 text-cyan-400 cursor-not-allowed border-cyan-500/20"
                          : "glass-dark text-white focus:ring-2 focus:ring-purple-500/50"
                      } ${
                        errors[`signer-${idx}-address`]
                          ? "border-red-500/50"
                          : idx === 0 ? "border-cyan-500/20" : "border-neutral-700/50"
                      }`}
                    />
                    {idx === 0 && (
                      <p className="mt-2 text-xs text-cyan-400/70 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Your connected wallet (automatically added)
                      </p>
                    )}
                    {errors[`signer-${idx}-address`] && (
                      <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors[`signer-${idx}-address`]}
                      </p>
                    )}
                  </div>
                  <div className="w-44">
                    <input
                      type="text"
                      value={signer.name}
                      onChange={(e) => updateSigner(idx, "name", e.target.value)}
                      placeholder="Name (optional)"
                      disabled={idx === 0}
                      className={`w-full px-4 py-3 border rounded-xl transition-all duration-300 ${
                        idx === 0
                          ? "bg-neutral-900/50 text-cyan-400 cursor-not-allowed border-cyan-500/20"
                          : "glass-dark text-white border-neutral-700/50 focus:ring-2 focus:ring-purple-500/50"
                      }`}
                    />
                  </div>
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => removeSigner(idx)}
                      className="px-3 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all duration-300 border border-transparent hover:border-red-500/30"
                      title="Remove signer"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Signer Button */}
            <button
              type="button"
              onClick={addSigner}
              className="mt-4 w-full px-5 py-4 border-2 border-dashed border-neutral-700 rounded-xl text-neutral-400 hover:border-purple-500/50 hover:text-purple-400 hover:bg-purple-500/5 transition-all duration-300 flex items-center justify-center gap-2 font-bold group"
            >
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Signer
            </button>
          </div>

          {/* Threshold */}
          <div className="mb-10">
            <label className="block text-sm font-bold text-neutral-300 mb-4 uppercase tracking-wider">
              Approval Threshold
            </label>
            <div className="glass-dark p-6 rounded-xl border border-neutral-700/50">
              <div className="flex items-center gap-6 mb-4">
                <input
                  type="number"
                  min="1"
                  max={signers.length}
                  value={threshold}
                  onChange={(e) => setThreshold(parseInt(e.target.value) || 1)}
                  className={`w-28 px-6 py-4 border rounded-xl font-mono text-2xl font-bold text-center focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300 ${
                    errors.threshold ? "border-red-500/50 text-red-400" : "glass-dark border-neutral-700/50 text-cyan-400"
                  }`}
                />
                <div className="flex-1">
                  <span className="text-neutral-300 text-lg">
                    out of <span className="font-mono font-bold text-white">{signers.length}</span> signer(s)
                  </span>
                  <p className="text-sm text-neutral-500 mt-1">
                    required to approve transactions
                  </p>
                </div>
              </div>
              {errors.threshold && (
                <p className="text-sm text-red-400 flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.threshold}
                </p>
              )}
              <div className="flex items-start gap-3 pt-3 border-t border-neutral-700/30">
                <svg className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-neutral-400">
                  Every transaction will require <span className="font-mono font-bold text-purple-400">{threshold}</span> approval(s) before execution
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push("/accounts")}
              className="px-8 py-4 border-2 border-neutral-700 text-neutral-300 font-bold rounded-xl hover:bg-neutral-800 hover:border-neutral-600 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="flex-1 btn-neon group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isCreating ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating on-chain...
                  </>
                ) : (
                  <>
                    Create Account
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
