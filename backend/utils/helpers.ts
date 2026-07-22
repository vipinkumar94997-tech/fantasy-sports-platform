export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount || 0);
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const timeUntilMatch = (matchTime: string | number | Date) => {
  const diff = new Date(matchTime).getTime() - Date.now();
  if (diff <= 0) return "Started";
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
};

export const paginate = (page: string | number = 1, limit: string | number = 20) => {
  const pageNum = Number.parseInt(String(page));
  const limitNum = Number.parseInt(String(limit));
  return {
    offset: (pageNum - 1) * limitNum,
    limit: limitNum,
  };
};

export const isRestrictedState = (state: string) => {
  const restricted = [
    "Assam",
    "Odisha",
    "Telangana",
    "Andhra Pradesh",
    "Nagaland",
    "Sikkim",
  ];
  return restricted.includes(state);
};

export const sanitizeUser = (user) => {
  const { password, ...rest } = user.toJSON ? user.toJSON() : user;
  return rest;
};
