const util = require('../../utility')
const config = require('../../config/environment')
const domain = config.api_domain

exports.findServiceByIdAPI = function (serviceId) {
    return new Promise(function(resolve, reject) {
        util.callApi(domain, 'authentication', 'post', config.api_auth)
        .then(token => {
            return util.callApi(domain, 'packages', 'get', {}, token.accessToken)
        })
        .then(services => {
            resolve(services)
        })
        .catch(err => {
            reject(err)
        })
    })
}

exports.findServicesAPI = function () {
    return new Promise(function(resolve, reject) {
        util.callApi(domain, 'authentication', 'post', config.api_auth)
        .then(token => {
            return util.callApi(domain, 'packages', 'get', {}, token.accessToken)
        })
        .then(services => {
            resolve(services)
        })
        .catch(err => {
            reject(err)
        })
    })
}

exports.findServiceByNameAPI = function (packageName) {
    return new Promise(function(resolve, reject) {
        util.callApi(domain, 'authentication', 'post', config.api_auth)
        .then(token => {
            return util.callApi(domain, 'packages', 'get', {}, token.accessToken)
        })
        .then(services => {
            resolve(services)
        })
        .catch(err => {
            reject(err)
        })
    })
}