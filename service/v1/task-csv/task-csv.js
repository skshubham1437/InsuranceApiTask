const { ErrorHandler, statusCodes } = require("../../../helper");
const { SERVER_ERROR, NOT_ACCEPTABLE } = statusCodes;
const { ACTIVE } = require("../../../utils/constant");
const { Worker } = require("worker_threads");
const { User, Policy } = require("../../../models");

class TaskCsv {
  async uploadCsv(file) {
    try {
      const result = await new Promise((resolve, reject) => {
        const worker = new Worker("./workers/uploadWorker.js", {
          workerData: { filePath: file.path },
        });

        worker.on("message", (message) => {
          if (message.status === "success") {
            resolve(message.message); // Return success message
          } else {
            reject(new Error(message.message)); // Handle errors
          }
        });

        worker.on("error", (error) => {
          reject(error);
        });

        worker.on("exit", (code) => {
          if (code !== 0) {
            reject(new Error(`Worker stopped with exit code ${code}`));
          }
        });
      });

      return result;
    } catch (error) {
      if (error.statusCode)
        throw new ErrorHandler(error.statusCode, error.message);
      throw new ErrorHandler(SERVER_ERROR, error.message);
    }
  }

  async searchPolicy(query) {
    try {
      const { username } = query;
      if (username == null)
        throw new ErrorHandler(NOT_ACCEPTABLE, "username must be provided");

      const user = await User.findOne({ firstName: "Lura Lucca" });

      if (!user) throw new ErrorHandler(NOT_ACCEPTABLE, "Invalid Username");

      // Find policies associated with the user
      const policies = await Policy.find({ userId: user._id });

      return policies;
    } catch (error) {
      if (error.statusCode)
        throw new ErrorHandler(error.statusCode, error.message);
      throw new ErrorHandler(SERVER_ERROR, error.message);
    }
  }

  async policy(body) {
    try {
      const aggregateData = await Policy.aggregate([
        {
          $group: {
            _id: "$userId", // Group by userId
            count: { $sum: 1 }, // Count number of policies per user
            totalPremium: { $sum: "$premiumAmount" }, // Calculate total premium per user
          },
        },
      ]);

      return aggregateData;
    } catch (error) {
      if (error.statusCode)
        throw new ErrorHandler(error.statusCode, error.message);
      throw new ErrorHandler(SERVER_ERROR, error.message);
    }
  }
}
module.exports = TaskCsv;
