const util = require('../utility')
const config = require('../config/environment')
const customer = require('./customers.controller')
const domain = config.api_domain

exports.sendOtp = function (phone, otp, message) {
    phone = phone.substring(1)
    config.otp.mobileNo = phone
    config.otp.message = message
    return new Promise(function(resolve, reject) {
        util.callApi(domain, 'authentication', 'post', config.api_auth)
        .then(token => {
            return util.callApi(domain, 'sms', 'post', config.otp, token.accessToken)
        })
        .then(sentOtp => {
            customer.updateOtp(phone, otp)
        })
        .catch(err => {
            reject(err)
        })
    })
}