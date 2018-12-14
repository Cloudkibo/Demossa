const util = require('./utility.js')

exports.messengerSendApi = (query) => {
  let apiUrl = 'https://graph.facebook.com/v2.6/me/messages';
  let accessToken = 'Bearer a8966d1db63f47a2bc79a17757c5d357';
  let payload = {
    "contexts": [
    "shop"
    ],
    "lang": "en",
    "query": query,
    "sessionId": "12345",
    "timezone": "America/New_York"
  }
  
  return util.callApi(apiUrl, 'query?v=20170712', 'post', payload, accessToken)
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
            }
          } else if (respMsgs[i].type === 0) {
            finalMessages.push({ "type": "gen-text", "text": respMsgs[i].speech })
          }
        }
        resolve(finalMessages)
      } else {
        reject(result)
      }
    })
  })
}