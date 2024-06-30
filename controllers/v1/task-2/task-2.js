const { Task2 } = require("../../../service/v1");

const scheduleMessage = async (req, res, next) => {
  try {
    return await new Task2().scheduleMessage(req.body);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  scheduleMessage,
};
