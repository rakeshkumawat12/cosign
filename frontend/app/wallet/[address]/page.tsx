"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AppLayout from "@/components/layout/app-layout";
import TransactionCard from "@/components/transactions/transaction-card";
import { useWallet } from "@/lib/wallet-context";
import { formatAddress, formatEth, getNetworkName, isValidAddress } from "@/lib/mock-data";
import { Transaction } from "@/lib/types";

export const dynamic = 'force-dynamic';

type TabType = "transactions" | "new-transaction";

export default function WalletDashboard() {
  const params = useParams();
  const router = useRouter();
  const address = params.address as string;
  const { state, addTransaction, approveTransaction, executeTransaction } = useWallet();

  useEffect(() => {
    if (!state.wallet.isConnected) {
      router.push("/accounts");
    }
  }, [state.wallet.isConnected, router]);
  const [activeTab, setActiveTab] = useState<TabType>("transactions");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [formError, setFormError] = useState("");

  const account = useMemo(
    () => state.accounts.find((acc) => acc.address.toLowerCase() === address.toLowerCase()),
    [state.accounts, address]
  );

  const transactions = useMemo(
    () => state.transactions[address] || [],
    [state.transactions, address]
  );

  const pendingTransactions = useMemo(
    () => transactions.filter((tx) => tx.status === "pending"),
    [transactions]
  );

  const executedTransactions = useMemo(
    () => transactions.filter((tx) => tx.status === "executed"),
    [transactions]
  );

  const isOwner = useMemo(() => {
    if (!account || !state.currentSigner) return false;
    return account.owners.some(
      (owner) => owner.address.toLowerCase() === state.currentSigner!.toLowerCase()
    );
  }, [account, state.currentSigner]);

  if (!state.wallet.isConnected) {
    return null;
  }

  if (!account) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Not Found</h2>
          <p className="text-gray-600 mb-6">
            The account you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
          </p>
          <button
            onClick={() => router.push("/accounts")}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
          >
            Back to Accounts
          </button>
        </div>
      </AppLayout>
    );
  }

  const handleApprove = (txId: string) => {
    approveTransaction(address, txId);
  };

  const handleExecute = (txId: string) => {
    executeTransaction(address, txId);
  };

  const handleSubmitTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!recipientAddress || !amount) {
      setFormError("Please fill in all fields");
      return;
    }

    if (!isValidAddress(recipientAddress)) {
      setFormError("Invalid recipient address");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setFormError("Invalid amount");
      return;
    }

    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      multisigAddress: address,
      to: recipientAddress,
      value: amount,
      status: "pending",
      confirmations: [],
      requiredConfirmations: account.threshold,
      createdAt: Date.now(),
    };

    addTransaction(newTransaction);
    setRecipientAddress("");
    setAmount("");
    setActiveTab("transactions");
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Wallet Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {account.name}
              </h1>
              <p className="text-sm font-mono text-gray-500 mb-3">
                {formatAddress(account.address, 8)}
              </p>
              <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                {getNetworkName(account.network)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Balance</div>
              <div className="text-4xl font-bold text-gray-900">
                {formatEth(account.balance)}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
            <div>
              <div className="text-sm text-gray-500 mb-1">Owners</div>
              <div className="text-2xl font-semibold text-gray-900">
                {account.owners.length}
              </div>
              <div className="flex -space-x-2 mt-2">
                {account.owners.map((owner, idx) => (
                  <div
                    key={idx}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 border-2 border-white flex items-center justify-center"
                    title={owner.name || formatAddress(owner.address)}
                  >
                    <span className="text-sm text-white font-medium">
                      {owner.name ? owner.name[0].toUpperCase() : "?"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-1">Threshold</div>
              <div className="text-2xl font-semibold text-gray-900">
                {account.threshold} of {account.owners.length}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Required confirmations
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-1">Pending Transactions</div>
              <div className="text-2xl font-semibold text-gray-900">
                {pendingTransactions.length}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Awaiting approval
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("transactions")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "transactions"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Transactions
            </button>
            {isOwner && (
              <button
                onClick={() => setActiveTab("new-transaction")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "new-transaction"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                New Transaction
              </button>
            )}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "transactions" && (
          <div className="space-y-6">
            {pendingTransactions.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Pending ({pendingTransactions.length})
                </h3>
                <div className="space-y-4">
                  {pendingTransactions.map((tx) => (
                    <TransactionCard
                      key={tx.id}
                      transaction={tx}
                      canApprove={isOwner}
                      canExecute={tx.confirmations.length >= tx.requiredConfirmations}
                      onApprove={() => handleApprove(tx.id)}
                      onExecute={() => handleExecute(tx.id)}
                      hasApproved={tx.confirmations.includes(state.currentSigner || "")}
                    />
                  ))}
                </div>
              </div>
            )}

            {executedTransactions.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  History ({executedTransactions.length})
                </h3>
                <div className="space-y-4">
                  {executedTransactions.map((tx) => (
                    <TransactionCard
                      key={tx.id}
                      transaction={tx}
                      canApprove={false}
                      canExecute={false}
                      onApprove={() => {}}
                      onExecute={() => {}}
                      hasApproved={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {transactions.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No transactions yet
                </h3>
                <p className="text-gray-600">
                  Create your first transaction to get started
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "new-transaction" && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Create New Transaction
              </h2>

              <form onSubmit={handleSubmitTransaction}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (ETH)
                  </label>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {formError && (
                  <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{formError}</p>
                  </div>
                )}

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                  <div className="text-sm text-gray-600">
                    This transaction will require{" "}
                    <span className="font-semibold text-gray-900">
                      {account.threshold} of {account.owners.length}
                    </span>{" "}
                    approvals before it can be executed.
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Submit Transaction
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
