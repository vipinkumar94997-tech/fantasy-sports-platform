import { useSelector, useDispatch } from "react-redux";
import { logout, getProfile } from "../redux/slices/authSlice";
import { useEffect } from "react";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(getProfile());
    }
  }, [token]);

  const handleLogout = () => dispatch(logout());

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token,
    logout: handleLogout,
  };
};
