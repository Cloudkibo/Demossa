const {
  textMsgPayload,
  imagePayload,
  quickRepliesPayload,
  cardPayload,
  genericPayload
} = require('../utils/prepareMessageData.js')

exports.sendWebChat = (request, response, items) => {
  console.log(items)
  const payload = []
  for (let i = 0; i < items.length; i++) {
    if (items[i].text) {
      items[i].text = items[i].text.text[0]
      payload.push(textMsgPayload(items[i], 'web recipient'))
    } else if (items[i].quickReplies) {
      payload.push(quickRepliesPayload(items[i], 'web recipient'))
    } else {
      payload.push(genericPayload(items[i], 'web recipient'))
    }
  }
  if (payload) {
    console.log('sending payload ', payload)
    response.status(200).json({ answer: payload })
  }
}
