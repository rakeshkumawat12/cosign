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
    pending: "bg-yellow-100 text-yellow-800",
    executed: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
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
    <div className="border border-gray-200 rounded-lg p-6 bg-white">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                statusColors[transaction.status]
              }`}
            >
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </span>
            <span className="text-sm text-gray-500">
              {formatDate(transaction.createdAt)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>To:</span>
            <span className="font-mono">{formatAddress(transaction.to, 6)}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {formatEth(transaction.value)}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600">
            Confirmations:{" "}
            <span className="font-semibold text-gray-900">
              {transaction.confirmations.length} / {transaction.requiredConfirmations}
            </span>
          </div>
          {transaction.confirmations.length > 0 && (
            <div className="flex -space-x-1">
              {transaction.confirmations.slice(0, 3).map((addr, idx) => (
                <div
                  key={idx}
                  className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 border-2 border-white"
                  title={formatAddress(addr)}
                />
              ))}
              {transaction.confirmations.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-gray-600">
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
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                !canApprove || hasApproved
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {hasApproved ? "Approved" : "Approve"}
            </button>
            <button
              onClick={onExecute}
              disabled={!canExecute}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                !canExecute
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              Execute
            </button>
          </div>
        )}

        {transaction.status === "executed" && transaction.executedAt && (
          <div className="text-sm text-gray-500">
            Executed on {formatDate(transaction.executedAt)}
          </div>
        )}
      </div>
    </div>
  );
}
