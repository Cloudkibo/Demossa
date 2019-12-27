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
    const item = items[i]
    if (item.type === 'text' || item.type === 'gen-text') {
      payload.push(textMsgPayload(item, 'web recipient'))
    } else if (item.type === 'image') {
      payload.push(imagePayload(item, 'web recipient'))
    } else if (item.type === 'quick-replies') {
      payload.push(quickRepliesPayload(item, 'web recipient'))
    } else if (item.type === 'card') {
      payload.push(cardPayload(item, 'web recipient'))
    } else if (item.type === 'payload') {
      payload.push(genericPayload(item, 'web recipient'))
    }
  }
  if (payload) {
    response.status(200).json({ answer: payload })
  }
}
