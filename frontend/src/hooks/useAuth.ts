import { logout } from "../redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, loading } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    logout: handleLogout,
  };
};
