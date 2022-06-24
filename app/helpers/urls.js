const { cleanUrl } = require("./formatter")

const getBaseUrl = (req) => {
  return cleanUrl(req.protocol + '://' + req.get('host'))
}

module.exports = getBaseUrl