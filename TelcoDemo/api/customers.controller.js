const datalayer = require('./customers.datalayer')
const serviceDatalayer = require('./services.datalayer')

exports.findCustomer = function(phone) {
    return datalayer.findCustomer(phone)
}
exports.updatePackageRoman = function(phone, newPackageId) {
    if (newPackageId == 'deActivatePackage') {
        return datalayer.updateCustomer({phone: phone}, {$unset: {current_service: ''}})
    } else {
        return datalayer.updateCustomer({phone: phone}, {current_service: newPackageId})
    }
}

exports.editLanguage = function (phone, newLanguage) {
    return datalayer.updateCustomer({phone: phone}, {language: newLanguage})
}

exports.insertNewCustomer = function (body, cb) {
    datalayer.findCustomer(body.phone)
    .then(customer => {
        if (customer) {
            return cb(null, {exists: true})
        }
        return datalayer.createCustomer({
            phone: body.phone,
            language: body.language
        })
    })
    .then(customer => {
        cb(null, {exists: false, customer})
    })
    .catch(err => cb(err))
}

exports.currentPackage = function (phone) {
    return datalayer.findCustomerWithService(phone, 'current_service')
}