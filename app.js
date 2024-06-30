const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dbConnection = require("./config/db");
const { restartServerIfNeeded } = require("./utils");

require("moment-timezone")().tz("Asia/Kolkata");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const { handleError } = require("./middleware");

const { v1 } = require("./routes");
const { morganLogger } = require("./middleware/logger");

const app = express();

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

dbConnection();
restartServerIfNeeded();

app.use("/", express.static(path.join(__dirname, "../public")));

app
  .use(morganLogger)
  .use(cors())
  .use(helmet())
  .use(
    bodyParser.urlencoded({
      limit: "100mb",
      extended: true,
      parameterLimit: 50000,
    }),
  )
  .use(bodyParser.json({ limit: "100mb" }))
  .use(express.static(path.join(__dirname, "public")));

// Rate limiter to prevent brute force attack
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 200, // Limit each IP to 200 requests per `window` (here, per 15 minutes)
  message: "Too many requests from this IP, please try again after sometimes",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: true, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

app.use("/api/v1", v1);

app.use((err, req, res, next) => {
  handleError(err, res);
});

module.exports = app;
