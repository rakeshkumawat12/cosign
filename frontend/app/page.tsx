import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-neutral-100">
      {/* Header */}
      <header className="sticky top-0 z-50 glass backdrop-blur-xl border-b border-neutral-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-extrabold text-white tracking-tight">
              CoSign
            </Link>
            <Link
              href="/accounts"
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg shadow-cyan-500/20"
            >
              Launch
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
          Multisig security for your onchain assets
        </h1>
        <p className="text-xl md:text-2xl text-neutral-400 mb-10 max-w-3xl mx-auto leading-relaxed">
          Protect your crypto with shared control.
          <br />
          Require multiple approvals before any transaction is executed.
        </p>
        <Link
          href="/accounts"
          className="inline-block px-10 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-lg font-bold rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg shadow-cyan-500/20"
        >
          Launch
        </Link>
      </section>

      {/* Visual Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative h-64 md:h-80 flex items-center justify-center">
          {/* Card 1 */}
          <div className="absolute left-[10%] md:left-[20%] w-64 md:w-80 h-40 md:h-48 glass-card p-6 rotate-[-3deg] hover:rotate-0 transition-transform duration-300 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600"></div>
              <div className="flex-1 h-4 bg-neutral-700/50 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-neutral-700/30 rounded w-3/4"></div>
              <div className="h-3 bg-neutral-700/30 rounded w-1/2"></div>
            </div>
            <div className="mt-4 flex gap-2">
              <div className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded text-xs text-cyan-400 font-bold">
                2/3 Required
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="absolute right-[10%] md:right-[20%] w-64 md:w-80 h-40 md:h-48 glass-card p-6 rotate-[3deg] hover:rotate-0 transition-transform duration-300 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500"></div>
              <div className="flex-1 h-4 bg-neutral-700/50 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-neutral-700/30 rounded w-2/3"></div>
              <div className="h-3 bg-neutral-700/30 rounded w-5/6"></div>
            </div>
            <div className="mt-4 flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 border-2 border-neutral-900"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 border-2 border-neutral-900"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-cyan-500 border-2 border-neutral-900"></div>
            </div>
          </div>
        </div>
        <p className="text-center text-neutral-400 mt-24 md:mt-32 text-lg font-medium">
          One wallet. Multiple approvals. Zero compromise.
        </p>
      </section>

      {/* Value Proposition Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
          From Tools to Treasuries — It&apos;s All Safe
        </h2>
        <p className="text-xl text-neutral-400 leading-relaxed max-w-3xl mx-auto">
          Whether you&apos;re managing personal funds, DAO treasuries, or team wallets, our multisig keeps assets secure and transparent.
        </p>
      </section>

      {/* Features Card */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass-card p-8 md:p-10">
          <ul className="space-y-4 text-lg">
            <li className="flex items-start gap-3 text-neutral-300">
              <svg className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Create shared wallets with custom owners
            </li>
            <li className="flex items-start gap-3 text-neutral-300">
              <svg className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Approve and execute transactions securely
            </li>
            <li className="flex items-start gap-3 text-neutral-300">
              <svg className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Track balances and transaction history
            </li>
            <li className="flex items-start gap-3 text-neutral-300">
              <svg className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Read-only access for transparency
            </li>
            <li className="flex items-start gap-3 text-neutral-300">
              <svg className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Built fully on-chain
            </li>
          </ul>
        </div>
      </section>

      {/* Target Users Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
          Built for Individuals, Teams, and DAOs
        </h2>
        <p className="text-xl text-neutral-400 leading-relaxed max-w-3xl mx-auto">
          Use multisig wallets to protect funds, reduce single-point failure, and ensure accountability in every transaction.
        </p>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Link
          href="/accounts"
          className="inline-block px-12 py-5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xl font-bold rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg shadow-cyan-500/20"
        >
          Launch
        </Link>
        <p className="text-neutral-500 mt-6 text-lg">
          No signup. Connect your wallet to get started.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-neutral-500">
            Multi-Signature Wallet • Built on Ethereum • Open & Transparent
          </p>
        </div>
      </footer>
    </div>
  );
}
