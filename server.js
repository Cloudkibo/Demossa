// server.js
// where your node app starts

// init project
var express = require('express');
const bodyParser = require('body-parser');
const url = require('url');
const requestPromise = require('request-promise');
const util = require('./utility.js')

var app = express();

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
  const displayUrl = 'https://boiling-push.glitch.me/show-webview';
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
  let query = message.message.text
  if (query) {
    console.log(query)
  } else {
    
  }
});

callDialogFlowAPI("update my status")
.then(result => {
    console.log(result)
  })
  .catch(err => {
    console.log(err)
  })

function callDialogFlowAPI (query) {
  let apiUrl = 'https://api.dialogflow.com/v1';
  let accessToken = 'Bearer a8966d1db63f47a2bc79a17757c5d357';
  let payload = {
    "contexts": [
    "shop"
    ],
    "lang": "en",
    "query": query,
    "sessionId": "12345",
    "timezone": "America/New_York"
  }
  
  return util.callApi(apiUrl, 'query?v=20170712', 'post', payload, accessToken)
  .then(result => {
    return new Promise((resolve, reject) => {
      if (result.status.code === 200) {
        console.log(result.result.fulfillment.messages)
        resolve(result)
      } else {
        reject(result)
      }
    })
  })
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

app.post('/broadcast-to-chatfuel', (request, response) => {
  const botId = process.env.CHATFUEL_BOT_ID;
  const chatfuelToken = process.env.CHATFUEL_TOKEN;
  
  const userId = '1950844914929171';
  const blockName = 'WebviewResponse';
  
  const broadcastApiUrl = `https://api.chatfuel.com/bots/${botId}/users/${userId}/send`;
  
  const query = Object.assign({
      chatfuel_token: chatfuelToken,
      chatfuel_block_name: blockName
    },
    request.body
  );
  
  const chatfuelApiUrl = url.format({
    pathname: broadcastApiUrl,
    query
  });
  
  const options = {
    uri: chatfuelApiUrl,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  requestPromise.post(options)
    .then(() => {
      response.json({});
    });
  
});

app.post('/dynamic-webview', (request, response) => {
  const botId = process.env.CHATFUEL_BOT_ID;
  const chatfuelToken = process.env.CHATFUEL_TOKEN;
  
  // Get user id and block name from request.body
  const {userId, blockName} = request.body;
  
  const broadcastApiUrl = `https://api.chatfuel.com/bots/${botId}/users/${userId}/send`;
  
  const query = Object.assign({
      chatfuel_token: chatfuelToken,
      chatfuel_block_name: blockName
    },
    request.body
  );
  
  const chatfuelApiUrl = url.format({
    pathname: broadcastApiUrl,
    query
  });
  
  const options = {
    uri: chatfuelApiUrl,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  requestPromise.post(options)
    .then(() => {
      response.json({});
    });
  
});

// Using the new NPM module I created
app.post('/dynamic-webview-new', (request, response) => {
  const botId = process.env.CHATFUEL_BOT_ID;
  const chatfuelToken = process.env.CHATFUEL_TOKEN;
  
  // Get user id and block name from request.body
  const {userId, blockName} = request.body;
  
  const options = {
    botId,
    token: chatfuelToken,
    userId,
    blockId: 'blockName',
    attributes: request.body
  };
  
  chatfuelBroadcast(options)
    .then(() => {
      response.json({});
    })
    .catch(error => {
      console.log(error.statusCode);
      console.log(error);
      response.json({});
    });
});

app.get('/show-dynamic-buttons', (request, response) => {
  const {userId, blockName} = request.query;
  
  const displayUrl = `https://boiling-push.glitch.me/dynamic-webview?userId=${userId}&blockName=${blockName}`;

  response.json(createButtons(displayUrl)); 
});


app.get('/dynamic-webview', (request, response) => {
  const {userId, blockName} = request.query;
  
  response.render('dynamic-webview', {pageTitle: 'This is my page', userId, blockName});
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
