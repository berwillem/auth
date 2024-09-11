var jwt = require("jsonwebtoken");

// middelware that verify the token
exports.authCheck = async (req, res, next) => {
  // get the token from the header
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
