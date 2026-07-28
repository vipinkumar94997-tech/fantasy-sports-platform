import axios, { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { API_URL } from "../utils/constants";
import { clearAuthSession, getStoredAuthSession, storeAccessToken } from "../utils/authStorage";

interface RetryableRequestConfig extends InternalAxiosRequestConfig { _retry?: boolean }
interface ResilientRequestConfig extends RetryableRequestConfig {
  _networkRetry?: boolean;
}
interface RefreshTokenResponse { token: string }

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

let refreshRequest: Promise<string> | null = null;

const refreshAccessToken = (refreshToken: string): Promise<string> => {
  if (!refreshRequest) {
    refreshRequest = axios
      .post<RefreshTokenResponse>(`${API_URL}/auth/refresh-token`, { token: refreshToken }, { withCredentials: true })
      .then(({ data }) => {
        if (!data.token) throw new Error("Refresh response did not include a token");
        storeAccessToken(data.token);
        return data.token;
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError(error) && [401, 403].includes(error.response?.status ?? 0)) {
          clearAuthSession();
        }
        throw error;
      })
      .finally(() => { refreshRequest = null; });
  }
  return refreshRequest;
};

api.interceptors.request.use((config) => {
  const { token } = getStoredAuthSession();
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as ResilientRequestConfig | undefined;
    if (!original) return Promise.reject(error);

    const status = error.response?.status;
    const method = original.method?.toLowerCase();
    const isRecoverable =
      !error.response || status === 502 || status === 503 || status === 504;

    if (method === "get" && isRecoverable && !original._networkRetry) {
      original._networkRetry = true;
      return api(original);
    }

    if (status !== 401) return Promise.reject(error);

    if (original._retry) {
      clearAuthSession();
      return Promise.reject(error);
    }

    const requestUrl = original.url ?? "";
    if (/\/auth\/(login|register|google|verify-otp|refresh-token)$/.test(requestUrl)) return Promise.reject(error);

    const { refreshToken } = getStoredAuthSession();
    if (!refreshToken) {
      clearAuthSession();
      return Promise.reject(error);
    }

    original._retry = true;
    try {
      const token = await refreshAccessToken(refreshToken);
      original.headers = AxiosHeaders.from(original.headers);
      original.headers.set("Authorization", `Bearer ${token}`);
      return api(original);
    } catch {
      // Network, CORS and 5xx refresh failures deliberately preserve the session.
      return Promise.reject(error);
    }
  },
);

export default api;
