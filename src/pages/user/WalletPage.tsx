import React, { useEffect, useState } from 'react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { userService } from '../../services/api/userService';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

const WalletPage: React.FC = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const data = await userService.getWallet();
      setBalance(data.data.balance || 0);
      setTransactions(data.data.transactions || []);
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFunds = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      setProcessing(true);
      await userService.addFunds(parseFloat(amount));
      await fetchWalletData();
      setShowAddFundsModal(false);
      setAmount('');
    } catch (error) {
      console.error('Failed to add funds:', error);
      alert('Failed to add funds. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">My Wallet</h1>

        {/* Balance Card */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-2 text-gray-600">Available Balance</p>
                <p className="text-4xl font-bold text-blue-600">
                  ${balance.toFixed(2)}
                </p>
              </div>
              <Button onClick={() => setShowAddFundsModal(true)}>
                Add Funds
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <div className="p-4">
              <p className="text-sm text-gray-600">Total Credits</p>
              <p className="text-2xl font-bold text-green-600">
                $
                {transactions
                  .filter(
                    (t) => t.type === 'credit' && t.status === 'completed'
                  )
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toFixed(2)}
              </p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <p className="text-sm text-gray-600">Total Debits</p>
              <p className="text-2xl font-bold text-red-600">
                $
                {transactions
                  .filter((t) => t.type === 'debit' && t.status === 'completed')
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toFixed(2)}
              </p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <p className="text-sm text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-blue-600">
                {transactions.length}
              </p>
            </div>
          </Card>
        </div>

        {/* Transactions */}
        <Card>
          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Transaction History</h2>
            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          transaction.type === 'credit'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {transaction.type === 'credit' ? '↓' : '↑'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {transaction.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${
                          transaction.type === 'credit'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {transaction.type === 'credit' ? '+' : '-'}$
                        {transaction.amount.toFixed(2)}
                      </p>
                      <span
                        className={`rounded px-2 py-1 text-xs ${
                          transaction.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-gray-500">
                No transactions yet
              </p>
            )}
          </div>
        </Card>

        {/* Add Funds Modal */}
        <Modal
          isOpen={showAddFundsModal}
          onClose={() => setShowAddFundsModal(false)}
          title="Add Funds to Wallet"
        >
          <div className="p-6">
            <Input
              label="Amount"
              type="number"
              value={amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAmount(e.target.value)
              }
              placeholder="Enter amount"
              min="1"
              step="0.01"
            />
            <div className="mb-4 mt-2 flex gap-2">
              {[10, 25, 50, 100].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt.toString())}
                  className="rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
                >
                  ${amt}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowAddFundsModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddFunds}
                isLoading={processing}
                className="flex-1"
              >
                Add Funds
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default WalletPage;
