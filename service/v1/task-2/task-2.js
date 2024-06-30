const { ErrorHandler, statusCodes } = require("../../../helper");
const { SERVER_ERROR, NOT_ACCEPTABLE } = statusCodes;
const { Message } = require("../../../models");
const schedule = require("node-schedule");
const moment = require("moment-timezone");

class Task2 {
  async scheduleMessage(body) {
    try {
      const { message, scheduledDay, scheduledTime } = body;

      // Basic validation for required fields
      if (!message || !scheduledDay || !scheduledTime)
        throw new ErrorHandler(NOT_ACCEPTABLE, "Missing required fields");

      // Mongoose validation (using moment for time validation)
      const scheduledDate = moment()
        .day(scheduledDay) // Set day of week (0-6)
        .set("hour", scheduledTime.split(":")[0])
        .set("minute", scheduledTime.split(":")[1]);

      if (!scheduledDate.isValid())
        throw new ErrorHandler(
          NOT_ACCEPTABLE,
          "Invalid scheduled date or time",
        );

      if (scheduledDate.isBefore(moment()))
        throw new ErrorHandler(NOT_ACCEPTABLE, "Scheduled time is in the past");

      const newMessage = await Message.create({
        message,
        scheduledDay,
        scheduledTime: scheduledDate.format("HH:mm"), // Store in HH:mm format
      });

      // Schedule the job (using moment for rule generation)
      schedule.scheduleJob(
        { rule: scheduledDate.toDate() }, // Convert Moment object to Date for node-schedule
        async function () {
          await Message.updateOne({ _id: newMessage._id }, { isSent: true });
          console.log("Message sent:", message);
        },
      );

      return newMessage;
    } catch (error) {
      if (error.statusCodes)
        throw new ErrorHandler(error.statusCodes, error.message);
      throw new ErrorHandler(SERVER_ERROR, error.message);
    }
  }
}
module.exports = Task2;
