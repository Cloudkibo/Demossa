const config = require('./../../config/index')

exports.getProjectId = function (vertical) {
  switch (vertical) {
    case 'commerce':
      return config.ECOMMERCE_PROJECT_ID
    case 'airlines':
      return config.AIRLINES_PROJECT_ID
    default:
      return ''
  }
}
exports.preparePayload = function (fulfillmentMessages, intent) {
  let payload = {}
  fulfillmentMessages.forEach(fulfillmentMessage => {
    if (fulfillmentMessage.payload) {
      payload.options = fulfillmentMessage.payload.options
      payload.API = fulfillmentMessage.payload.API
      payload.otherOptions = fulfillmentMessage.payload.otherOptions
    }
    if (fulfillmentMessage.text) {
      payload.text = fulfillmentMessage.text.text[0]
    }
    payload.responseType = intent.isFallback ? 'fallback' : 'matched'
  })
  return payload
}
