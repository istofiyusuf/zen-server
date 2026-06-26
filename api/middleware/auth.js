const { verifyToken } = require("../utils/jwt");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Authorization header is required",
    });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      success: false,
      message: "Invalid authorization format. Use: Bearer <token>",
    });
  }

  const token = parts[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  req.user = decoded;
  next();
}

module.exports = { authMiddleware };
