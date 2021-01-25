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
  let payload = {
    responseType: intent.isFallback ? 'fallback' : 'matched'
  }
  fulfillmentMessages.forEach(fulfillmentMessage => {
    if (fulfillmentMessage.payload) {
      payload.options = fulfillmentMessage.payload.options
      payload.API = fulfillmentMessage.payload.API
      payload.otherOptions = fulfillmentMessage.payload.otherOptions
      payload.event = fulfillmentMessage.payload.event
      payload.openEndedResponse = fulfillmentMessage.payload.openEndedResponse
      payload.showCard = fulfillmentMessage.payload.showCard
    }
    if (fulfillmentMessage.text) {
      payload.text = fulfillmentMessage.text.text[0]
    }
  })
  return payload
}
exports.prepareQuery = function (type, userInput) {
  let query = {
    queryInput: {}
  }
  if (type === 'text') {
    query.queryInput.text = {
      text: userInput,
      languageCode: 'en-US'
    }
  } else {
    query.queryInput.event = {
      name: userInput,
      languageCode: 'en-US'
    }
  }
  return query
}
