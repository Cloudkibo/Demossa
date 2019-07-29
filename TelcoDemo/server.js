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

// seed()

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

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.send('<h1>Welcome to our demo chatbot.</h1>')
  // response.sendFile(__dirname + '/views/earningsRecord.html');
});


app.get('/fbPost', (req, res) => {
  console.log("FB verified the webhook request.")
  if (req.query['hub.verify_token'] === 'VERIFY_ME') {
    res.send(req.query['hub.challenge'])
  } else {
    res.send('Error, wrong token')
  }
})

app.post('/fbPost', (request, response) => {
  console.log('incoming post from facebook');
  let message = request.body.entry[0].messaging[0];
  let pageId = message.recipient.id
  let subscriberId = message.sender.id
  if (message.message) {
    let query = message.message.text
    queryAIMessenger(query, subscriberId, pageId, false);
  }
  // } else if (message.postback) {
  //   let postback = JSON.parse(message.postback.payload)
  //   let postbackTitle = message.postback.title
  //   console.log(postback)
  //   if (postback.type === 'selected') {
  //     queryAIMessenger(postback.answer, subscriberId, pageId, false, postback.type)
  //   } else if (postback.type === 'see more') {
  //     queryAIMessenger(postback.query, subscriberId, pageId, false, postback.type)
  //   } else if (postback.type === 'more') {
  //     let options = postback.options;
  //     if (options !== '') {
  //       let items = options.split(',')
  //       let payload = {
  //         "type" : "quick-replies",
  //         "payload" : {
  //           "title": "Please select from following",
  //           "replies": items
  //         }
  //       }
  //       platforms.sendMessengerChat(payload, subscriberId, pageId)
  //     }
  //   }
  // }
  return response.status(200).json({ status: 'success', description: 'got the data.' });
});

