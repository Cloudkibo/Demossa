// server.js
// where your node app starts

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

// init project
var express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const url = require('url');
const requestPromise = require('request-promise');
const ailayer = require('./ai-layer.js')
const util = require('./utility.js')
const platforms = require('./platforms.js')
const config = require('./config/environment/index')
const responseHelpers = require('./helpers/responses')

var httpsApp = express()
var httpApp = express()

mongoose.connect(config.mongo.uri, config.mongo.options)

const app = (config.env === 'production') ? httpsApp : httpApp

const seed = require('./scripts/seeds')

seed()

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
  response.send('<h1>Welcome to our demo chatbot.</h1>')
  // response.sendFile(__dirname + '/views/earningsRecord.html');
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

app.post('/dialogFlowWebhook', (request, response) => {
  console.log(request.body);
  if (request.body.queryResult.intent.displayName === '0.1.1.my.current.package.roman') {
    responseHelpers.currentPackageRoman(request, response)
  } else if (request.body.queryResult.intent.displayName === '0.1.2.my.current.package.english') {
    responseHelpers.currentPackageEnglish(request, response)
  } else if (request.body.queryResult.intent.displayName === '0.2.1.find.bundle.roman') {
    responseHelpers.findBundleInfoRoman(request, response)
  } else if (request.body.queryResult.intent.displayName === '0.0.2.welcome.sign.up.english') {
    responseHelpers.signUpTheCustomer(request, response)
  } else if (request.body.queryResult.intent.displayName === '0.0.1.welcome.sign.up.urdu') {
    responseHelpers.signUpTheCustomer(request, response)
  } else if (request.body.queryResult.intent.displayName === '0.0.3.welcome.sign.up.roman.urdu') {
    responseHelpers.signUpTheCustomer(request, response)
  } else if (request.body.queryResult.intent.displayName === '0.1.welcome.select.language') {
    responseHelpers.showServices(request, response)
  } else if (request.body.queryResult.intent.displayName === '0.3.check.complaint.status.english') {
    responseHelpers.checkComplaintStatus(request, response)
  } else if (request.body.queryResult.intent.displayName === '0.4.1.update.language.english') {
    responseHelpers.updateCustomerLanguage(request, response)
  } else if (request.body.queryResult.intent.displayName === '0.3.register.complaint') {
    responseHelpers.registerComplaint(request, response)
  }
})

function queryAIMessenger (query, subscriberId, pageId, simpleQueryNotPostBack, postBackType) {
  queryDialogFlow(query, pageId)
    .then(result => {
      util.intervalForEach(result, (item) => {
          platforms.sendMessengerChat(item, subscriberId, pageId)
        }, 600)
      // NOTE: This is logic in case when we have more than one paragraphs. Remove above util code when using this
      // if (simpleQueryNotPostBack) {
      //   if (result.length > 1) // if repsonse contains more than one paragraphs
      //     platforms.sendMessengerChat(result[0], subscriberId, pageId, query)
      //   else
      //     platforms.sendMessengerChat(result[0], subscriberId, pageId)
      // } else { // if query is coming from postback
      //   if (postBackType === 'see more') result.shift(); // only faqs reponses should hide the first paragraph
      //   util.intervalForEach(result, (item) => {
      //     platforms.sendMessengerChat(item, subscriberId, pageId)
      //   }, 500)
      // }
    })
    .catch(err => {
      console.log(err)
    })
}

function queryDialogFlow(query, pageId) {
  return ailayer.callDialogFlowAPIV2(query, pageId)
}

app.get('/fbPost', (request, response) => {
  console.log("FB verified the webhook request.")
  console.log(request.query)
  if (request.query['hub.verify_token'] === 'room40') {
    response.send(request.query['hub.challenge'])
  } else {
    response.send('Error, wrong token')
  }
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

if (config.env === 'production') {
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

if (config.env === 'production') {
  httpApp.get('*', (req, res) => {
    res.redirect(`${config.domain}${req.url}`)
  })
}

// listen for requests :)
server.listen(config.port, config.ip, () => {
  console.log(`DEMOSSA server STARTED on ${
    config.port} in ${config.env} mode on domain ${config.domain}`)
})

httpsServer.listen(config.secure_port, () => {
console.log(`DEMOSSA server STARTED on ${
  config.secure_port} in ${config.env} mode on domain ${config.domain}`)
})
