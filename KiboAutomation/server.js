const express = require('express')
const http = require('http')
const https = require('https')
const fs = require('fs')
const Sentry = require('@sentry/node')
const config = require('./config')

var httpsApp = express()
var httpApp = express()
let options = {
  ca: '',
  key: '',
  cert: ''
}

const app = (process.env.NODE_ENV === 'production') ? httpsApp : httpApp
const server = http.createServer(httpApp)
const httpsServer = https.createServer(options, httpsApp)

if (config.env === 'production') {
  try {
    options = {
      ca: fs.readFileSync('/root/certs/kiboautomation/ca_bundle.crt'),
      key: fs.readFileSync('/root/certs/kiboautomation/private.key'),
      cert: fs.readFileSync('/root/certs/kiboautomation/certificate.crt')
    }
  } catch (e) {
    console.log('Error occured while reading ssl certs', e)
  }
  httpApp.get('*', (req, res) => {
    res.redirect(`${config.domain}${req.url}`)
  })
}

if (config.env === 'production' || config.env === 'staging') {
  Sentry.init({
    dsn: 'https://6c7958e0570f455381d6f17122fbd117@o132281.ingest.sentry.io/292307',
    release: 'KiboAutomation@0.0.1',
    environment: config.env,
    serverName: 'KiboAutomation',
    sendDefaultPii: true
  })
}

server.listen(config.port, config.ip, () => {
  console.log(`KiboAutomation server STARTED on ${
    config.port} in ${config.env} mode on domain ${config.domain}`)
})

httpsServer.listen(config.secure_port, () => {
  console.log(`KiboAutomation server STARTED on ${
    config.secure_port} in ${config.env} mode on domain ${config.domain}`)
})

require('./routes')(app)
