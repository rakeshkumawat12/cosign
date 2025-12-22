import Link from "next/link";
import Image from "next/image";
import { Features } from "@/components/ui/features";
import { AnimatedText } from "@/components/ui/animated-underline-text-one";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-neutral-100">
      {/* Header */}
      <header className="sticky top-0 z-50 glass backdrop-blur-xl border-b border-neutral-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <Link href="/" className="group relative">
              <div className="relative">
                <Image
                  src="/logo.png"
                  alt="CoSign Logo"
                  width={180}
                  height={45}
                  className="h-8 w-auto sm:h-10 transition-all duration-300 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-green-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
            </Link>
            <Link
              href="/accounts"
              className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-cyan-500 to-green-500 text-white text-sm sm:text-base font-bold rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg shadow-cyan-500/20"
            >
              Launch
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12 sm:pb-16 text-center">
        <h1 className="text-display text-white mb-4 sm:mb-6">
          Multisig security for your onchain assets
        </h1>
        <p className="text-body text-neutral-400 mb-8 sm:mb-10 max-w-3xl mx-auto">
          Protect your crypto with shared control. Require multiple approvals before any transaction is executed.
        </p>
        <Link
          href="/accounts"
          className="inline-block px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-green-500 text-white text-base sm:text-lg font-bold rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg shadow-cyan-500/20"
        >
          Launch App
        </Link>
      </section>

      {/* Visual Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 hidden sm:block">
        <div className="relative h-64 md:h-80 flex items-center justify-center">
          {/* Card 1 */}
          <div className="absolute left-[10%] md:left-[20%] w-56 sm:w-64 md:w-80 h-36 sm:h-40 md:h-48 glass-card p-4 sm:p-6 rotate-[-3deg] hover:rotate-0 transition-transform duration-300 shadow-2xl">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-cyan-500 to-green-500"></div>
              <div className="flex-1 h-3 sm:h-4 bg-neutral-700/50 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-2 sm:h-3 bg-neutral-700/30 rounded w-3/4"></div>
              <div className="h-2 sm:h-3 bg-neutral-700/30 rounded w-1/2"></div>
            </div>
            <div className="mt-3 sm:mt-4 flex gap-2">
              <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded text-xs text-cyan-400 font-bold">
                2/3 Required
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="absolute right-[10%] md:right-[20%] w-56 sm:w-64 md:w-80 h-36 sm:h-40 md:h-48 glass-card p-4 sm:p-6 rotate-[3deg] hover:rotate-0 transition-transform duration-300 shadow-2xl">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-green-500 to-cyan-500"></div>
              <div className="flex-1 h-3 sm:h-4 bg-neutral-700/50 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-2 sm:h-3 bg-neutral-700/30 rounded w-2/3"></div>
              <div className="h-2 sm:h-3 bg-neutral-700/30 rounded w-5/6"></div>
            </div>
            <div className="mt-3 sm:mt-4 flex -space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-cyan-500 to-green-500 border-2 border-neutral-900"></div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-green-500 to-cyan-500 border-2 border-neutral-900"></div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-cyan-400 to-green-400 border-2 border-neutral-900"></div>
            </div>
          </div>
        </div>
        <p className="text-center text-neutral-400 mt-24 md:mt-32 text-base sm:text-lg font-medium">
          One wallet. Multiple approvals. Zero compromise.
        </p>
      </section>

      {/* Features Section */}
      <Features />

      {/* Target Users Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
        <h2 className="text-headline text-white mb-4 sm:mb-6">
          Built for Individuals, Teams, and DAOs
        </h2>
        <p className="text-body text-neutral-400 max-w-3xl mx-auto">
          Use multisig wallets to protect funds, reduce single-point failure, and ensure accountability in every transaction.
        </p>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
        <Link
          href="/accounts"
          className="inline-block px-8 sm:px-12 py-3 sm:py-5 bg-gradient-to-r from-cyan-500 to-green-500 text-white text-base sm:text-xl font-bold rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg shadow-cyan-500/20"
        >
          Launch App
        </Link>
        <p className="text-neutral-500 mt-4 sm:mt-6 text-sm sm:text-base">
          <AnimatedText
            text="No signup. Connect your wallet to get started."
            delay={0.3}
            underlineColor="from-cyan-500 to-green-500"
          />
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800/50 mt-12 sm:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <p className="text-center text-neutral-500 text-sm sm:text-base">
            Multi-Signature Wallet • Built on Ethereum • Open & Transparent
          </p>
        </div>
      </footer>
    </div>
  );
}
