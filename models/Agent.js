const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema({
  name: String,
});

module.exports = mongoose.models.Agent || mongoose.model("Agent", agentSchema);
