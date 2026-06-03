export const validateRegister = (req, res, next) => {
  const { name, email, phone, password, state, age } = req.body;

  if (!name || name.trim().length < 2)
    return res.status(400).json({ message: "Valid name required" });

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ message: "Valid email required" });

  if (!phone || !/^[6-9]\d{9}$/.test(phone))
    return res
      .status(400)
      .json({ message: "Valid 10-digit Indian phone required" });

  if (!password || password.length < 8)
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters" });

  if (!state) return res.status(400).json({ message: "State is required" });

  if (!age || parseInt(age) < 18)
    return res.status(400).json({ message: "Must be 18 or older" });

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });
  next();
};

export const validateWithdraw = (req, res, next) => {
  const { amount, upiId } = req.body;
  if (!amount || amount < 100)
    return res.status(400).json({ message: "Minimum withdrawal ₹100" });
  if (!upiId || !/^[\w.-]+@[\w.-]+$/.test(upiId))
    return res.status(400).json({ message: "Valid UPI ID required" });
  next();
};
