import { Transaction } from "@/lib/types";
import { formatAddress, formatEth } from "@/lib/utils";

interface TransactionCardProps {
  transaction: Transaction;
  canApprove: boolean;
  canExecute: boolean;
  onApprove: () => void;
  onExecute: () => void;
  hasApproved: boolean;
}

export default function TransactionCard({
  transaction,
  canApprove,
  canExecute,
  onApprove,
  onExecute,
  hasApproved,
}: TransactionCardProps) {
  const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    executed: "bg-green-500/10 text-green-400 border border-green-500/20",
    rejected: "bg-red-500/10 text-red-400 border border-red-500/20",
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="glass-card p-6 hover:border-cyan-500/30 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`px-3 py-1 text-xs font-bold rounded-full ${
                statusColors[transaction.status]
              }`}
            >
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </span>
            <span className="text-sm text-neutral-400">
              {formatDate(transaction.createdAt)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-300">
            <span className="text-neutral-500">To:</span>
            <span className="font-mono">{formatAddress(transaction.to, 6)}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            {formatEth(transaction.value)}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-neutral-700/30">
        <div className="flex items-center gap-2">
          <div className="text-sm text-neutral-400">
            Confirmations:{" "}
            <span className="font-semibold text-white">
              {transaction.confirmations.length} / {transaction.requiredConfirmations}
            </span>
          </div>
          {transaction.confirmations.length > 0 && (
            <div className="flex -space-x-1">
              {transaction.confirmations.slice(0, 3).map((addr, idx) => (
                <div
                  key={idx}
                  className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-green-500 border-2 border-neutral-900"
                  title={formatAddress(addr)}
                />
              ))}
              {transaction.confirmations.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-neutral-800 border-2 border-neutral-900 flex items-center justify-center">
                  <span className="text-xs text-neutral-400">
                    +{transaction.confirmations.length - 3}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {transaction.status === "pending" && (
          <div className="flex gap-2">
            <button
              onClick={onApprove}
              disabled={!canApprove || hasApproved}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${
                !canApprove || hasApproved
                  ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-500 to-green-500 text-white hover:scale-105 shadow-lg shadow-cyan-500/20"
              }`}
            >
              {hasApproved ? "Approved" : "Approve"}
            </button>
            <button
              onClick={onExecute}
              disabled={!canExecute}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${
                !canExecute
                  ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700 hover:scale-105"
              }`}
            >
              Execute
            </button>
          </div>
        )}

        {transaction.status === "executed" && transaction.executedAt && (
          <div className="text-sm text-neutral-400">
            Executed on {formatDate(transaction.executedAt)}
          </div>
        )}
      </div>
    </div>
  );
}
