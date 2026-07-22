const TDS_THRESHOLD = 10000;
const TDS_RATE = 0.3;

export const calculateTDS = (amount) => {
  if (amount > TDS_THRESHOLD) {
    return Math.floor(amount * TDS_RATE);
  }
  return 0;
};

export const getNetAmount = (amount) => {
  const tds = calculateTDS(amount);
  return amount - tds;
};

export const getTDSDetails = (amount) => {
  const tds = calculateTDS(amount);
  return {
    grossAmount: amount,
    tdsAmount: tds,
    tdsRate: tds > 0 ? `${TDS_RATE * 100}%` : "0%",
    netAmount: amount - tds,
    tdsApplicable: tds > 0,
  };
};
