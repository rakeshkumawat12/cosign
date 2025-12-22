"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/app-layout";
import AccountCard from "@/components/wallet/account-card";
import { useWallet } from "@/lib/wallet-context";
import { getNetworkName } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export default function AccountsPage() {
  const { state, connectWallet } = useWallet();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAccounts = useMemo(() => {
    if (!searchQuery) return state.accounts;

    const query = searchQuery.toLowerCase();
    return state.accounts.filter(
      (account) =>
        account.name.toLowerCase().includes(query) ||
        account.address.toLowerCase().includes(query) ||
        getNetworkName(account.network).toLowerCase().includes(query)
    );
  }, [state.accounts, searchQuery]);

  if (!state.wallet.isConnected) {
    return (
      <AppLayout>
        <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8 inline-block relative">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-3xl flex items-center justify-center animate-pulse-glow">
                <svg
                  className="w-12 h-12 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-3xl blur-2xl opacity-20"></div>
            </div>
            <h2 className="text-5xl font-extrabold text-white mb-6 tracking-tight">
              Connect Your Wallet
            </h2>
            <p className="text-xl text-neutral-300 mb-10 leading-relaxed max-w-xl mx-auto">
              Connect your wallet to access the multi-signature protocol.
              <br />
              View and manage your secure accounts.
            </p>
            <button
              onClick={connectWallet}
              className="btn-neon group"
            >
              <span className="relative z-10 flex items-center gap-2">
                Connect Wallet
                <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span>
            </button>
            <div className="mt-8 flex items-center justify-center gap-4 text-sm text-neutral-500">
              <span className="font-mono">MetaMask</span>
              <span>•</span>
              <span className="font-mono">WalletConnect</span>
              <span>•</span>
              <span className="font-mono">Coinbase</span>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-12">
          <div className="stagger-fade-in">
            <h1 className="text-headline text-white mb-3 gradient-text">
              My Accounts
            </h1>
            <p className="text-lg text-neutral-400">
              Manage your multi-signature wallets
            </p>
          </div>
          <Link
            href="/accounts/create"
            className="btn-neon group inline-flex items-center justify-center gap-2"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Account
            </span>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-10">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-neutral-500 group-focus-within:text-cyan-400 transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by name, address, or network..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 glass-dark border border-neutral-700/50 rounded-xl text-white placeholder-neutral-500 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
            />
          </div>
        </div>

        {/* Accounts Grid */}
        {filteredAccounts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-fade-in">
            {filteredAccounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="mb-6 inline-block relative">
              <div className="w-20 h-20 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-neutral-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              No accounts found
            </h3>
            <p className="text-neutral-400 text-lg mb-8">
              {searchQuery
                ? "Try adjusting your search query"
                : "Create your first multi-signature account to get started"}
            </p>
            {!searchQuery && (
              <Link
                href="/accounts/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl transition-colors duration-300 border border-neutral-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Your First Account
              </Link>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
