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

