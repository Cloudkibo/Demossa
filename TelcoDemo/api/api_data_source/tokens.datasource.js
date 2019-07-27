const util = require('../../utility')
const config = require('../../config/environment')
const domain = config.api_domain

exports.findCustomerToken = function (customer) {
    return new Promise(function (resolve, reject) {
        util.callApi(domain, 'authentication', 'post', config.api_auth)
            .then(token => {
                return util.callApi(domain, `sessions?customer=${customer._id}`, 'get', {}, token.accessToken)
            })
            .then(session => {
                return session = session.data[0]
            })
            .then(session => {
                resolve(session)
            })
            .catch(err => {
                reject(err)
            })
    })
}

exports.insertNewToken = function (payload) {
    return new Promise(function (resolve, reject) {
        util.callApi(domain, 'authentication', 'post', config.api_auth)
            .then(token => {
                return util.callApi(domain, `sessions`, 'post', payload, token.accessToken)
            })
            .then(session => {
                resolve(session)
            })
            .catch(err => {
                reject(err)
            })
    })
}

exports.updateExpiredToken = function (query, payload) {
    return new Promise(function (resolve, reject) {
        util.callApi(domain, 'authentication', 'post', config.api_auth)
        .then(token => {
            return util.callApi(domain, `sessions?customer=${query.customer._id}`, 'get', {}, token.accessToken)
        })
        .then(session => {
            session = session.data[0]
            console.log(session)
            util.callApi(domain, 'authentication', 'post', config.api_auth)
                    .then(token => {
                        return util.callApi(domain, `sessions/${session._id}`, 'put', payload, token.accessToken)
                    })
        })
        .then(updated => {
            resolve(updated)
        })
        .catch(err => {
            reject(err)
        })
    })
} 