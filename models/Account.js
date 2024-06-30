const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  name: String,
});

module.exports =
  mongoose.models.Account || mongoose.model("Account", accountSchema);
