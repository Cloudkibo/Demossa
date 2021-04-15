const config = require('./../../config/index')
const axios = require('axios')
const fs = require('fs')
const path = require('path')

exports.getProjectId = function (vertical) {
  switch (vertical) {
    case 'commerce':
      return config.ECOMMERCE_PROJECT_ID
    case 'airlines':
      return config.AIRLINES_PROJECT_ID
    default:
      return ''
  }
}
exports.preparePayload = function (fulfillmentMessages, intent, confidence) {
  let payload = {}
  if (confidence >= 0.8) {
    payload = {
      responseType: intent.isFallback ? 'fallback' : 'matched'
    }
    fulfillmentMessages.forEach(fulfillmentMessage => {
      if (fulfillmentMessage.payload) {
        payload.options = fulfillmentMessage.payload.options
        payload.API = fulfillmentMessage.payload.API
        payload.otherOptions = fulfillmentMessage.payload.otherOptions
        payload.event = fulfillmentMessage.payload.event
        payload.openEndedResponse = fulfillmentMessage.payload.openEndedResponse
        payload.showCard = fulfillmentMessage.payload.showCard
      }
      if (fulfillmentMessage.text) {
        payload.text = fulfillmentMessage.text.text[0]
      }
    })
  } else {
    payload = {
      responseType: 'fallback',
      text: 'Sorry, I did not understand.'
    }
  }
  return payload
}
exports.prepareQuery = async function (type, userInput) {
  let query = {
    queryInput: {}
  }
  if (type === 'audio') {
    const inputAudio = await getAudio(userInput)
    query.inputAudio = inputAudio
    query.queryInput = {
      audioConfig: {
        languageCode: 'en-US',
        audioEncoding: 'AUDIO_ENCODING_OGG_OPUS',
        sampleRateHertz: 16000
      }
    }
  } else if (type === 'text') {
    query.queryInput.text = {
      text: userInput,
      languageCode: 'en-US'
    }
  } else {
    query.queryInput.event = {
      name: userInput,
      languageCode: 'en-US'
    }
  }
  return query
}

const getAudio = async (userInput) => {
  return new Promise(async (resolve, reject) => {
    const response = await axios({
      method: 'GET',
      url: userInput,
      responseType: 'stream'
    })
    let stream = response.data.pipe(fs.createWriteStream(path.join(__dirname, '/file.ogg')))
    stream.on('finish', () => {
      const inputAudio = fs.readFileSync(path.join(__dirname, '/file.ogg')).toString('base64')
      fs.unlink(path.join(__dirname, '/file.ogg'), function (err) {
        if (err) {
          reject(err)
        } else {
          resolve(inputAudio)
        }
      })
    })
  })
}
