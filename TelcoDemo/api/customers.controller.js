const Customer = require('../models/customers.model')

exports.editLanguage = function (phone, newLanguage) {
    return new Promise(function(resolve, reject) {
        Customer.findOneAndUpdate({phone: phone}, {language: newLanguage}, (err, updated) => {
            if (err) {
                reject('No phone found in our system')
            } 
            else if (!updated) {
                resolve('No phone number found in our system, kindly sign up first')
            } else {
                message = `Your language is updated to' ${newLanguage}.`
                resolve(message)
            }
        })
    })
}

exports.updatePackage = function (phone, newPackageId) {
    Customer.findOneAndUpdate({phone: phone}, {current_service: newPackageId}, (err, doc) => {
        if (err) {
            console.log(err)
        }
        console.log('Updated the package of customer')
        console.log(done)
    })
}

exports.insertNewCustomer = function (body, cb) {
    Customer.findOne({phone: body.phone}, (err, customer) => {
        if (err) {
            cb(err)
        }
        if (customer) {
            return cb(null, {exists: true})
        }
        let newCustomer = new Customer({
            phone: body.phone,
            language: body.language
        })
        newCustomer.save((err, createdCustomer) => {
            if (err) {
                cb(err)
            }
            return cb(null, {exists: false})
        })
    })
}