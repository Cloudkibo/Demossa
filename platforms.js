const util = require('./utility.js')
const url = require('url');

exports.sendWebChat = (request, response, items) => {
  console.log(items)
  let payload = []
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    if (item.type === 'text' || item.type === 'gen-text') {
      payload.push(textMsgPayload(item, 'web recipient'));
    }
    else if (item.type === 'image') {
      payload.push(imagePayload(item, 'web recipient'));
    } else if (item.type === 'quick-replies') {
      payload.push(quickRepliesPayload(item, 'web recipient'));
    } else if (item.type === 'card') {
      payload.push(cardPayload(item, 'web recipient'));
    } else if (item.type === 'payload') {
      // payload = genericPayload(item, recipient_id)
      payload.push(genericMediaVideoPayload(item, 'web recipient'))
    }
  }
  if (payload) {
    response.status(200).json({answer: payload})
  }
}

exports.sendMessengerChat = (item, recipient_id, product_name) => {
  console.log(item)
  let payload
  if (item.type === 'text' || item.type === 'gen-text') {
    payload = textMsgPayload(item, recipient_id);
  }
  else if (item.type === 'image') {
    payload = imagePayload(item, recipient_id);
  } else if (item.type === 'quick-replies') {
    payload = listPayload(item, recipient_id);
    // payload = quickRepliesPayload(item, recipient_id);
  } else if (item.type === 'card') {
    payload = cardPayload(item, recipient_id);
  } else if (item.type === 'payload') {
    // payload = genericPayload(item, recipient_id)
    payload = genericMediaVideoPayload(item, recipient_id)
  }
  if (payload) {
    messengerSendApi (payload, product_name)
    .then(result => {
      console.log("FB Message sent")
    })
    .catch(err => {
      console.log(err.message)
    })
  }
}

function messengerSendApi (payload, product_name) {
  let apiUrl = 'https://graph.facebook.com/v2.6';
  let endpoint = 'me/messages' + util.fbAccessToken(product_name);
  
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
  // handling youtube url in response
  if (util.isYouTubeUrl(item.text)) {
    let answersYt = ["Please watch this video",
                  "Watching this video will help"]
    return buttonWebPayload({
      "text": util.randomItem(answersYt),
      "btnText": "Watch Video",
      "url": item.text,
      "webViewEnabled": false
    }, recipient_id)
  }
  // handling simple url in response
  if (util.isUrl(item.text)) {
    let answers = ["Visiting the following link would help you more",
                  "Please visit the given link to know more"]
    let myURL = url.parse(item.text);
    myURL = url.parse('https://boiling-push.glitch.me/redirect?continue=' + item.text);
    console.log(myURL.href)
    return buttonWebPayload({
      "text": util.randomItem(answers),
      "btnText": "Visit Website",
      "url": myURL.href,
      "webViewEnabled": true
    }, recipient_id)
  }
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

// for uploading videos to facebook and attachment id
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
            "url": "http://cdn.cloudkibo.com/public/videos/appeals-end.mp4",
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
                    "title":"SSA Dashboard",
                    "messenger_extensions": true,
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
            "text": item.text,
            "buttons":[
              {
                "type":"web_url",
                "url": item.url,
                "title": item.btnText,
                "messenger_extensions": item.webViewEnabled,
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
        "payload":"{\"quickReplyTitle\": \""+ item.payload.title +"\", \"answer\": \""+ item.payload.replies[i] +"\"}",
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

function listPayload (item, recipient_id) {
  let payload = {
      "messaging_type": "RESPONSE",
      "recipient":{
        "id": recipient_id
      },
      "message":{
        "attachment":{
          "type":"template", 
          "payload": {
            "template_type":"list",
            "top_element_style": "compact",
            "sharable": true,
            "elements":[],
            "buttons": [
              {
                "title": "View More",
                "type": "postback",
                "payload": "{\"type\": \"more\", \"title\": \""+ item.payload.title +"\", \"options\": \""+ item.payload.replies +"\"}"            
              }
            ]
          }
        }
      }
    };
  for (let i=0; i<item.payload.replies.length; i++) {
    if (i === 3) break;
    payload.message.attachment.payload.elements.push({
      "title": item.payload.replies[i],
      "image_url": "http://www.balinlaw.com/wp-content/uploads/2016/03/social-security-administration-logo.png",
      "buttons": [
        {
          "title": "Select",
          "type": "postback",
          "payload": "{\"type\": \"selected\", \"title\": \""+ item.payload.title +"\", \"answer\": \""+ item.payload.replies[i] +"\"}" 
        }
      ]
    });
  }
  return payload;
}