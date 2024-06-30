const { TaskCsv } = require("../../../service/v1");

const uploadCsv = async (req, res, next) => {
  try {
    return await new TaskCsv().uploadCsv(req.file);
  } catch (error) {
    next(error);
  }
};

const searchPolicy = async (req, res, next) => {
  try {
    return await new TaskCsv().searchPolicy(req.params);
  } catch (error) {
    next(error);
  }
};

const policy = async (req, res, next) => {
  try {
    return await new TaskCsv().policy(req.body);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadCsv,
  searchPolicy,
  policy,
};
