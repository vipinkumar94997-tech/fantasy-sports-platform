import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, loading } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    user,
    token,
    loading: false,
    isAuthenticated: !!token,
    logout: handleLogout,
  };
};
