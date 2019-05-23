const util = require('../../utility')
const config = require('../../config/environment')
const domain = config.api_domain

exports.create = function (payload) {
    return new Promise(function(resolve, reject) {
        util.callApi(domain, 'authentication', 'post', config.api_auth)
        .then(token => {
            return util.callApi(domain, 'tickets', 'post', payload, token.accessToken)
        })
        .then(complaints => {
            resolve(complaints)
        })
        .catch(err => {
            reject(err)
        })
    })
}

exports.findComplaintByIdApi = function (complaintId) {
    return new Promise(function(resolve, reject) {
        util.callApi(domain, 'authentication', 'post', config.api_auth)
        .then(token => {
            return util.callApi(domain, 'tickets', 'get', {}, token.accessToken)
        })
        .then(complaints => {
            resolve(complaints)
        })
        .catch(err => {
            reject(err)
        })
    })
}

exports.findComplaintByCustomerApi = function (customerId) {
    return new Promise(function(resolve, reject) {
        util.callApi(domain, 'authentication', 'post', config.api_auth)
        .then(token => {
            return util.callApi(domain, 'tickets', 'get', {}, token.accessToken)
        })
        .then(complaints => {
            resolve(complaints)
        })
        .catch(err => {
            reject(err)
        })
    })
}