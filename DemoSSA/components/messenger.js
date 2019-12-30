const config = require('../config/index.js')
const needle = require('needle')
const {
  textMsgPayload,
  imagePayload,
  quickRepliesPayload,
  cardPayload,
  genericPayload
} = require('../utils/prepareMessageData.js')

exports.sendMessengerChat = (item, recipientId, pageId, query) => {
  console.log(item)
  let payload
  if (item.text) {
    item.text = item.text.text[0]
    payload = textMsgPayload(item, recipientId, query)
  } else {
    payload = genericPayload(item, recipientId)
  }
  // else if (item.type === 'image') {
  //   payload = imagePayload(item, recipientId)
  // } else if (item.type === 'quick-replies') {
  //   payload = quickRepliesPayload(item, recipientId)
  // } else if (item.type === 'card') {
  //   payload = cardPayload(item, recipientId)
  // } else if (item.type === 'payload') {
  //   payload = genericPayload(item, recipientId)
  // }
  if (payload) {
    callFacebookApi('v4.0', `me/messages?access_token=${config.fbAccessToken[pageId]}`, 'post', payload)
      .then(result => {
        console.log('FB Message sent', JSON.stringify(result.body))
      })
      .catch(err => {
        console.log(err.message)
      })
  }
}

function callFacebookApi (version, path, method, data) {
  console.log(`calling https://graph.facebook.com/${version}/${path}`)
  return needle(
    method.toLowerCase(),
    `https://graph.facebook.com/${version}/${path}`,
    data
  )
}
