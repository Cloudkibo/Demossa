const util = require('./utility.js')

exports.callDialogFlowAPI = (query, pageId) => {
  let apiUrl = 'https://api.dialogflow.com/v1/';
  let accessToken = 'Bearer ' + util.dialogFlowBotToken(pageId);
  let payload = {
    "contexts": [
    "shop"
    ],
    "lang": "en",
    "query": query,
    "sessionId": "12345",
    // "timezone": "America/New_York"
  }
  
  return util.callApi(apiUrl, 'query?v=20170712', 'post', payload, accessToken)
  .then(result => {
    console.log(result)
    return new Promise((resolve, reject) => {
      if (result.status.code === 200) {
        let respMsgs = result.result.fulfillment.messages;
        let finalMessages = []
        for (let i=0; i<respMsgs.length; i++ ) {
          if (respMsgs[i].platform === 'facebook') {
            switch (respMsgs[i].type) {
              case 0:
                finalMessages.push({ "type": "text", "text": respMsgs[i].speech })
                break;
              case 1:
                finalMessages.push({ "type": "card", "payload": respMsgs[i] })
                break;
              case 2:
                finalMessages.push({ "type": "quick-replies", "payload": respMsgs[i] })
                break;
              case 3:
                finalMessages.push({ "type": "image", "url": respMsgs[i].imageUrl })
                break;
              case 4:
                finalMessages.push({ "type": "payload", "payload": respMsgs[i] })
                break;
            }
          } else if (respMsgs[i].type === 0) {
            // only including messenger messages right now, commenting this out
            // finalMessages.push({ "type": "gen-text", "text": respMsgs[i].speech })
          }
        }
        console.log('--------------------------------')
        if(finalMessages.length === 0) resolve(result.result)
        else resolve(finalMessages)
      } else {
        reject(result)
      }
    })
  })
}

exports.callDialogFlowAPIV2 = (query, pageId) => {
  let apiUrl = 'https://dialogflow.googleapis.com/v2/projects/jazz-95b94/agent/sessions/12345:detectIntent';
  let accessToken = 'Bearer 544620e12a45790e22c97d2d53d48ed89135a88f'
  let payload = {
    "queryInput": {
      "lang": "en",
      "query": query,
    }
  }
  return util.callApi(apiUrl, '', 'post', payload, accessToken)
  .then(result => {
    return new Promise((resolve, reject) => {
      if (result.status.code === 200) {
        let respMsgs = result.result.fulfillment.messages;
        let finalMessages = []
        for (let i=0; i<respMsgs.length; i++ ) {
          if (respMsgs[i].platform === 'facebook') {
            switch (respMsgs[i].type) {
              case 0:
                finalMessages.push({ "type": "text", "text": respMsgs[i].speech })
                break;
              case 1:
                finalMessages.push({ "type": "card", "payload": respMsgs[i] })
                break;
              case 2:
                finalMessages.push({ "type": "quick-replies", "payload": respMsgs[i] })
                break;
              case 3:
                finalMessages.push({ "type": "image", "url": respMsgs[i].imageUrl })
                break;
              case 4:
                finalMessages.push({ "type": "payload", "payload": respMsgs[i] })
                break;
            }
          } else if (respMsgs[i].type === 0) {
            // only including messenger messages right now, commenting this out
            // finalMessages.push({ "type": "gen-text", "text": respMsgs[i].speech })
          }
        }
        resolve(finalMessages)
      } else {
        reject(result)
      }
    })
  })
}