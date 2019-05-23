const util = require('../../utility')
const config = require('../../config/environment')
const domain = config.api_domain

exports.create = function (payload) {
    return new Promise(function(resolve, reject) {
        util.callApi(domain, 'authentication', 'post', config.api_auth)
        .then(token => {
            return util.callApi(domain, 'users', 'post', payload, token.accessToken)
        })
        .then(users => {
            resolve(users)
        })
        .catch(err => {
            reject(err)
        })
    })
}

exports.findCustomerByIdApi = function (phone) {
    return new Promise(function(resolve, reject) {
        util.callApi(domain, 'authentication', 'post', config.api_auth)
        .then(token => {
            return util.callApi(domain, 'users', 'get', {}, token.accessToken)
        })
        .then(users => {
            resolve(users)
        })
        .catch(err => {
            reject(err)
        })
    })
}

exports.findOneAndUpdate = function (query, payload) {
    return new Promise(function(resolve, reject) {
        util.callApi(domain, 'authentication', 'post', config.api_auth)
        .then(token => {
            return util.callApi(domain, 'users', 'get', {}, token.accessToken)
        })
        .then(users => {
            resolve(users)
        })
        .catch(err => {
            reject(err)
        })
    })
}

exports.findCustomerWithService = function (phone, populateString) {
    return new Promise(function(resolve, reject) {
        util.callApi(domain, 'authentication', 'post', config.api_auth)
        .then(token => {
            return util.callApi(domain, 'users', 'get', {}, token.accessToken)
        })
        .then(users => {
            resolve(users)
        })
        .catch(err => {
            reject(err)
        })
    })
}