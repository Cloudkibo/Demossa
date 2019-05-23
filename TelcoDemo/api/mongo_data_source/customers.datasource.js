const Customer = require('../../models/customers.model')

exports.create = (payload) => {
    let obj = new Customer(payload)
    return obj.save()
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

exports.findCustomerWithService = function (phone, populateString) {
    return new Promise(function(resolve, reject) {
        Customer.findOne({phone}).populate(populateString).exec((err, found) => {
            if(err) {
                reject(err)
            } else {
                resolve(found)
            }
        })
    })
}