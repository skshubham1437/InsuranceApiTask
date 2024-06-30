const mongoose = require("mongoose");

const lobSchema = new mongoose.Schema({
  // Define your schema here
  name: String,
});

module.exports = mongoose.models.LOB || mongoose.model("LOB", lobSchema);
