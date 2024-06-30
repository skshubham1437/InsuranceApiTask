const camelcaseKeys = require("camelcase-keys");

module.exports = {
  camelize: (obj) => {
    try {
      return camelcaseKeys(JSON.parse(JSON.stringify(obj)), { deep: true });
    } catch (error) {
      throw error;
    }
  },
};
