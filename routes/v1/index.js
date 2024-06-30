const express = require("express");
const app = express();

const { taskCsv } = require("./task-csv");
const { taskCpu } = require("./task-cpu");

app.use("/task-csv", taskCsv);
app.use("/task-2", taskCpu);

module.exports = app;
