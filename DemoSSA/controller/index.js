const { queryAIMessenger, callDialogFlowAPI } = require('../components/dialogflow.js')
const { sendMessengerChat } = require('../components/messenger.js')
const { sendWebChat } = require('../components/webClient.js')

exports.verifyToken = (request, response) => {
  console.log('FB verified the webhook request', request.query)
  if (request.query['hub.verify_token'] === 'jawaidekram') {
    response.send(request.query['hub.challenge'])
  } else {
    response.send('Error, wrong token')
  }
}

exports.handleMessengerClient = (request, response) => {
  console.log('incoming post from facebook')
  let body = {}
  if (request.fromKiboPush) {
    body = request
  } else {
    body = request.body
  }
  const message = body.entry[0].messaging[0]
  const pageId = message.recipient.id
  const subscriberId = message.sender.id
  if (message.message) {
    const query = message.message.text
    queryAIMessenger(query, subscriberId, pageId, true)
  } else if (message.postback) {
    const postback = JSON.parse(message.postback.payload)
    // let postbackTitle = message.postback.title
    console.log(postback)
    if (postback.type === 'selected') {
      let query = postback.answer
      if (postback.title === 'gallery') {
        query = query + ' gallery'
      }
      queryAIMessenger(query, subscriberId, pageId, false, postback.type)
    } else if (postback.type === 'see more') {
      queryAIMessenger(postback.query, subscriberId, pageId, false, postback.type)
    } else if (postback.type === 'more') {
      const options = postback.options
      if (options.length > 0) {
        const payload = {
          platform: 'FACEBOOK',
          quickReplies: {
            title: 'Please select from following',
            quickReplies: options
          }
        }
        sendMessengerChat(payload, subscriberId, pageId)
      }
    } else if (postback.type === 'list-more') {
      const options = postback.options
      if (options.length > 0) {
        const payload = {
          platform: 'FACEBOOK',
          payload: {
            facebook: {
              attachment: {
                type: '',
                payload: {
                  title: 'Disability Benefits',
                  subtitle: 'Please select from the following',
                  list: options
                }
              }
            }
          }
        }
        sendMessengerChat(payload, subscriberId, pageId)
      }
    }
  }
  return response.status(200).json({ status: 'success', description: 'got the data.' })
}

exports.handleWebClient = (request, response) => {
  console.log('incoming post from web client', request.body)
  const query = request.body.message.text
  if (query) {
    const dialogflowData = {
      queryInput: {
        text: {
          languageCode: 'en',
          text: query.length > 256 ? query.substring(0, 256) : query
        }
      }
    }
    callDialogFlowAPI(
      'https://dialogflow.googleapis.com/v2/projects/demossa-768c0/agent/sessions/webClient:detectIntent',
      'POST',
      dialogflowData
    )
      .then(result => {
        const data = result.data.queryResult.fulfillmentMessages.filter((m) => m.platform === 'FACEBOOK')
        sendWebChat(request, response, data)
      })
      .catch(err => {
        console.log(err)
      })
  } else {
    response.status(501).json({ status: 'error', description: 'Query not found' })
  }
}

