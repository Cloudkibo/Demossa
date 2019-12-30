const {
  isYouTubeUrl,
  randomItem,
  isUrl
} = require('./index.js')
const url = require('url')

exports.textMsgPayload = (item, recipientId, query) => {
  // handling youtube url in response
  if (isYouTubeUrl(item.text)) {
    const answersYt = ['Please watch this video', 'Watching this video will help']
    return buttonWebPayload(
      {
        text: randomItem(answersYt),
        btnText: 'Watch Video',
        url: item.text,
        webViewEnabled: false
      },
      recipientId
    )
  }
  // handling simple url in response
  if (isUrl(item.text)) {
    const answers = ['Visiting the following link would help you more', 'Please visit the given link to know more']
    let myURL = url.parse(item.text)
    // Note: website of ssa doesn't support embedding in web view, so sending our webview on all links
    // myURL = url.parse(process.env.DOMAIN + '/redirect?continue=' + item.text);
    myURL = url.parse(process.env.DOMAIN + '/show-webview')
    console.log(myURL.href)
    return buttonWebPayload(
      {
        text: randomItem(answers),
        btnText: 'Visit Website',
        url: myURL.href,
        webViewEnabled: true
      },
      recipientId
    )
  }
  if (query) {
    return simpleTextWithSeeMoreButton(item, recipientId, query)
  } else {
    return simpleTextPayload(item, recipientId)
  }
}

function simpleTextPayload (item, recipientId) {
  return {
    messaging_type: 'RESPONSE',
    recipient: {
      id: recipientId
    },
    message: {
      text: item.text
    }
  }
}

function simpleTextWithSeeMoreButton (item, recipientId, query) {
  const payload = {
    messaging_type: 'RESPONSE',
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: item.text,
          buttons: [
            {
              title: 'Read More',
              type: 'postback',
              payload: JSON.stringify({
                type: 'see more',
                query
              })
            }
          ]
        }
      }
    }
  }
  return payload
}

exports.imagePayload = (item, recipientId) => {
  return {
    messaging_type: 'RESPONSE',
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: 'image',
        payload: {
          url: item.url
        }
      }
    }
  }
}

// function imageWithQuickRepliesPayload (item, recipientId) {
//   let payload = {
//       "messaging_type": "RESPONSE",
//       "recipient":{
//         "id": recipient_id
//       },
//       "message":{
//         "text": "Please select a option",
//         "attachment":{
//           "type":"image",
//           "payload":{
//             "url": "http://cdn.cloudkibo.com/public/img/logo-SSA.png"
//           }
//         },
//         "quick_replies": []
//       }
//     };
//   for (let i=0; i<item.payload.replies.length; i++) {
//     payload.message.quick_replies.push({
//         "content_type":"text",
//         "title":item.payload.replies[i],
//         "payload":"{\"quickReplyTitle\": \""+ item.payload.title +"\", \"answer\": \""+ item.payload.replies[i] +"\"}",
//       });
//   }
//   return payload;
// }

// for uploading videos to facebook and attachment id
// function videoUploadToFb (item, recipient_id) {
//   let payload = {
//       "messaging_type": "RESPONSE",
//       "recipient":{
//         "id": recipient_id
//       },
//       "message":{
//         "attachment":{
//           "type":"video",
//           "payload":{
//             //"attachment_id": item.payload.payload.facebook.attachment.payload.attachment_id
//             "url": "http://cdn.cloudkibo.com/public/videos/appeals-end.mp4",
//             "is_reusable": true
//           }
//         }
//       }
//     };
//   return payload;
// }

exports.genericPayload = (item, recipientId) => {
  if (item.payload.facebook.attachment.payload.attachment_id) {
    return genericMediaVideoPayload(item, recipientId)
  } else if (item.payload.facebook.attachment.payload.external_link) {
    const btnText = item.payload.facebook.attachment.payload.btnTxt || 'Read More'
    const text = item.payload.facebook.attachment.payload.text || 'Please click on Read More to know more about this.'
    return buttonWebPayload(
      {
        text,
        btnText,
        url: item.payload.facebook.attachment.payload.external_link,
        webViewEnabled: false
      },
      recipientId
    )
  } else if (item.payload.facebook.attachment.payload.gallery) {
    return galleryPayload(item, recipientId)
  } else if (item.payload.facebook.attachment.payload.postback_buttons) {
    return postbackButtonsPayload(item, recipientId)
  } else if (item.payload.facebook.attachment.payload.generic_gallery) {
    return genericGalleryPayload(item, recipientId)
  } else if (item.payload.facebook.attachment.payload.list) {
    return listPayload(item, recipientId)
  } else if (item.payload.facebook.attachment.payload.method_of_change) {
    return methodOfChangePayload(item, recipientId)
  }
}

