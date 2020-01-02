const config = require('../config/index.js')

exports.createButtons = (displayUrl) => {
  return {
    messages: [
      {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            image_aspect_ratio: 'square',
            elements: [{
              title: 'Welcome!',
              subtitle: 'Choose your preferences',
              buttons: [
                {
                  type: 'web_url',
                  url: displayUrl,
                  title: 'Webview (compact)',
                  messenger_extensions: true,
                  webview_height_ratio: 'compact' // Small view
                },
                {
                  type: 'web_url',
                  url: displayUrl,
                  title: 'Webview (tall)',
                  messenger_extensions: true,
                  webview_height_ratio: 'tall' // Medium view
                },
                {
                  type: 'web_url',
                  url: displayUrl,
                  title: 'Webview (full)',
                  messenger_extensions: true,
                  webview_height_ratio: 'full' // large view
                }
              ]
            }]
          }
        }
      }
    ]
  }
}

exports.isYouTubeUrl = (url) => {
  var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
  return (url.match(p)) ? RegExp.$1 : false
}

exports.intervalForEach = (array, iteratee, delay) => {
  let current = 0

  const interval = setInterval(() => {
    if (current === array.length) {
      clearInterval(interval)
    } else {
      iteratee(array[current])
      current++
    }
  }, delay)
}

exports.randomItem = (items) => {
  return items[Math.floor(Math.random() * items.length)]
}

exports.isUrl = (str) => {
  const regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/
  if (regexp.test(str)) {
    return true
  } else {
    return false
  }
}

exports.corsOptions = {
  origin: function (origin, callback) {
    if (config.corsDomains.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
