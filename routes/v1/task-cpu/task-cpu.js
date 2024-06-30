const express = require("express");
const router = express.Router();
const { dispatcher } = require("../../../middleware");
const { scheduleMessage } = require("../../../controllers/v1");

router.post("/schedule-message", (req, res, next) =>
  dispatcher(req, res, next, scheduleMessage),
);

module.exports = router;
