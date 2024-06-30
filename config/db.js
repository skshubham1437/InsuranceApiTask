const mongoose = require("mongoose");
const { DB_URL, DB_NAME } = process.env;

const Connect = async () => {
  try {
    const status = await mongoose.connect(`${DB_URL}/${DB_NAME}`, {
      connectTimeoutMS: 100000, // Increase timeout to 100 seconds
    });
    if (status) {
      console.log("Connected to database!");
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = Connect;
