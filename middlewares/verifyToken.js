const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const userModel = require("../Models/userModel");

dotenv.config();

module.exports = async (req, res, next) => {
  let token = req.header("Authorization");

  if (!token)
    return res.status(400).json({ message: "Authentication Header Not Found" });
  token = token.split(" ")[1];

  try {
    let decoded = jwt.verify(
      token,
      String(process.env.SECRET_KEY) || "supersecretkeyrembertohide"
    );

    if (!decoded)
      return res.status(400).json({ message: "Expired or Invalid token" });

    const user = await userModel.find({ username: decoded.username });
    if (!user)
      return res.status(400).json({ message: "Invalid User correspondence" });
    req.body.username = decoded.username;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Failed verifying Token", error });
  }
};