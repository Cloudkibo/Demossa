const Tokens = require('../../models/tokens.model')

exports.findCustomerToken = function (customer) {
    return new Promise(function(resolve, reject) {
        Tokens.findOne({customer: customer}, (err, found) => {
            if(err) {
                reject(err)
            } else {
                resolve(found)
            }
        })
    })
}

exports.insertNewToken = function (payload) {
    return new Promise(function(resolve, reject) {
        let obj = new Tokens(payload)
        resolve(obj.save())
    })
}
