import { logout } from "../redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { clearAuthSession } from "../utils/authStorage";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, loading, initialized } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    clearAuthSession();
    dispatch(logout());
  };

  return {
    user,
    token,
    loading,
    initialized,
    isAuthenticated: !!token,
    logout: handleLogout,
  };
};
