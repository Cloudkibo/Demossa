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