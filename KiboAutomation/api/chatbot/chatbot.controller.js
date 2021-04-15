const { dialogFlowApiCaller } = require('./../../global/dialogFlow/index')
const { sendSuccessResponse, sendErrorResponse } = require('./../../global/response')
const { getProjectId, preparePayload, prepareQuery } = require('./chatbot.logiclayer')
const TAG = 'api/intents/intents.controller.js'
const logger = require('./../../global/logger')

exports.index = async function (req, res) {
  try {
    const query = await prepareQuery(req.body.type, req.body.userInput)
    dialogFlowApiCaller(
      getProjectId(req.body.vertical),
      `agent/sessions/${req.body.subscriberId}:detectIntent`,
      'post',
      query)
      .then(result => {
        if (result.data && result.data.responseId && result.data.queryResult.fulfillmentMessages.length > 0) {
          let payload = preparePayload(
            result.data.queryResult.fulfillmentMessages,
            result.data.queryResult.intent,
            result.data.queryResult.intentDetectionConfidence
          )
          sendSuccessResponse(res, 200, payload)
        } else {
          sendSuccessResponse(res, 200, {
            responseType: 'fallback',
            text: 'Sorry, I did not understand.'
          })
        }
      })
      .catch((err) => {
        const message = err || 'Failed to detect intent'
        logger.serverLog(message, `${TAG}: exports.index`, {}, {body: req.body}, 'error')
        sendErrorResponse(res, 500, `Failed to detect intent ${err}`)
      })
  } catch (err) {
    const message = err || 'Failed to detect intent'
    logger.serverLog(message, `${TAG}: exports.index`, {}, {body: req.body}, 'error')
    sendErrorResponse(res, 500, `Failed to detect intent ${err}`)
  }
}
