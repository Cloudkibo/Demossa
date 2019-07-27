const config = require('../config/environment')
const api_datasource = require('./api_data_source/tokens.datasource')
const mongo_datasource = require('./mongo_data_source/tokens.datasource')

exports.findCustomerToken = function (customer) {
    if (config.dataSource === 'api') {
        return api_datasource.findCustomerToken(customer)
    } else {
        return mongo_datasource.findCustomerToken(customer)
    }
}

exports.insertNewToken = function (payload) {
    if (config.dataSource === 'api') {
        return api_datasource.insertNewToken(payload)
    } else {
        return mongo_datasource.insertNewToken(payload)
    }
}

exports.updateExpiredToken = function (query, payload) {
    if (config.dataSource === 'api') {
        return api_datasource.updateExpiredToken(query, payload)
    } else {
        return mongo_datasource.updateExpiredToken(query, payload)
    }
}