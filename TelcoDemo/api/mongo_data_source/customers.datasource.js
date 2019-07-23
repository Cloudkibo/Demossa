const Customer = require('../../models/customers.model')
const Tokens = require('../../models/tokens.model')

exports.create = (payload) => {
    return new Promise(function(resolve, reject) {
        let obj = new Customer(payload)
        resolve(obj.save())
    })
}

exports.findCustomerByIdMongo = function (phone) {
    return new Promise(function(resolve, reject) {
        Customer.findOne({phone: phone}, (err, found) => {
            if(err) {
                reject(err)
            } else {
                resolve(found)
            }
        })
    })
}

exports.findOneAndUpdate = function (query, payload) {
    return new Promise(function(resolve, reject) {
        Customer.findOneAndUpdate(query, payload, (err, updated) => {
            if (err) {
                reject(err)
            } else {
                resolve(updated)
            }
        })
    })
}

exports.findCustomerBySubscriberId = function (subscriberId, populateString)  {
    return new Promise(function (resolve, reject) {
        Customer.findOne({subscriberId}).populate(populateString).exec((err, found) => {
            if(err) {
                reject(err)
            } else {
                resolve(found)
            }
        })
    })
}