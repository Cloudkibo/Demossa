let mongoose = require('mongoose')
let Schema = mongoose.Schema


let tokens = new Schema({
    customer: {type: Schema.ObjectId, ref: 'customers'},
    token: String
  })

  module.exports = mongoose.model('tokens', tokens)