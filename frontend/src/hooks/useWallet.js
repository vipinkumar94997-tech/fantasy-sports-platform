import { useDispatch, useSelector } from "react-redux";
import { fetchWallet } from "../redux/slices/walletSlice";
import { useEffect } from "react";
import { formatCurrency } from "../utils/helpers";

export const useWallet = () => {
  const dispatch = useDispatch();
  const { balance, bonusBalance, loading } = useSelector(
    (state) => state.wallet,
  );

  useEffect(() => {
    dispatch(fetchWallet());
  }, []);

  return {
    balance,
    bonusBalance,
    totalBalance: balance + bonusBalance,
    formattedBalance: formatCurrency(balance),
    loading,
    refresh: () => dispatch(fetchWallet()),
  };
};
