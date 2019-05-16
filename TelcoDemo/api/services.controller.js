const Service = require('../models/services.model')

exports.findService = function (serviceId) {
    return new Promise(function(resolve, reject) {
        Service.findById(serviceId, (err, found) => {
            if(err) {
                reject('filhal, moojoda number per koi package activated nahi hy')
            } else if (!found) {
                resolve('filhal, moojoda number per koi package activated nahi hy')
            } else {
                let message = `Apka mojoda package hay ${found.name}.`
                resolve(message)
            }
        })
    })
}
exports.findBundles = function () {
    return new Promise(function(resolve, reject) {
        Service.find({}, (err, found) => {
            if(err) {
                reject('filhal, koi bi package available nahi hain')
            } else {
                resolve(found)
            }
        })
    })
}

exports.findServiceByName = function (packageName) {
    return new Promise(function(resolve, reject) {
        Service.findOne({name: packageName}, (err, found) => {
            if(err) {
                reject('filhal, moojoda number per koi package activated nahi hy')
            } else {
                resolve(found)
            }
        })
    })
}

