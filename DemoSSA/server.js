// server.js
// where your node app starts

// init project
const express = require('express')
const http = require('http')
const https = require('https')
const fs = require('fs')

var httpsApp = express()
var httpApp = express()

const app = (process.env.NODE_ENV === 'production') ? httpsApp : httpApp

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

require('./routes')(app)
