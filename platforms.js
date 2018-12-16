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
    payload = quickRepliesPayload(item, recipient_id);
  } else if (item.type === 'card') {
    payload = cardPayload(item, recipient_id);
  } else if (item.type === 'payload') {
    // payload = genericPayload(item, recipient_id)
    payload = genericMediaVideoPayload(item, recipient_id)
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
            //"is_reusable":true
          }
        }
      }
    };
}

function genericPayload (item, recipient_id) {
  let payload = {
      "messaging_type": "RESPONSE",
      "recipient":{
        "id": recipient_id
      },
      "message":{
        "attachment":{
          "type":"video", 
          "payload":{
            //"attachment_id": item.payload.payload.facebook.attachment.payload.attachment_id
            "url": "http://cdn.cloudkibo.com/public/videos/disability-claim.mp4",
            "is_reusable": true
          }
        }
      }
    };
  return payload;
}

function genericMediaVideoPayload (item, recipient_id) {
  let payload = {
      "messaging_type": "RESPONSE",
      "recipient":{
        "id": recipient_id
      },
      "message":{
        "attachment":{
          "type":"template", 
          "payload":{
            "template_type":"media",
            "elements":[
              {
                "media_type": "video",
                "attachment_id": item.payload.payload.facebook.attachment.payload.attachment_id,
                "buttons": [
                  {
                    "type": "web_url",
                    "url": item.payload.payload.facebook.attachment.payload.url,
                    "title": "View Full Video",
                  },
                  {
                    "type":"web_url",
                    "url":"https://boiling-push.glitch.me/show-webview",
                    "title":"Open Video",
                    "messenger_extensions": false,
                    "webview_height_ratio": "tall"
                  }
                ]
              }
            ]
          }
        }
      }
    };
  return payload;
}

function buttonWebPayload (item, recipient_id) {
  let payload = {
      "messaging_type": "RESPONSE",
      "recipient":{
        "id": recipient_id
      },
      "message":{
        "attachment":{
          "type":"template",
          "payload":{
            "template_type":"button",
            "text":"Please see this video",
            "buttons":[
              {
                "type":"web_url",
                "url":"https://boiling-push.glitch.me/show-webview",
                "title":"Open Video",
                "messenger_extensions": false,
                "webview_height_ratio": "tall"
              }
            ]
          }
        }
      }
    };
  return payload;
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
        "attachment":{
          "type":"template", 
          "payload": {
            "template_type":"generic",
            "elements":[
              {
                "title":item.payload.title,
                "image_url":item.payload.imageUrl,
                "subtitle":item.payload.subtitle,
                "default_action": {
                  "type": "web_url",
                  "url": "https://boiling-push.glitch.me/show-webview",
                  "messenger_extensions": true,
                  "webview_height_ratio": "tall"
                },
                "buttons":[]      
              }
            ]
          }
        }
      }
    };
  for (let i=0; i<item.payload.buttons.length; i++) {
    payload.message.attachment.payload.elements[0].buttons.push({
                "type":"web_url",
                "url":item.payload.buttons[i].postback,
                "title":item.payload.buttons[i].text
              });
  }
  return payload;
}