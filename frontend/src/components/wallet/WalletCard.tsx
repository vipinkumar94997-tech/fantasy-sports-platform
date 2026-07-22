import { Link } from "react-router-dom";
import { useWallet } from "../../hooks/useWallet";
import { formatCurrency } from "../../utils/helpers";

const WalletCard = () => {
  const { balance, bonusBalance, totalBalance } = useWallet();

  return (
    <div className="card p-5 bg-gradient-to-br from-primary-900/40 to-dark-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 text-sm font-medium">My Wallet</h3>
        <span className="text-2xl">💰</span>
      </div>

      <div className="mb-4">
        <p className="text-gray-400 text-xs mb-1">Total Balance</p>
        <p className="text-white text-3xl font-bold">
          {formatCurrency(totalBalance)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-dark-300/50 rounded-lg p-3">
          <p className="text-gray-500 text-xs mb-1">Withdrawable</p>
          <p className="text-primary-400 font-bold">
            {formatCurrency(balance)}
          </p>
        </div>
        <div className="bg-dark-300/50 rounded-lg p-3">
          <p className="text-gray-500 text-xs mb-1">Bonus</p>
          <p className="text-yellow-400 font-bold">
            {formatCurrency(bonusBalance)}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          to="/wallet"
          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-center text-sm font-bold py-2.5 rounded-lg transition-colors"
        >
          + Add Money
        </Link>
        <Link
          to="/wallet?tab=withdraw"
          className="flex-1 border border-white/20 hover:border-white/40 text-white text-center text-sm font-medium py-2.5 rounded-lg transition-colors"
        >
          Withdraw
        </Link>
      </div>
    </div>
  );
};

export default WalletCard;
