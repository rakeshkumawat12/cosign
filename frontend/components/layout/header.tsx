"use client";

import Link from "next/link";
import Image from "next/image";
import { useWallet } from "@/lib/wallet-context";
import { formatAddress } from "@/lib/utils";

export default function Header() {
  const { state, connectWallet, disconnectWallet } = useWallet();

  return (
    <header className="sticky top-0 z-50 glass backdrop-blur-xl border-b border-neutral-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group relative">
              <div className="relative">
                <Image
                  src="/logo.png"
                  alt="CoSign Logo"
                  width={180}
                  height={45}
                  className="h-10 w-auto sm:h-12 transition-all duration-300 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-green-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
            </Link>
          </div>

          <nav className="flex items-center gap-6">
            {state.wallet.isConnected && (
              <Link
                href="/accounts"
                className="text-neutral-300 hover:text-white font-bold transition-colors duration-200 relative group"
              >
                Accounts
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}

            {state.wallet.isConnected ? (
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 glass-dark border border-neutral-700/50 rounded-xl group hover:border-cyan-500/30 transition-all duration-300">
                  <span className="text-sm font-mono text-neutral-300 group-hover:text-cyan-400 transition-colors duration-300">
                    {formatAddress(state.wallet.address!)}
                  </span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="px-4 py-2 text-sm font-bold text-neutral-400 hover:text-white transition-colors duration-200"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-green-500 text-white font-bold rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg shadow-cyan-500/20"
              >
                Connect Wallet
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
