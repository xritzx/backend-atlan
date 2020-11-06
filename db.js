const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDb = () => {
 return mongoose.connect(String(process.env.MONGO_URI)||'mongodb://mongo:27017/zoo',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
};

module.exports = connectDb;