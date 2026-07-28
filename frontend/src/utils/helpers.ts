export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string | number | Date) => {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
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

export const getInitials = (name?: string) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const truncate = (str: string | undefined, n: number) => {
  return str && str.length > n ? `${str.slice(0, n - 1)}...` : str;
};

export const calculateTDS = (amount: number) => {
  if (amount > 10000) return amount * 0.3;
  return 0;
};

export const getRankSuffix = (rank: number) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
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
