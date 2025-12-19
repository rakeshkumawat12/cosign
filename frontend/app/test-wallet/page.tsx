"use client";

import { useState } from "react";
import { BrowserProvider } from "ethers";

export default function TestWallet() {
  const [status, setStatus] = useState("Not connected");
  const [error, setError] = useState("");

  const testConnection = async () => {
    try {
      setStatus("Checking for MetaMask...");

      if (!window.ethereum) {
        setError("MetaMask not found! Please install MetaMask extension.");
        setStatus("Failed");
        return;
      }

      setStatus("MetaMask found! Requesting accounts...");

      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);

      setStatus(`Connected! Address: ${accounts[0]}`);
      setError("");
    } catch (err: any) {
      setError(`Error: ${err.message}`);
      setStatus("Failed");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">MetaMask Connection Test</h1>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Status:</p>
          <p className="font-mono text-sm bg-gray-100 p-2 rounded">{status}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <button
          onClick={testConnection}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
        >
          Test MetaMask Connection
        </button>

        <div className="mt-4 text-xs text-gray-500">
          <p>This page tests if MetaMask is installed and can connect.</p>
          <p className="mt-2">Expected behavior: Clicking the button should show a MetaMask popup.</p>
        </div>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
