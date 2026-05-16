const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  // Step 1: Check token
  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    // Step 2: Verify token
    const decoded = jwt.verify(token, "secretkey");

    // Step 3: Attach user info
    req.user = decoded;

    // Step 4: Continue
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};