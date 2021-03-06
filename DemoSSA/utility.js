const requestPromise = require('request-promise')

exports.callApi = (apiUrl, endpoint, method = 'get', body, token) => {
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
    headers,
    body,
    json: true
  }
  // console.log('in callapi', JSON.stringify(body))
  return requestPromise(options).then(response => {
    return new Promise((resolve, reject) => {
      console.log(response)
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
  return items[Math.floor(Math.random() * items.length)]
}

exports.isYouTubeUrl = (url) => {
  var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  return (url.match(p)) ? RegExp.$1 : false;
}

exports.fbAccessToken = (pageId) => {
  if (pageId === '382154169188869') {
    return '?access_token=EAAUTvApDOEYBAHXldCT12Scr89oRZAsfaz4folqdZCcW4oP1Vt3XIYf2vTwqSZBoYvZB8U0I6GeIazHwP8FaYPWdnnJaR9HfaJWWSY4cymOHCjAMELxhWpZAS9b20texHkPsBjfuzoVmVRMLoCWWL8rreMW4JktrQtmmo33EAYe50ZACgIRLkZB9xk0P7Qj38EZD'
  } else if (pageId === '350372502408394') {
    return '?access_token=EAAUTvApDOEYBAACp48icVb1C8jxmAK2Fc6dJOjQupo4QMnB3oXY3SqrXmZA2cHF3It4V9aB81DsZA3vRqbOHGHGzw58I32ZB6gZBqVCPSVYrN67CUOM16ukBCubo5Vlhnzjj9VCV7ZAzRIZBQwKsGHTXzZCrOV3KzW8LmTo35gA8nLXwToubghJXm9GUqNAphIZD'
  }
  return '?access_token=EAAUTvApDOEYBAJUKwDiMnWAib6RkKH4MrLqQew8GE34Jdx5C1MhoRX8WcdBQP6yFXw5T04Cf4eZAyImi3xIXOqB8sZAXEszgtEHKbFHWSIpFlZCGR5FEY7iectIjaKeYAWA6XZAmBH7ZC8dxis7FgJCt3PImRDJQ2avTfZB1n4KQZDZD'
}

exports.dialogFlowBotToken = (pageId) => {
  if (pageId === '382154169188869') {
    return 'a8966d1db63f47a2bc79a17757c5d357'
  } else if (pageId === '350372502408394') {
    return 'ac41031fea0c4d3dad647495b9657453'
  }
  return 'a8966d1db63f47a2bc79a17757c5d357'
}

// demossa1 382154169188869
// demossa2 350372502408394
