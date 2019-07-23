const datalayer = require('./tokens.datalayer')

exports.findCustomerToken = function(customer) {
    return datalayer.findCustomerToken(customer)
}

exports.insertNewToken = function(payload) {
    return datalayer.insertNewToken(payload)
}