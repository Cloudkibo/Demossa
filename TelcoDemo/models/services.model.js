let mongoose = require('mongoose')
let Schema = mongoose.Schema

let serviceDb = new Schema({
    name: String,
    onNet: String,
    offNet: String,
    internet: String,
    sms: String,
    price: Number,
    bill_cycle: String
  })

module.exports = mongoose.model('services', serviceDb)