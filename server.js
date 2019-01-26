// server.js
// where your node app starts

// init project
var express = require('express');
const bodyParser = require('body-parser');
const url = require('url');
const requestPromise = require('request-promise');
const ailayer = require('./ai-layer.js')
const util = require('./utility.js')
const platforms = require('./platforms.js')
const config = require('./config.js')

var httpsApp = express();
var httpApp = express()

const app = (process.env.NODE_ENV === 'production') ? httpsApp : httpApp

// Setup template engine - add pug
app.set('view engine', 'pug');

// Tell Express where our templates are
app.set('views', './views');


// Parse data from application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/earningsRecord.html');
});

const createButtons = (displayUrl) => {
  return {
    messages:[
      {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            image_aspect_ratio: 'square',
            elements: [{
              title: 'Welcome!',
              subtitle: 'Choose your preferences',
              buttons:[
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
  ]};
};


app.get('/show-buttons', (request, response) => {
  const {userId} = request.query;
  const displayUrl = process.env.DOMAIN + '/show-webview';
  response.json(createButtons(displayUrl));
});

app.get('/show-webview', (request, response) => {
  response.sendFile(__dirname + '/views/webview.html');
});

app.get('/login', (request, response) => {
  response.sendFile(__dirname + '/views/login.html');
});

app.get('/verify-phone', (request, response) => {
  response.sendFile(__dirname + '/views/verify-phone.html');
});

app.get('/verify-code', (request, response) => {
  response.sendFile(__dirname + '/views/verify-code.html');
});

app.get('/terms', (request, response) => {
  response.sendFile(__dirname + '/views/terms.html');
});

app.get('/dashboard', (request, response) => {
  response.sendFile(__dirname + '/views/dashboard.html');
});

app.get('/benefitsAndPayments', (request, response) => {
  response.sendFile(__dirname + '/views/benefitsAndPayments.html');
});

app.get('/estimatedBenefits', (request, response) => {
  response.sendFile(__dirname + '/views/estimatedBenefits.html');
});

app.get('/earningsRecord', (request, response) => {
  response.sendFile(__dirname + '/views/earningsRecord.html');
});

app.get('/myProfile', (request, response) => {
  response.sendFile(__dirname + '/views/myProfile.html');
});

app.get('/securitySettings', (request, response) => {
  response.sendFile(__dirname + '/views/securitySettings.html');
});

app.get('/updateContactInformation', (request, response) => {
  response.sendFile(__dirname + '/views/updateContactInformation.html');
});

app.get('/newfile', (request, response) => {
  response.sendFile(__dirname + '/views/newfile.html');
});

app.post('/fbPost', (request, response) => {
  console.log('incoming post from facebook');
  let message = request.body.entry[0].messaging[0];
  let pageId = message.recipient.id
  let subscriberId = message.sender.id
  if (message.message) {
    let query = message.message.text
    queryAIMessenger(query, subscriberId, pageId, true);
  } else if (message.postback) {
    let postback = JSON.parse(message.postback.payload)
    let postbackTitle = message.postback.title
    console.log(postback)
    if (postback.type === 'selected') {
      queryAIMessenger(postback.answer, subscriberId, pageId, false, postback.type)
    } else if (postback.type === 'see more') {
      queryAIMessenger(postback.query, subscriberId, pageId, false, postback.type)
    } else if (postback.type === 'more') {
      let options = postback.options;
      if (options !== '') {
        let items = options.split(',')
        let payload = {
          "type" : "quick-replies",
          "payload" : {
            "title": "Please select from following",
            "replies": items
          }
        }
        platforms.sendMessengerChat(payload, subscriberId, pageId)
      }
    }
  }
  return response.status(200).json({ status: 'success', description: 'got the data.' });
});

app.post('/webPost', (request, response) => {
  console.log('incoming post from web client');
  console.log(request.body)
  let query = request.body.message.text
  if (query) {
    queryDialogFlow(query)
    .then(result => {
      platforms.sendWebChat(request, response, result)
    })
    .catch(err => {
      console.log(err)
    })
  } else {
    response.status(501).json({ status: 'error', description: 'Query not found' });
  }
});

function queryAIMessenger (query, subscriberId, pageId, simpleQueryNotPostBack, postBackType) {
  queryDialogFlow(query, pageId)
    .then(result => {
      if (simpleQueryNotPostBack) {
        if (result.length > 1 && config.viewMorePageIds.indexOf(pageId) > -1) // if repsonse contains more than one paragraphs
          platforms.sendMessengerChat(result[0], subscriberId, pageId, query)
        else
          platforms.sendMessengerChat(result[0], subscriberId, pageId)
      } else { // if query is coming from postback
        if (postBackType === 'see more') result.shift(); // only faqs reponses should hide the first paragraph
        util.intervalForEach(result, (item) => {
          platforms.sendMessengerChat(item, subscriberId, pageId)
        }, 500)
      }
    })
    .catch(err => {
      console.log(err)
    })
}

// EXAMPLE 1994777573950560
// queryDialogFlow("Can you send me the tutorial on end of a claim")
//     .then(result => {
//       util.intervalForEach(result, (item) => {
//         platforms.sendMessengerChat(item, '1994777573950560')
//       }, 1000)
//     })
//     .catch(err => {
//       console.log(err)
//     })

function queryDialogFlow(query, pageId) {
  return ailayer.callDialogFlowAPI(query, pageId)
}

app.get('/fbPost', (request, response) => {
  console.log("FB verified the webhook request.")
  console.log(request.query)
  if (request.query['hub.verify_token'] === 'jawaidekram') {
    response.send(request.query['hub.challenge'])
  } else {
    response.send('Error, wrong token')
  }
})

app.get('/redirect', (request, response) => {
  console.log(request.query)
  response.redirect(request.query.continue)
  //response.send('This page is not yet implemented in our demo.')
})

app.get('/*', (request, response) => {
  response.send('This page is not yet implemented in our demo.')
})

const http = require('http')
const https = require('https')
const fs = require('fs')

let options = {
    ca: '',
    key: '',
    cert: ''
  }

  if (process.env.NODE_ENV === 'production') {
    try {
      options = {
        ca: fs.readFileSync('/root/certs/ca_bundle.crt'),
        key: fs.readFileSync('/root/certs/private.key'),
        cert: fs.readFileSync('/root/certs/certificate.crt')
      }
    } catch (e) {

    }
  }

const server = http.createServer(httpApp)
const httpsServer = https.createServer(options, httpsApp)

  if (process.env.NODE_ENV === 'production') {
    httpApp.get('*', (req, res) => {
      res.redirect(`${process.env.DOMAIN}${req.url}`)
    })
  }

// listen for requests :)
server.listen(process.env.PORT, process.env.IP, () => {
    console.log(`DEMOSSA server STARTED on ${
      process.env.PORT} in ${process.env.NODE_ENV} mode on domain ${process.env.DOMAIN}`)
  })

httpsServer.listen(process.env.SECURE_PORT, () => {
  console.log(`DEMOSSA server STARTED on ${
    process.env.SECURE_PORT} in ${process.env.NODE_ENV} mode on domain ${process.env.DOMAIN}`)
})
