const util = require('../../utility')
const config = require('../../config/environment')
const domain = config.api_domain

exports.create = function (payload) {
    payload.phone = payload.phone.substring(1)
    return new Promise(function(resolve, reject) {
        util.callApi(domain, 'authentication', 'post', config.api_auth)
        .then(token => {
            return util.callApi(domain, 'subscribers', 'post', payload, token.accessToken)
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
    phone = phone.substring(1)
    return new Promise(function(resolve, reject) {
        util.callApi(domain, 'authentication', 'post', config.api_auth)
        .then(token => {
            return util.callApi(domain, `subscribers?phone=${phone}`, 'get', {}, token.accessToken)
        })
        .then(users => {
            return users = users.data[0]
        })
        .then(users => {
            if(users) users.phone = '+' + users.phone
            resolve(users)
        })
        .catch(err => {
            reject(err)
        })
    })
}

// TODO update
exports.findOneAndUpdate = function (query, payload) {
    let token
    let tempUserPayload = {}
    return new Promise(function(resolve, reject) {
        util.callApi(domain, 'authentication', 'post', config.api_auth)
        .then(tokens => {
            token = tokens
            return util.callApi(domain, `subscribers?phone=${query.phone}`, 'get', {}, token.accessToken)
        })
        .then(users => users.data[0])
        .then(users => {
            if (payload.language) {
                users.language = payload.language
            } else if (payload.current_service) {
                users.current_service = payload.current_service
            } else if (payload.$unset && payload.$unset.current_service === '') {
                users.current_service = ''
            }
            return users
        })
        .then(users => {
            for (let key in users) {
                tempUserPayload[key] = users[key];
            }
            delete tempUserPayload['_id']
            return users
        })
        .then(users => util.callApi(domain, `subscribers/${users._id}`, 'put', tempUserPayload, token.accessToken))
        .then(users => {
            users.phone = '+' + users.phone
            resolve(users)
        })
        .catch(err => {
            reject(err)
        })
    })
}

exports.findCustomerWithService = function (phone, populateString) {
    phone = phone.substring(1)
    let token
    let user
    return new Promise(function(resolve, reject) {
        util.callApi(domain, 'authentication', 'post', config.api_auth)
        .then(tokens => {
            token = tokens
            return util.callApi(domain, `subscribers?phone=${phone}`, 'get', {}, token.accessToken)
        })
        .then(users => users.data[0])
        .then(users => {
            if(users) users.phone = '+' + users.phone
            user = users
            return user
        })
        .then(users => {
            if (users.current_service) util.callApi(domain, `packages?${populateString}=${users.current_service}`, 'get', {}, token.accessToken)
            else return {data:[]}
        })
        .then(services => services.data[0])
        .then(services => {
            if(services) user.current_service = services
            return user
        })
        .then(users => {
            resolve(users)
        })
        .catch(err => {
            reject(err)
        })
    })
}

exports.findCustomerBySubscriberId = function (subscriberId, populateString) {
    let token
    let user
    return new Promise(function(resolve, reject) {
        util.callApi(domain, 'authentication', 'post', config.api_auth)
        .then(tokens => {
            token = tokens
            return util.callApi(domain, `subscribers?subscriberId=${subscriberId}`, 'get', {}, token.accessToken)
        })
        .then(users => users.data[0])
        .then(users => {
            if(users) users.phone = '+' + users.phone
            else if(!users) resolve(users)
            user = users
            return user
        })
        .then(users => {
            if(users.current_service) {
              return util.callApi(domain, `packages?_id=${users.current_service}`, 'get', {}, token.accessToken)
            }
            else return {data:[]}
        })
        .then(services => services.data[0])
        .then(services => {
            if(user.current_service) user.current_service = services
            return user
        })
        .then(users => {
            resolve(users)
        })
        .catch(err => {
            reject(err)
        })
    })
}