let mongoose = require('mongoose')
let Schema = mongoose.Schema


let customerDb = new Schema({
    phone: String,
    current_service: {type: Schema.ObjectId, ref: 'services'},
    service_usage: Object,
    language: {type: String, default: "English"},
    subscriberId: String
  })

  module.exports = mongoose.model('customers', customerDb)