function queryAIMessenger(query, subscriberId, pageId, simpleQueryNotPostBack, postBackType) {
  queryDialogFlow(query, pageId)
    .then(result => {
      console.log(result)
      if (result.fulfillment) {
        if (result.fulfillment.messages.length === 0 || result.fulfillment.messages[0].speech === '') {
          DialogFlowFunctions(result, subscriberId)
            .then(response => {
              util.intervalForEach(response, (item) => {
                platforms.sendMessengerChat(item, subscriberId, pageId)
              }, 600)
            })
        }
      } else {
        util.intervalForEach(result, (item) => {
          platforms.sendMessengerChat(item, subscriberId, pageId)
        }, 600)
      }
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
  return ailayer.callDialogFlowAPI(query, pageId)
}

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

function DialogFlowFunctions(result, subscriberId) {
  return new Promise(function (resolve, reject) {
    if (result.metadata.intentName === '0.1.welcome.select.language') {
      resolve(responseHelpers.showServices(result, subscriberId))
    } else if (result.metadata.intentName === '0.0.1.welcome.sign.up.urdu') {
      responseHelpers.signUpTheCustomer(result, subscriberId)
      .then(response => {
        resolve(response)
      })
    } else if (result.metadata.intentName === '0.0.2.welcome.sign.up.english') {
      responseHelpers.signUpTheCustomer(result, subscriberId)
        .then(response => {
          resolve(response)
        })
    } else if (result.metadata.intentName === '0.0.3.welcome.sign.up.roman.urdu') {
      responseHelpers.signUpTheCustomer(result, subscriberId)
      .then(response => {
        resolve(response)
      })
    } else if (result.metadata.intentName === '0.1.1.my.current.package.roman') {
      responseHelpers.currentPackage(result, subscriberId)
      .then(response => {
        resolve(response)
      })
    } else if (result.metadata.intentName === '0.1.2.my.current.package.english') {
      responseHelpers.currentPackage(result, subscriberId)
      .then(response => {
        resolve(response)
      })
    } else if (result.metadata.intentName === '0.1.3.my.current.package.urdu') {
      responseHelpers.currentPackage(result, subscriberId)
      .then(response => {
        resolve(response)
      })
    } else if (result.metadata.intentName === '0.2.1.find.and.activate.bundle.roman') {
      responseHelpers.findBundles(result, subscriberId)
      .then(response => {
        resolve(response)
      })
    } else if (result.metadata.intentName === '0.2.1.find.bundle.roman') {
      responseHelpers.findBundleInfo(result, subscriberId)
      .then(response => {
        resolve(response)
      })
    } else if (result.metadata.intentName === '0.2.1.activate.bundle.roman') {
      responseHelpers.activateBundle(result, subscriberId)
      .then(response => {
        resolve(response)
      })
    } else if (result.metadata.intentName === '0.2.2.find.and.activate.bundle.english') {
      responseHelpers.findBundles(result, subscriberId)
      .then(response => {
        resolve(response)
      })
    } else if (result.metadata.intentName === '0.2.2.find.bundle.english') {
      responseHelpers.findBundleInfo(result, subscriberId)
      .then(response => {
        resolve(response)
      })
    } else if (result.metadata.intentName === '0.2.2.activate.bundle.english') {
      responseHelpers.activateBundle(result, subscriberId)
      .then(response => {
        resolve(response)
      })
    } else if (result.metadata.intentName === '0.2.3.find.and.activate.bundle.urdu') {
      responseHelpers.findBundles(result, subscriberId)
      .then(response => {
        resolve(response)
      })
    } else if (result.metadata.intentName === '0.2.3.find.bundle.urdu') {
      responseHelpers.findBundleInfo(result, subscriberId)
      .then(response => {
        resolve(response)
      })
    } else if (result.metadata.intentName === '0.2.3.activate.bundle.urdu') {
      responseHelpers.activateBundle(result, subscriberId)
      .then(response => {
        resolve(response)
      })
    } else if (result.metadata.intentName === '0.3.1.register.complaint.english') {
      responseHelpers.registerComplaint(result, subscriberId)
      .then(response => {
        resolve(response)
      })
    } else if (result.metadata.intentName === '0.3.2.register.complaint.roman') {
      responseHelpers.registerComplaint(result, subscriberId)
      .then(response => {
        resolve(response)
      })
    } else if (result.metadata.intentName === '0.3.3.register.complaint.urdu') {
      responseHelpers.registerComplaint(result, subscriberId)
      .then(response => {
        resolve(response)
      })
    } else if (result.metadata.intentName === '0.4.1.update.language.english') {
      resolve(responseHelpers.updateCustomerLanguage(result, subscriberId))
    } else if (result.metadata.intentName === '0.4.2.update.language.roman') {
      resolve(responseHelpers.updateCustomerLanguage(result, subscriberId))
    } else if (result.metadata.intentName === '0.4.3.update.language.urdu') {
      resolve(responseHelpers.updateCustomerLanguage(result, subscriberId))
    } else if (result.metadata.intentName === '0.5.1.deactivate.bundle.roman') {
      responseHelpers.deActivateBundle(result, subscriberId)
      .then(response => {
        resolve(response)
      })
    } else if (result.metadata.intentName === '0.5.2.deactivate.bundle.urdu') {
      responseHelpers.deActivateBundle(result, subscriberId)
      .then(response => {
        resolve(response)
      })
    } else if (result.metadata.intentName === '0.5.3.deactivate.bundle.english') {
      responseHelpers.deActivateBundle(result, subscriberId)
      .then(response => {
        resolve(response)
      })
    } else if (result.metadata.intentName === '0.6.1.fetch.complaintId.english') {
      responseHelpers.fetchComplaintIds(result, subscriberId)
      .then(response => {
        resolve(response)
      })
    } else if (result.metadata.intentName === '0.6.2.fetch.complaintId.roman') {
      responseHelpers.fetchComplaintIds(result, subscriberId)
      .then(response => {
        resolve(response)
      })
    } else if (result.metadata.intentName === '0.6.3.fetch.complaintId.urdu') {
      responseHelpers.fetchComplaintIds(result, subscriberId)
      .then(response => {
        resolve(response)
      })
    } else if (result.metadata.intentName === '0.6.1.fetch.complaint.status.english') {
      responseHelpers.checkComplaintStatus(result, subscriberId)
      .then(response => {
        resolve(response)
      })
    } else if (result.metadata.intentName === '0.6.2.fetch.complaint.status.roman') {
      responseHelpers.checkComplaintStatus(result, subscriberId)
      .then(response => {
        resolve(response)
      })
    } else if (result.metadata.intentName === '0.6.3.fetch.complaint.status.urdu') {
      responseHelpers.checkComplaintStatus(result, subscriberId)
      .then(response => {
        resolve(response)
      })
    } else if(result.metadata.intentName === '0.7.1.Other_Actions_urdu' || result.metadata.intentName === '0.7.2.Other_Actions_English' || result.metadata.intentName === '0.7.3.Other_Actions_Roman') {
      responseHelpers.otherActions(result, subscriberId)
      .then(response => {
        resolve(response)
      })
    } else if (result.metadata.intentName === '0.8.1.login.english' || result.metadata.intentName === '0.8.2.login.urdu' || result.metadata.intentName === '0.8.3.login.roman') {
      responseHelpers.signInTheCustomer(result, subscriberId)
      .then(response => {
        resolve(response)
      })
    }
  })
}

// app.post('/dialogFlowWebhook', (request, response) => {
//   console.log(request.body);
//   if (request.body.queryResult.intent.displayName === '0.1.welcome.select.language') {
//     responseHelpers.showServices(request, response)
//   } else if (request.body.queryResult.intent.displayName === '0.0.1.welcome.sign.up.urdu') {
//     responseHelpers.signUpTheCustomer(request, response)
//   } else if (request.body.queryResult.intent.displayName === '0.0.2.welcome.sign.up.english') {
//     responseHelpers.signUpTheCustomer(request, response)
//   } else if (request.body.queryResult.intent.displayName === '0.0.3.welcome.sign.up.roman.urdu') {
//     responseHelpers.signUpTheCustomer(request, response)
//   } else if (request.body.queryResult.intent.displayName === '0.1.1.my.current.package.roman') {
//     responseHelpers.currentPackage(request, response)
//   } else if (request.body.queryResult.intent.displayName === '0.1.2.my.current.package.english') {
//     responseHelpers.currentPackage(request, response)
//   } else if (request.body.queryResult.intent.displayName === '0.1.3.my.current.package.urdu') {
//     responseHelpers.currentPackage(request, response)
//   } else if (request.body.queryResult.intent.displayName === '0.2.1.find.and.activate.bundle.roman') {
//     responseHelpers.findBundles(request, response)
//   } else if (request.body.queryResult.intent.displayName === '0.2.1.find.bundle.roman') {
//     responseHelpers.findBundleInfo(request, response)
//   } else if (request.body.queryResult.intent.displayName === '0.2.1.activate.bundle.roman') {
//     responseHelpers.activateBundle(request, response)
//   } else if (request.body.queryResult.intent.displayName === '0.2.2.find.and.activate.bundle.english') {
//     responseHelpers.findBundles(request, response)
//   } else if (request.body.queryResult.intent.displayName === '0.2.2.find.bundle.english') {
//     responseHelpers.findBundleInfo(request, response)
//   } else if (request.body.queryResult.intent.displayName === '0.2.2.activate.bundle.english') {
//     responseHelpers.activateBundle(request, response)
//   } else if (request.body.queryResult.intent.displayName === '0.2.3.find.and.activate.bundle.urdu') {
//     responseHelpers.findBundles(request, response)
//   } else if (request.body.queryResult.intent.displayName === '0.2.3.find.bundle.urdu') {
//     responseHelpers.findBundleInfo(request, response)
//   } else if (request.body.queryResult.intent.displayName === '0.2.3.activate.bundle.urdu') {
//     responseHelpers.activateBundle(request, response)
//   } else if (request.body.queryResult.intent.displayName === '0.3.1.register.complaint.english') {
//     responseHelpers.registerComplaint(request, response)
//   } else if (request.body.queryResult.intent.displayName === '0.3.2.register.complaint.roman') {
//     responseHelpers.registerComplaint(request, response)
//   } else if (request.body.queryResult.intent.displayName === '0.3.3.register.complaint.urdu') {
//     responseHelpers.registerComplaint(request, response)
//   } else if (request.body.queryResult.intent.displayName === '0.4.1.update.language.english') {
//     responseHelpers.updateCustomerLanguage(request, response)
//   }  else if (request.body.queryResult.intent.displayName === '0.4.2.update.language.roman') {
//     responseHelpers.updateCustomerLanguage(request, response)
//   }  else if (request.body.queryResult.intent.displayName === '0.4.3.update.language.urdu') {
//     responseHelpers.updateCustomerLanguage(request, response)
//   } else if (request.body.queryResult.intent.displayName === '0.5.1.deactivate.bundle.roman') {
//     responseHelpers.deActivateBundle(request, response)
//   } else if (request.body.queryResult.intent.displayName === '0.5.2.deactivate.bundle.urdu') {
//     responseHelpers.deActivateBundle(request, response)
//   } else if (request.body.queryResult.intent.displayName === '0.5.3.deactivate.bundle.english') {
//     responseHelpers.deActivateBundle(request, response)
//   }  else if (request.body.queryResult.intent.displayName === '0.6.1.fetch.complaintId.english') {
//     responseHelpers.fetchComplaintIds(request, response)
//   } else if (request.body.queryResult.intent.displayName === '0.6.2.fetch.complaintId.roman') {
//     responseHelpers.fetchComplaintIds(request, response)
//   } else if (request.body.queryResult.intent.displayName === '0.6.3.fetch.complaintId.urdu') {
//     responseHelpers.fetchComplaintIds(request, response)
//   } else if (request.body.queryResult.intent.displayName === '0.6.1.fetch.complaint.status.english') {
//     responseHelpers.checkComplaintStatus(request, response)
//   } else if (request.body.queryResult.intent.displayName === '0.6.2.fetch.complaint.status.roman') {
//     responseHelpers.checkComplaintStatus(request, response)
//   } else if (request.body.queryResult.intent.displayName === '0.6.3.fetch.complaint.status.urdu') {
//     responseHelpers.checkComplaintStatus(request, response)
//   }
// })



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
  //httpApp.get('*', (req, res) => {
  //  res.redirect(`${config.domain}${req.url}`)
  //})
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
