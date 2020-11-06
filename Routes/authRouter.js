const jwt = require("jsonwebtoken");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const userModel = require("../Models/userModel");
const { find } = require("../Models/userModel");

dotenv.config();

const secret_key = process.env.SECRET_KEY || "supersecretkeyrembertohide";

const jwt_headers = {
  algorithm: "HS256",
  expiresIn: 6666666,
};

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  try {
    const findUser = await userModel.findOne({ username });
    if (findUser) {
      if (await bcrypt.compare(password, findUser.password)) {
        const accessToken = jwt.sign(
          { username: findUser.username },
          secret_key,
          jwt_headers
        );
        return res
          .status(200)
          .json({
            message: "Login Success",
            token: accessToken,
            username: findUser.username,
          });
      } else return res.status(400).json({ message: "Wrong Password" });
    }
    const newUserIns = new userModel({ username, password });
    const newUser = await newUserIns.save();
    if (newUser) {
      const accessToken = jwt.sign(
        { username: newUser.username },
        secret_key,
        jwt_headers
      );
      return res
        .status(200)
        .json({
          message: "User Created",
          token: accessToken,
          username: newUser.username,
        });
    } else throw new Error("User creation failed"); 
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Errror", e });
  }
});
 router.get("/all", async (req, res) => {
     try{
        const users = await userModel.find();
        return res.status(200).json(users);
     }
     catch(e){
        return res.status(500).json({"error": e});
     }
     
 });

module.exports = router;