const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

module.exports = function (app) {
  // Parse data from application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  // http://expressjs.com/en/starter/static-files.html
  app.use(express.static(path.join(__dirname, 'public')))
  app.use('/api', require('./api/chatbot'))

  app.get('/*', (request, response) => {
    response.send('This page is not yet implemented.')
  })
}
