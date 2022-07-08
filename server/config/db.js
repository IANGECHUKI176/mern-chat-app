const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(
      `successfully connected to mongodb database :${conn.connection.host} `
        .cyan.underline
    );
  } catch (error) {
    console.log(`Error:${error.message}`.red.bold);
    process.exit(1);
  }
};

module.exports = connectDB;
