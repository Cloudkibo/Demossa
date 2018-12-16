const util = require('./utility.js')


exports.sendMessengerChat = (item, recipient_id) => {
  console.log(item)
  let payload
  if (item.type === 'text' || item.type === 'gen-text') {
    payload = textMsgPayload(item, recipient_id);
  }
  else if (item.type === 'image') {
    payload = imagePayload(item, recipient_id);
  } else if (item.type === 'quick-replies') {
    payload = quickRepliesPayload(item, recipient_id)
  }
  if (payload) {
    messengerSendApi (payload)
    .then(result => {
      console.log("FB Message sent")
    })
    .catch(err => {
      console.log(err.message)
    })
  }
}

function messengerSendApi (payload) {
  let apiUrl = 'https://graph.facebook.com/v2.6';
  let endpoint = 'me/messages?access_token=EAAEfZAUNcph4BAHhGy2lAjYHpZA0y1nrcUZAELNPosZA8cPxiEoEvUXZCp2zIHNwEyuVLSWsYV9XRCAuupnJighZC1ynYe2LoKjXrZCUpdY55SeZCCIYfdCgNPr4jeyumLG3HfLOLpUiOwS4m6Ml0f6TeEECDiNe9rj6YRisCZAKRWAZDZD';
  
  return util.callApi(apiUrl, endpoint, 'post', payload)
  .then(result => {
    return new Promise((resolve, reject) => {
      if (result.recipient_id) {
        resolve(result)
      } else {
        reject(result)
      }
    })
  })
}

function textMsgPayload (item, recipient_id) {
  return {
      "messaging_type": "RESPONSE",
      "recipient":{
        "id": recipient_id
      },
      "message":{
        "text": item.text
      }
    };
}

function imagePayload (item, recipient_id) {
  return {
      "messaging_type": "RESPONSE",
      "recipient":{
        "id": recipient_id
      },
      "message":{
        "attachment":{
          "type":"image", 
          "payload":{
            "url": item.url, 
            "is_reusable":true
          }
        }
      }
    };
}

function quickRepliesPayload (item, recipient_id) {
  let payload = {
      "messaging_type": "RESPONSE",
      "recipient":{
        "id": recipient_id
      },
      "message":{
        "text": item.payload.title,
        "quick_replies": []
      }
    }
  for (let i=0; i<item.payload.replies.length; i++) {
    payload.message.quick_replies.push({
        "content_type":"text",
        "title":item.payload.replies[i],
        "payload":"{quickReplyTitle: \""+ item.payload.title +"\", answer: \""+ item.payload.replies[i] +"\"}",
      });
  }
  return payload;
}

function cardPayload (item, recipient_id) {
  let payload = {
      "messaging_type": "RESPONSE",
      "recipient":{
        "id": recipient_id
      },
      "message":{
        "text": item.payload.title,
        "quick_replies": []
      }
    }
  // for (let i=0; i<item.payload.replies.length; i++) {
  //   payload.message.quick_replies.push({
  //       "content_type":"text",
  //       "title":item.payload.replies[i],
  //       "payload":"{quickReplyTitle: \""+ item.payload.title +"\", answer: \""+ item.payload.replies[i] +"\"}",
  //     });
  // }
  return payload;
}

cardPayload({ type: 'card',

  payload: 

   { type: 1,

     platform: 'facebook',

     title: 'First Card',

     subtitle: 'My card is very good',

     imageUrl: 'http://www.bhaviksarkhedi.com/wp-content/uploads/2017/01/digital-marketing.jpg',

     buttons: [ [Object] ] } }, '23432432432')