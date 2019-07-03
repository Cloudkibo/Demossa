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

exports.editLanguage = function (sessionId, newLanguage) {
    return datalayer.updateCustomer({sessionId: sessionId}, {language: newLanguage})
}

exports.insertNewCustomer = function (body, cb) {
    datalayer.findCustomer(body.phone, 'current_service')
    .then(customer => {
        if (customer) {
            return cb(null, {exists: true})
        }
        else {
            datalayer.createCustomer({
                phone: body.phone,
                language: body.language,
                subscriberId: body.subscriberId
            })
            return cb(null, {exists: false})
        }
    })
    .catch(err => cb(err))
}

exports.findCustomerBySubscriberId = function (subscriberId) {
    return datalayer.findCustomerBySubscriberId(subscriberId, 'current_service')
}