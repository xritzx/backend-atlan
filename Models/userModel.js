const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: { type: String },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified || !this.isNew) {
    next();
  } else this.isModified("password");
  if(this.password)
    this.password = await bcrypt.hash(String(this.password), 12);
  next();
});

module.exports = mongoose.model("user", userSchema);