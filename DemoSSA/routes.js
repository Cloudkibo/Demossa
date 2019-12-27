const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const { createButtons } = require('./utils/index.js')
const controller = require('./controller/index.js')

module.exports = function (app) {
  // Setup template engine - add pug
  app.set('view engine', 'pug')

  // Tell Express where our templates are
  app.set('views', './views')

  // Parse data from application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }))

  app.use(bodyParser.json())

  // we've started you off with Express,
  // but feel free to use whatever libs or frameworks you'd like through `package.json`.

  // http://expressjs.com/en/starter/static-files.html
  app.use(express.static('public'))

  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
  })

  app.get('/fbPost', controller.verifyToken)
  app.post('/fbPost', controller.handleEvent)
  app.post('/webPost', controller.handleWebClient)

  app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, '/views/earningsRecord.html'))
  })

  app.get('/show-buttons', (request, response) => {
    const displayUrl = process.env.DOMAIN + '/show-webview'
    response.json(createButtons(displayUrl))
  })

  app.get('/show-webview', (request, response) => {
    response.sendFile(path.join(__dirname, '/views/webview.html'))
  })

  app.get('/login', (request, response) => {
    response.sendFile(path.join(__dirname, '/views/login.html'))
  })

  app.get('/verify-phone', (request, response) => {
    response.sendFile(path.join(__dirname, '/views/verify-phone.html'))
  })

  app.get('/verify-code', (request, response) => {
    response.sendFile(path.join(__dirname, '/views/verify-code.html'))
  })

  app.get('/terms', (request, response) => {
    response.sendFile(path.join(__dirname, '/views/terms.html'))
  })

  app.get('/dashboard', (request, response) => {
    response.sendFile(path.join(__dirname, '/views/dashboard.html'))
  })

  app.get('/benefitsAndPayments', (request, response) => {
    response.sendFile(path.join(__dirname, '/views/benefitsAndPayments.html'))
  })

  app.get('/estimatedBenefits', (request, response) => {
    response.sendFile(path.join(__dirname, '/views/estimatedBenefits.html'))
  })

  app.get('/earningsRecord', (request, response) => {
    response.sendFile(path.join(__dirname, '/views/earningsRecord.html'))
  })

  app.get('/myProfile', (request, response) => {
    response.sendFile(path.join(__dirname, '/views/myProfile.html'))
  })

  app.get('/securitySettings', (request, response) => {
    response.sendFile(path.join(__dirname, '/views/securitySettings.html'))
  })

  app.get('/updateContactInformation', (request, response) => {
    response.sendFile(path.join(__dirname, '/views/updateContactInformation.html'))
  })

  app.get('/newfile', (request, response) => {
    response.sendFile(path.join(__dirname, '/views/newfile.html'))
  })

  app.get('/redirect', (request, response) => {
    console.log(request.query)
    response.redirect(request.query.continue)
  })

  app.get('/*', (request, response) => {
    response.send('This page is not yet implemented in our demo.')
  })
}
