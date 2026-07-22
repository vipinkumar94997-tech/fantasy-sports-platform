import dotenv from "dotenv";

dotenv.config();

export const requireEnv = (name: keyof NodeJS.ProcessEnv): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

export const validateCoreEnvironment = (): void => {
  requireEnv("DATABASE_URL");
  requireEnv("JWT_SECRET");
  requireEnv("JWT_REFRESH_SECRET");
};
