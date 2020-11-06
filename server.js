const express = require("express");
const dotenv = require("dotenv");
const uploadRoutes = require("./Routes/uploadRouter.js");
const exportRoutes = require("./Routes/exportRouter.js");
const authRoutes = require("./Routes/authRouter.js");
const cors = require("cors");
const db = require("./db");
const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/upload", uploadRoutes);
app.use("/export", exportRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running. Listening at port: ${PORT}`);
  db().then(() => {
    console.log("MongoDB connected");
  });
});
