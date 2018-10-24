// server.js
// where your node app starts

// init project
var express = require('express');
const bodyParser = require('body-parser');
const url = require('url');
const requestPromise = require('request-promise');
const chatfuelBroadcast = require('chatfuel-broadcast').default;

var app = express();

// Setup template engine - add pug
app.set('view engine', 'pug');

// Tell Express where our templates are
app.set('views', './views');


// Parse data from application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
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
  const displayUrl = 'https://discreet-attic.glitch.me/show-webview';
  response.json(createButtons(displayUrl)); 
});

app.get('/show-webview', (request, response) => {
  response.sendFile(__dirname + '/views/webview.html');
});

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
  
  const displayUrl = `https://discreet-attic.glitch.me/dynamic-webview?userId=${userId}&blockName=${blockName}`;

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
