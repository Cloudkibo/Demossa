const config = require('./../../config/index')
const { dialogFlowApiCaller } = require('./../../global/dialogFlow/index')
const { sendSuccessResponse, sendErrorResponse } = require('./../../global/response')
const TAG = 'api/intents/intents.controller.js'
const logger = require('./../../global/logger')

exports.index = function (req, res) {
  let data = {
    queryInput: {
      text: {
        text: req.body.userInput,
        languageCode: 'en-US'
      }
    }
  }
  dialogFlowApiCaller(
    req.body.vertical === 'commerce' ? config.ECOMMERCE_PROJECT_ID : config.AIRLINES_PROJECT_ID,
    `agent/sessions/${req.body.subscriberId}:detectIntent`,
    'post', data)
    .then(result => {
      if (result.data && result.data.responseId && result.data.queryResult.fulfillmentMessages.length > 0) {
        let fulfillmentMessages = result.data.queryResult.fulfillmentMessages
        let intent = result.data.queryResult.intent
        let payload = {
          responseType: intent.isFallback ? 'fallback' : 'matched',
          text: fulfillmentMessages[0].text.text[0],
          options: fulfillmentMessages[1] ? fulfillmentMessages[1].payload.options : undefined,
          API: fulfillmentMessages[1] ? fulfillmentMessages[1].payload.API : undefined,
          otherOptions: fulfillmentMessages[1] ? fulfillmentMessages[1].payload.otherOptions : undefined
        }
        sendSuccessResponse(res, 200, payload)
      } else {
        sendSuccessResponse(res, 200, {})
      }
    })
    .catch((err) => {
      const message = err || 'Failed to detect intent'
      logger.serverLog(message, `${TAG}: exports.index`, {}, {body: req.body}, 'error')
      sendErrorResponse(res, 500, `Failed to detect intent ${err}`)
    })
}
