let mongoose = require('mongoose')
let Schema = mongoose.Schema

let serviceDb = new Schema({
    name: String,
    onNet: Number,
    offNet: Number,
    internet: Number,
    sms: Number,
    price: Number,
    bill_cycle: Number
  })

module.exports = mongoose.model('services', serviceDb)