const config = require('./../../config/index')
const sentry = require('./../../global/sentry')
const papertrail = require('./../../global/papertrail')

// data must be req.body
// message must be the title of log/alert
exports.serverLog = function (message, path, data, otherInfo, level = 'info') {
  const namespace = `KiboAutomation:${path}`
  const debug = require('debug')(namespace)

  if (config.env === 'development' || config.env === 'test') {
    debug(data)
    console.log(`${namespace} - ${data}`)
  } else {
    if (config.env === 'production') {
      papertrail.sendLog(message, path, data, otherInfo, level)
    }
    if (level === 'error') {
      sentry.sendAlert(message, path, data, otherInfo, level)
    }
  }
}
