import { useEffect, useRef, type ReactNode } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { getProfile, restoreSession } from "../../redux/slices/authSlice";
import { AUTH_SESSION_EVENT, getStoredAuthSession } from "../../utils/authStorage";

interface AuthProviderProps { children: ReactNode }

const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useAppDispatch();
  const initializationStarted = useRef(false);

  useEffect(() => {
    const synchronizeSession = () => dispatch(restoreSession(getStoredAuthSession()));
    window.addEventListener(AUTH_SESSION_EVENT, synchronizeSession);
    window.addEventListener("storage", synchronizeSession);

    if (!initializationStarted.current) {
      initializationStarted.current = true;
      const session = getStoredAuthSession();
      dispatch(restoreSession(session));
      if (session.token) void dispatch(getProfile());
    }

    return () => {
      window.removeEventListener(AUTH_SESSION_EVENT, synchronizeSession);
      window.removeEventListener("storage", synchronizeSession);
    };
  }, [dispatch]);

  return children;
};

export default AuthProvider;
