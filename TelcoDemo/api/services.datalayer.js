const config = require('../config/environment')
const api_datasource = require('./api_data_source/services.datasource')
const mongo_datasource = require('./mongo_data_source/services.datasource')

exports.findService = function (serviceId) {
    if (config.dataSource === 'api') {
        return api_datasource.findServiceByIdAPI(serviceId)
    } else {
        return mongo_datasource.findServiceByIdMongo(serviceId)
    }
}

exports.findServices = function () {
    if (config.dataSource === 'api') {
        return api_datasource.findServicesAPI()
    } else {
        return mongo_datasource.findServicesMongo()
    }
}

exports.findServiceByName = function (packageName) {
    if (config.dataSource === 'api') {
        return api_datasource.findServiceByNameAPI(packageName)
    } else {
        return mongo_datasource.findServiceByNameMongo(packageName)
    }
}