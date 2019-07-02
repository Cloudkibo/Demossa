const util = require('../../utility')
const config = require('../../config/environment')
const domain = config.api_domain

exports.findServiceByIdAPI = function (serviceId) {
    return new Promise(function(resolve, reject) {
        util.callApi(domain, 'authentication', 'post', config.api_auth)
        .then(token => {
            return util.callApi(domain, `packages?_id=${serviceId}`, 'get', {}, token.accessToken)
        })
        .then(services => {
            return services = services.data[0]
        })
        .then(services => {
            let tempServices = {
                _id: services._id,
                name: services.name,
                onNet: services['onNet'],
                offNet: services['offNet'],
                internet: services.internet,
                sms: services.sms,
                price: services.price,
                bill_cycle: services['billCycle']
              }
            return tempServices
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
            return services = services.data
        })
        .then(services => {
            let tempServices = []
            for (let i=0; i<services.length; i++) {
                tempServices.push({
                    _id: services[i]._id,
                    name: services[i].name,
                    onNet: services[i].onNet,
                    offNet: services[i].offNet,
                    internet: services[i].internet,
                    sms: services[i].sms,
                    price: services[i].price,
                    bill_cycle: services[i].billCycle
                  })
            }
            return tempServices
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
            return util.callApi(domain, `packages?name=${packageName}`, 'get', {}, token.accessToken)
        })
        .then(services => {
            return services = services.data[0]
        })
        .then(services => {
            let tempServices = {
                _id: services._id,
                name: services.name,
                onNet: services['onNet'],
                offNet: services['offNet'],
                internet: services.internet,
                sms: services.sms,
                price: services.price,
                bill_cycle: services['billCycle']
              }
            return tempServices
        })
        .then(services => {
            resolve(services)
        })
        .catch(err => {
            reject(err)
        })
    })
}