export interface AuthUser {
  id?: number | string;
  role?: string;
  name?: string;
  email?: string;
  phone?: string;
  state?: string;
  referralCode?: string;
  kycStatus?: string;
  totalContests?: number;
  totalWinnings?: number;
}

export interface AuthSession {
  token: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
}

export const AUTH_SESSION_EVENT = "fantasy11:auth-session-changed";

const readUser = (): AuthUser | null => {
  const value = localStorage.getItem("user");
  if (!value) return null;
  try {
    return JSON.parse(value) as AuthUser;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export const getStoredAuthSession = (): AuthSession => ({
  token: localStorage.getItem("token"),
  refreshToken: localStorage.getItem("refreshToken"),
  user: readUser(),
});

const notifySessionChanged = () => window.dispatchEvent(new CustomEvent(AUTH_SESSION_EVENT));

export const storeAuthSession = (session: { token: string; refreshToken?: string | null; user: AuthUser }) => {
  localStorage.setItem("token", session.token);
  if (session.refreshToken) localStorage.setItem("refreshToken", session.refreshToken);
  localStorage.setItem("user", JSON.stringify(session.user));
  notifySessionChanged();
};

export const storeAccessToken = (token: string) => {
  localStorage.setItem("token", token);
  notifySessionChanged();
};

export const storeAuthUser = (user: AuthUser) => {
  localStorage.setItem("user", JSON.stringify(user));
  notifySessionChanged();
};

export const clearAuthSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  notifySessionChanged();
};
