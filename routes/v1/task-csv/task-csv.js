const express = require("express");
const router = express.Router();
const { uploadMulter } = require("../../../utils");
const { dispatcher } = require("../../../middleware");
const { uploadCsv, searchPolicy, policy } = require("../../../controllers/v1");

router.post("/import-csv", uploadMulter.single("file"), (req, res, next) =>
  dispatcher(req, res, next, uploadCsv),
);
router.get("/search-policy/:username", (req, res, next) =>
  dispatcher(req, res, next, searchPolicy),
);
router.get("/policy", (req, res, next) => dispatcher(req, res, next, policy));

module.exports = router;
