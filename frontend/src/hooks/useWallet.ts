import { fetchWallet } from "../redux/slices/walletSlice";
import { useEffect } from "react";
import { formatCurrency } from "../utils/helpers";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

export const useWallet = () => {
  const dispatch = useAppDispatch();
  const { balance, bonusBalance, loading } = useAppSelector(
    (state) => state.wallet,
  );

  useEffect(() => {
    dispatch(fetchWallet());
  }, [dispatch]);

  return {
    balance,
    bonusBalance,
    totalBalance: balance + bonusBalance,
    formattedBalance: formatCurrency(balance),
    loading,
    refresh: () => dispatch(fetchWallet()),
  };
};
