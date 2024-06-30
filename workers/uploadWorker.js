const { workerData, parentPort } = require("worker_threads");
const fs = require("fs");
const csv = require("csv-parser");
const Agent = require("../models/Agent");
const User = require("../models/User");
const Account = require("../models/Account");
const LOB = require("../models/LOB");
const Carrier = require("../models/Carrier");
const Policy = require("../models/Policy");
const { DB_URL, DB_NAME } = process.env;
const mongoose = require("mongoose");

mongoose.connect(`${DB_URL}/${DB_NAME}`, {
  connectTimeoutMS: 100000,
});

const filePath = workerData.filePath;

const readCSVFile = async () => {
  const data = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      data.push(row);
    })
    .on("end", async () => {
      for (const row of data) {
        const agent = new Agent({ name: row.agent });
        await agent.save();

        const user = new User({
          firstName: row.firstname,
          dob: new Date(row.dob),
          address: row.address,
          phone: row.phone,
          state: row.state,
          zipCode: row.zip,
          email: row.email,
          gender: row.gender,
          userType: row.userType,
        });
        await user.save();

        const account = new Account({ name: row.account_name });
        await account.save();

        const lob = new LOB({ categoryName: row.category_name });
        await lob.save();

        const carrier = new Carrier({ companyName: row.company_name });
        await carrier.save();

        const policy = new Policy({
          policyNumber: row.policy_number,
          policyStartDate: new Date(row.policy_start_date),
          policyEndDate: new Date(row.policy_end_date),
          policyCategory: lob._id,
          companyCollection: carrier._id,
          userId: user._id,
        });
        await policy.save();
      }

      fs.unlinkSync(filePath);
      console.log("unlink success");
      parentPort.postMessage({
        status: "success",
        message: "Data uploaded successfully",
      });
    })
    .on("error", (error) => {
      parentPort.postMessage(error.message);
    });
};

readCSVFile().catch((error) => {
  parentPort.postMessage(error.message);
});
