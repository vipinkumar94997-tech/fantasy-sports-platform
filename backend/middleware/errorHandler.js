export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.stack);

  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      message: "Validation Error",
      errors: err.errors.map((e) => e.message),
    });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({
      message: "Already exists",
      field: err.errors[0]?.path,
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Token expired" });
  }

  res.status(status).json({ message });
};
