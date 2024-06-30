const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");

// Promisify the callback functions
const mkdir = promisify(fs.mkdir);
const access = promisify(fs.access);

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const uploadDir = "uploads/";

      // Check if the directory exists, if not create it
      try {
        await access(uploadDir);
      } catch (error) {
        await mkdir(uploadDir);
      }

      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
