let mongoose = require('mongoose')
let Schema = mongoose.Schema


let complainDb = new Schema({
    customer: {type: Schema.ObjectId, ref: 'customers'},
    status: String,
    description: String,
  })

  module.exports = mongoose.model('complains', complainDb)