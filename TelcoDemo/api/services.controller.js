const datalayer = require('./services.datalayer')

exports.findService = function (serviceId) {
    return datalayer.findService(serviceId)
}

exports.findBundles = function () {
    return datalayer.findServices()
}

exports.findServiceByName = function (packageName) {
    return datalayer.findServiceByName(packageName)
}