function postbackButtonsPayload (item, recipientId) {
  const buttons = item.payload.facebook.attachment.payload.postback_buttons
  const title = item.payload.facebook.attachment.payload.title
  const text = item.payload.facebook.attachment.payload.text
  const postbackButtons = []

  for (let i = 0; i < buttons.length; i++) {
    postbackButtons.push(
      {
        title: buttons[i],
        type: 'postback',
        payload: JSON.stringify({
          type: 'selected',
          title,
          answer: title + ' - ' + buttons[i]
        })
      }
    )
  }

  const payload = {
    messaging_type: 'RESPONSE',
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text,
          buttons: postbackButtons
        }
      }
    }
  }
  payload.message = JSON.stringify(payload.message)
  return payload
}

function methodOfChangePayload (item, recipientId) {
  const methods = item.payload.facebook.attachment.payload.method_of_change
  const buttons = []

  if (methods.online) {
    buttons.push(
      {
        type: 'web_url',
        url: process.env.DOMAIN + '/show-webview',
        title: 'Online',
        messenger_extensions: true,
        webview_height_ratio: 'tall'
      }
    )
  }
  if (methods.phone) {
    buttons.push(
      {
        title: 'Phone',
        type: 'postback',
        payload: JSON.stringify({
          type: 'selected',
          title: 'Phone',
          answer: 'Method of Change - Phone'
        })
      }
    )
  }
  if (methods.address) {
    buttons.push(
      {
        title: 'Address (Mail/Visit)',
        type: 'web_url',
        url: 'https://secure.ssa.gov/ICON/main.jsp',
        messenger_extensions: false,
        webview_height_ratio: 'tall'
      }
    )
  }

  const payload = {
    messaging_type: 'RESPONSE',
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: methods.text,
          buttons: buttons
        }
      }
    }
  }
  payload.message = JSON.stringify(payload.message)
  return payload
}

function genericMediaVideoPayload (item, recipientId) {
  const payload = {
    messaging_type: 'RESPONSE',
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'media',
          elements: [
            {
              media_type: 'video',
              attachment_id: item.payload.facebook.attachment.payload.attachment_id,
              buttons: [
                {
                  type: 'web_url',
                  url: item.payload.facebook.attachment.payload.url,
                  title: 'View Full Video'
                },
                {
                  type: 'web_url',
                  url: process.env.DOMAIN + '/show-webview',
                  title: 'Visit \'my Social Security\' Account',
                  messenger_extensions: true,
                  webview_height_ratio: 'tall'
                }
              ]
            }
          ]
        }
      }
    }
  }
  payload.message = JSON.stringify(payload.message)
  return payload
}

function buttonWebPayload (item, recipientId) {
  const payload = {
    messaging_type: 'RESPONSE',
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: item.text,
          buttons: [
            {
              type: 'web_url',
              url: item.url,
              title: item.btnText,
              messenger_extensions: item.webViewEnabled,
              webview_height_ratio: 'tall'
            }
          ]
        }
      }
    }
  }
  payload.message = JSON.stringify(payload.message)
  return payload
}

exports.quickRepliesPayload = (item, recipientId) => {
  const payload = {
    messaging_type: 'RESPONSE',
    recipient: {
      id: recipientId
    },
    message: {
      text: item.quickReplies.title,
      quick_replies: []
    }
  }
  for (let i = 0; i < item.quickReplies.quickReplies.length; i++) {
    payload.message.quick_replies.push({
      content_type: 'text',
      title: item.quickReplies.quickReplies[i],
      payload: JSON.stringify({
        quickReplyTitle: item.quickReplies.title,
        answer: item.quickReplies.quickReplies[i]
      })
    })
  }
  payload.message = JSON.stringify(payload.message)
  return payload
}

