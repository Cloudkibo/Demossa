const config = require('./../../config/index')
const { dialogFlowApiCaller } = require('./../../global/dialogFlow/index')
const { sendSuccessResponse, sendErrorResponse } = require('./../../global/response')
const { getProjectId, preparePayload } = require('./chatbot.logiclayer')
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
    getProjectId(req.body.vertical),
    `agent/sessions/${req.body.subscriberId}:detectIntent`,
    'post', data)
    .then(result => {
      if (result.data && result.data.responseId && result.data.queryResult.fulfillmentMessages.length > 0) {
        let payload = preparePayload(result.data.queryResult.fulfillmentMessages, result.data.queryResult.intent)
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
