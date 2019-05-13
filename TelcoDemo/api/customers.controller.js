const Customer = require('../models/customers.model')

exports.editLanguage = function (phone, newLanguage) {
    Customer.findOneAndUpdate({phone: phone}, {language: newLanguage}, (err, doc) => {
        if (err) {
            console.log(err)
        }
        console.log('Updated the language of customer')
        console.log(done)
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