exports.cardPayload = (item, recipientId) => {
  const payload = {
    messaging_type: 'RESPONSE',
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title: item.payload.title,
              image_url: item.payload.imageUrl,
              subtitle: item.payload.subtitle,
              default_action: {
                type: 'web_url',
                url: process.env.DOMAIN + '/show-webview',
                messenger_extensions: true,
                webview_height_ratio: 'tall'
              },
              buttons: []
            }
          ]
        }
      }
    }
  }
  for (let i = 0; i < item.payload.buttons.length; i++) {
    payload.message.attachment.payload.elements[0].buttons.push({
      type: 'web_url',
      url: process.env.DOMAIN + '/show-webview',
      title: item.payload.buttons[i].text,
      messenger_extensions: true,
      webview_height_ratio: 'tall'
    })
  }
  return payload
}

function listPayload (item, recipientId) {
  const list = item.payload.facebook.attachment.payload.list
  const title = item.payload.facebook.attachment.payload.title ? item.payload.facebook.attachment.payload.title : 'Social Security Administration'
  const subtitle = item.payload.facebook.attachment.payload.subtitle ? item.payload.facebook.attachment.payload.subtitle : 'Select one of the benefits'
  const payload = {
    messaging_type: 'RESPONSE',
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'list',
          top_element_style: 'large',
          sharable: true,
          elements: [
            {
              title,
              subtitle,
              image_url: 'https://bipartisanpolicy.org/wp-content/uploads/2015/05/Social-Security-Administration.jpg'
            }
          ],
          buttons: []
        }
      }
    }
  }
  for (let i = 0; i < list.length; i++) {
    if (i === 3) break
    payload.message.attachment.payload.elements.push({
      title: list[i],
      image_url: 'http://cdn.cloudkibo.com/public/img/logo-SSA.png',
      subtitle: 'Please click on \'Select\' below to modify ' + list[i],
      buttons: [
        {
          title: 'Select',
          type: 'postback',
          payload: JSON.stringify({
            type: 'selected',
            title: list[i],
            answer: list[i]
          })
        }
      ]
    })
  }
  const newArray = list.slice(3)
  console.log(list.length)
  if (list.length > 3) {
    payload.message.attachment.payload.buttons.push({
      title: 'View More',
      type: 'postback',
      payload: JSON.stringify({
        type: 'list-more',
        title: 'list',
        options: newArray
      })
    })
  }
  payload.message = JSON.stringify(payload.message)
  return payload
}

function galleryPayload (item, recipientId) {
  const gallery = item.payload.facebook.attachment.payload.gallery
  const length = gallery.length > 10 ? 10 : gallery.length
  const galleryElements = []
  for (let i = 0; i < length; i++) {
    galleryElements.push(
      {
        title: gallery[i],
        image_url: 'http://cdn.cloudkibo.com/public/img/logo-SSA.png',
        subtitle: 'Please click on \'Select\' below to modify ' + gallery[i],
        buttons: [
          {
            title: 'Select',
            type: 'postback',
            payload: JSON.stringify({
              type: 'selected',
              title: 'gallery',
              answer: gallery[i]
            })
          }
        ]
      }
    )
  }
  const payload = {
    messaging_type: 'RESPONSE',
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: galleryElements
        }
      }
    }
  }
  payload.message = JSON.stringify(payload.message)
  return payload
}

function genericGalleryPayload (item, recipientId) {
  const gallery = item.payload.facebook.attachment.payload.generic_gallery
  const length = gallery.length > 10 ? 10 : gallery.length
  const galleryElements = []
  for (let i = 0; i < length; i++) {
    galleryElements.push(
      {
        title: gallery[i].title,
        image_url: gallery[i].image,
        subtitle: gallery[i].subtitle,
        buttons: gallery[i].button ? [
          {
            type: 'web_url',
            url: gallery[i].button.url,
            title: gallery[i].button.text,
            messenger_extensions: gallery[i].button.webViewEnabled ? gallery[i].button.webViewEnabled : false,
            webview_height_ratio: 'tall'
          }
        ] : []
      }
    )
  }
  const payload = {
    messaging_type: 'RESPONSE',
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: galleryElements
        }
      }
    }
  }
  payload.message = JSON.stringify(payload.message)
  return payload
}
