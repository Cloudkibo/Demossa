const util = require('./utility.js')


exports.sendMessengerChat = (item, recipient_id) => {
  let payload
  if (item.type === 'text') {
    payload = {
      "messaging_type": "RESPONSE",
      "recipient":{
        "id": recipient_id
      },
      "message":{
        "text": item.text
      }
    }
  }
  console.log(payload)
  if (payload) {
    messengerSendApi (payload)
  }
}

function messengerSendApi (payload) {
  let apiUrl = 'https://graph.facebook.com/v2.6';
  let endpoint = 'me/messages?access_token=EAAEfZAUNcph4BAHhGy2lAjYHpZA0y1nrcUZAELNPosZA8cPxiEoEvUXZCp2zIHNwEyuVLSWsYV9XRCAuupnJighZC1ynYe2LoKjXrZCUpdY55SeZCCIYfdCgNPr4jeyumLG3HfLOLpUiOwS4m6Ml0f6TeEECDiNe9rj6YRisCZAKRWAZDZD';
  
  return util.callApi(apiUrl, endpoint, 'post', payload)
  .then(result => {
    return new Promise((resolve, reject) => {
      if (result.status.code === 200) {
        resolve(result)
      } else {
        reject(result)
      }
    })
  })
}