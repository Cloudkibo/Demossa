const Customer = require('../models/customers.model')
const services = require('./../api/services.controller')


exports.updatePackageRoman = function(phone, newPackageId) {
    return new Promise(function(resolve, reject) {
        if (newPackageId == 'deActivatePackage') {
            Customer.findOneAndUpdate({phone: phone}, {$unset: {current_service: ''}}, (err, deleted) => {
                if (err) {
                    reject('Hamary system main is phone number ka koi user moojood nahi')
                } else if (!deleted) {
                    resolve('Hamary system main is phone number ka koi user moojood nahi, ap abhi "Hi" likh ker sign up kerskty hain')
                } else {
                    resolve(deleted)
                }
            })
        } else {
            Customer.findOneAndUpdate({phone: phone}, {current_service: newPackageId}, (err, updated) => {
                if (err) {
                    reject('Hamary system main is phone number ka koi user moojood nahi')
                } else if (!updated) {
                    resolve('Hamary system main is phone number ka koi user moojood nahi, ap abhi "Hi" likh ker sign up kerskty hain')
                } else {
                    resolve(updated)
                }
            })   
        }
    })
}

exports.editLanguage = function (phone, newLanguage) {
    return new Promise(function(resolve, reject) {
        Customer.findOneAndUpdate({phone: phone}, {language: newLanguage}, (err, updated) => {
            if (err) {
                reject('No phone found in our system')
            } 
            else if (!updated) {
                resolve('No phone number found in our system, kindly sign up first')
            } else {
                message = `Your language is updated to' ${newLanguage}.`
                resolve(message)
            }
        })
    })
}

exports.insertNewCustomer = function (body, cb) {
    Customer.findOne({phone: body.phone}, (err, customer) => {
        if (err) {
            cb(err)
        }
        if (customer) {
            return cb(null, {exists: true})
        }
        let newCustomer = new Customer({
            phone: body.phone,
            language: body.language
        })
        newCustomer.save((err, createdCustomer) => {
            if (err) {
                cb(err)
            }
            return cb(null, {exists: false})
        })
    })
}

exports.currentPackage = function (phone) {
    return new Promise(function(resolve, reject) {
        Customer.findOne({phone: phone}, (err, found) => {
            if (err) {
                reject('Hamary system main is phone number ka koi user moojood nahi')
            } else if (!found) {
                resolve('Hamary system main is phone number ka koi user moojood nahi, ap abhi "Hi" likh ker sign up kerskty hain')
            } else {
                var promise = services.findService(found.current_service)
                promise
                .then((message) => {
                    if(found.service_usage) {
                        message = message + `ap ky baqaya sms hain ${found.service_usage.Sms}, baqaya on-net minutes hain ${found.service_usage.Onnet} or baqaya off-net minutes hain ${found.service_usage.Offnet}. jab k ap ka baqaya data hy ${found.service_usage.Data}`
                        resolve(message)
                    } else {
                        resolve(message)
                    }
                })
            }
        })
    })
}