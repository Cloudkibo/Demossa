const config = require('../config/environment')
const api_datasource = require('./api_data_source/customers.datasource')
const mongo_datasource = require('./mongo_data_source/customers.datasource')

exports.findCustomer = function (phone) {
    if (config.dataSource === 'api') {
        return api_datasource.findCustomerByIdApi(phone)
    } else {
        return mongo_datasource.findCustomerByIdMongo(phone)
    }
}

exports.createCustomer = function (payload) {
    if (config.dataSource === 'api') {
        return api_datasource.create(payload)
    } else {
        return mongo_datasource.create(payload)
    }
}

exports.updateCustomer = function (query, payload) {
    if (config.dataSource === 'api') {
        return api_datasource.findOneAndUpdate(query, payload)
    } else {
        return mongo_datasource.findOneAndUpdate(query, payload)
    }
}

exports.findCustomerWithService = function (phone, populateString) {
    if (config.dataSource === 'api') {
        return api_datasource.findCustomerWithService(phone, populateString)
    } else {
        return mongo_datasource.findCustomerWithService(phone, populateString)
    }
}

// api_datasource.create({phone: '+923323800399'}) // _id: xIXndPUZyOYyeIcn
// .then(customer => console.log(customer))
// .catch(err => console.log(err))

// api_datasource.findCustomerByIdApi('+923323800399')
// .then(customer => console.log(customer))
// .catch(err => console.log(err))

// api_datasource.findCustomerWithService('+923323800399', 'current_service')
// .then(customer => console.log(customer))
// .catch(err => console.log(err))

// TODO
// api_datasource.findOneAndUpdate({phone: '+923323800399'}, {language: 'English'})
// .then(customer => console.log(customer))
// .catch(err => console.log(err.error))