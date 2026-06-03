const RESTRICTED_STATES = [
  "Assam",
  "Odisha",
  "Telangana",
  "Andhra Pradesh",
  "Nagaland",
  "Sikkim",
];

export const stateRestrict = (req, res, next) => {
  const userState = req.user?.state;
  if (userState && RESTRICTED_STATES.includes(userState)) {
    return res.status(403).json({
      message: `Fantasy gaming is not allowed in ${userState} as per Indian law`,
    });
  }
  next();
};
