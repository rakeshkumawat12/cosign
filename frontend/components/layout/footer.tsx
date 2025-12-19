export default function Footer() {
  return (
    <footer className="border-t border-neutral-800/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-neutral-500 text-sm">
            © {new Date().getFullYear()} Cosign. Multi-Signature Wallet.
          </div>
          <div className="flex space-x-6 text-sm text-neutral-500">
            <a href="#" className="hover:text-white transition-colors duration-200">
              Documentation
            </a>
            <a href="#" className="hover:text-white transition-colors duration-200">
              GitHub
            </a>
            <a href="#" className="hover:text-white transition-colors duration-200">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
