const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  message: { type: String, required: true },
  scheduledDay: {
    type: Number,
    required: true,
    min: 0, // Sunday (0) to Saturday (6)
    max: 6,
  },
  scheduledTime: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value); // HH:MM format
      },
      message: (props) => `${props.value} is not a valid time in HH:MM format`,
    },
  },
  isSent: { type: Boolean, default: false },
});
module.exports =
  mongoose.models.Message || mongoose.model("Message", messageSchema);
