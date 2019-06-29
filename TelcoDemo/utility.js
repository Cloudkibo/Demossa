const requestPromise = require('request-promise')

exports.callApi = (apiUrl, endpoint, method, body, token) => {
  let headers
  if (token) {
    headers = {
      'content-type': 'application/json',
      'Authorization': token
    }
  } else {
    headers = {
      'content-type': 'application/json'
    }
  }

  let options = {
    method: method.toUpperCase(),
    uri: `${apiUrl}/${endpoint}`,
    headers: headers,
    body: body,
    json: true
  }
  // console.log('in callapi', JSON.stringify(body))
  return requestPromise(options).then(response => {
    return new Promise((resolve, reject) => {
      if (response) {
        resolve(response)
      } else {
        reject(response)
      }
    })
  })
}

// loop over the array using the iteratee function
// at the specified interval
exports.intervalForEach = (array, iteratee, delay) => {
  let current = 0

  let interval = setInterval(() => {
    if (current === array.length) {
      clearInterval(interval)
    } else {
      iteratee(array[current])
      current++
    }
  }, delay)
}

exports.isUrl = (str) => {
  let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/
  if (regexp.test(str)) {
    return true
  } else {
    return false
  }
}

exports.randomItem = (items) => {
  return items[Math.floor(Math.random()*items.length)]
}

exports.isYouTubeUrl = (url) => {
  var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  return (url.match(p)) ? RegExp.$1 : false;
}

exports.fbAccessToken = (pageId) => {
  return '?access_token=EAAUTvApDOEYBALRZBxLYJTJyVI05SfCf7UdWjejck2ikWllZCZA1k4hgxulBDGsixGZC2trUHdaUWKN5LmkbVdF215Hvejn14uJfbZCbtyEP46sdG31fAbka0LGjxZBHDiYG96dcqEy36EuVbVzqqcVQnHynteJ1GxZBQlqDZArctQZDZD'
}

exports.dialogFlowBotToken = (pageId) => {
  return 'f924e30f87604926a27fc3b50c4a3914'
}

exports.dialogFlowBotTokenV2 = (pageId) => {
  return '118160434535920668412-3c64ce2dcf98d44a72bbc1bb360f5079b92617ce'
}

exports.generateId = (count) => {
  var _sym = '123456789';
  var str = '';

  for(var i = 0; i < count; i++) {
      str += _sym[parseInt(Math.random() * (_sym.length))];
  }
  return str
}

exports.customerDb = {
  otps: [1234, 5678, 9123],
  customers: {
    '+923004132126': {
      current_package: 'J999',
      Usage: {
        Sms: 3948,
        Data: 3847732,
        Onnet: 400,
        Offnet: 397,
      }
    },
    '+923008769876' : {
      current_package: 'J999',
      Usage: {
        Sms: 3948,
        Data: 3847732,
        Onnet: 400,
        Offnet:397,
      }
    }

  }
}

exports.package_db = {
	J300:{
    onNet: '1000 Jazz + Warid Minutes',
    offNet: '150 Other Network Minutes',
    Internet: '500 MB',
    SMS: '150 SMS'
  },
	J600:{
    onNet: '2000 Jazz + Warid Minutes',
    offNet: '300 Other Network Minutes',
    Internet: '1000 MB',
    SMS: '300 SMS'
  },
  J999:{
    onNet: 'Unlimited Jazz + Warid Minutes',
    offNet: '500 Other Network Minutes',
    Internet: '2000 MB',
    SMS: '1000 SMS'
  },
  J1500:{
    onNet: 'Unlimited Jazz + Warid Minutes',
    offNet: '500 Other Network Minutes',
    Internet: '7000 MB',
    SMS: '7000 SMS'
  }
}
