import Link from "next/link";
import { MultisigAccount } from "@/lib/types";
import { formatAddress, formatEth, getNetworkName } from "@/lib/mock-data";

interface AccountCardProps {
  account: MultisigAccount;
}

export default function AccountCard({ account }: AccountCardProps) {
  return (
    <Link href={`/wallet/${account.address}`}>
      <div className="glass-card p-6 hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 group cursor-pointer">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
              {account.name}
            </h3>
            <p className="text-sm font-mono text-neutral-400 group-hover:text-neutral-300 transition-colors duration-300">
              {formatAddress(account.address, 8)}
            </p>
          </div>
          <div className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold rounded-lg uppercase tracking-wider">
            {getNetworkName(account.network)}
          </div>
        </div>

        <div className="flex justify-between items-end mb-4">
          <div>
            <div className="text-4xl font-extrabold text-white mb-2 font-mono tracking-tight">
              {formatEth(account.balance)}
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-400">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <svg className="w-3.5 h-3.5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-mono font-bold text-purple-300">
                  {account.threshold}/{account.owners.length}
                </span>
              </div>
              <span className="text-neutral-500">threshold</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-neutral-500 mb-2 uppercase tracking-wider font-bold">Signers</div>
            <div className="flex -space-x-3">
              {account.owners.slice(0, 3).map((owner, idx) => (
                <div
                  key={idx}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 border-2 border-neutral-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg"
                  style={{ transitionDelay: `${idx * 50}ms` }}
                  title={owner.name || owner.address}
                >
                  <span className="text-sm text-white font-bold">
                    {owner.name ? owner.name[0].toUpperCase() : "?"}
                  </span>
                </div>
              ))}
              {account.owners.length > 3 && (
                <div className="w-10 h-10 rounded-xl bg-neutral-800 border-2 border-neutral-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  style={{ transitionDelay: '150ms' }}
                >
                  <span className="text-xs text-neutral-400 font-bold">
                    +{account.owners.length - 3}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-700/30 flex items-center justify-between text-xs">
          <span className="text-neutral-500">Click to manage</span>
          <svg className="w-4 h-4 text-neutral-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
