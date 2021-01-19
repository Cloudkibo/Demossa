'use strict'

const express = require('express')

const router = express.Router()
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./chatbot.controller')

router.post('/getChatbotResponse',
  validate({body: validationSchema.getChatbotResponseSchema}),
  controller.index)

module.exports = router
