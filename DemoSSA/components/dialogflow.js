const config = require('../config/index.js')
const { sendMessengerChat } = require('./messenger.js')
const { intervalForEach } = require('../utils/index.js')
const { JWT } = require('google-auth-library')

exports.queryAIMessenger = (query, subscriberId, pageId, simpleQueryNotPostBack, postBackType) => {
  const dialogflowData = {
    queryInput: {
      text: {
        languageCode: 'en',
        text: query.length > 256 ? query.substring(0, 256) : query
      }
    }
  }
  callDialogFlowAPI(
    `https://dialogflow.googleapis.com/v2/projects/${config.gcpPojectId[pageId]}/agent/sessions/${subscriberId}:detectIntent`,
    'POST',
    dialogflowData
  )
    .then(result => {
      console.log('response from dialogflow', JSON.stringify(result))
      if (simpleQueryNotPostBack) {
        if (result.length > 1 && config.viewMorePageIds.indexOf(pageId) > -1) { // if repsonse contains more than one paragraphs
          sendMessengerChat(result[0], subscriberId, pageId, query)
        } else {
          intervalForEach(result, (item) => {
            sendMessengerChat(item, subscriberId, pageId)
          }, 500)
        }
      } else { // if query is coming from postback
        if (postBackType === 'see more') result.shift() // only faqs reponses should hide the first paragraph
        intervalForEach(result, (item) => {
          sendMessengerChat(item, subscriberId, pageId)
        }, 500)
      }
    })
    .catch(err => {
      console.log(err)
    })
}

async function callDialogFlowAPI (url, method = 'GET', data) {
  const keys = require(config.GCP_CREDENTIALS_FILE)
  const client = new JWT({
    email: keys.client_email,
    key: keys.private_key,
    scopes: ['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/dialogflow']
  })
  const res = await client.request({
    url,
    method,
    data: JSON.stringify(data)
  })
  return res
}

exports.callDialogFlowAPI = callDialogFlowAPI
