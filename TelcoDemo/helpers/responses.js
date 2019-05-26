const util = require('./../utility')
const customers = require('./../api/customers.controller')
const Complaint = require('./../api/complaint.controller')
const services = require('./../api/services.controller')
const statements = require('./i13n').statements

exports.currentPackageRoman = function (request, response) {
  let message = ''
  let sessionId = request.body.session
  let fallback = statements.fallback.romanurdu

    customers.findCustomerBySessionId(sessionId)
    .then(customer => {
      if (!customer) {
        message = 'Ap hamary system main signup nahi hain, ap abhi "Hi" likh ker sign up kerskty hain'
        return simpleMessageResponse(response, message, fallback)
      }
      if(customer.current_service) {
        message = 'Apka mojooda package hei ' + customer.current_service.name
      }
      else if(customer.service_usage) {
        message = 'Apka mojooda package hei ' + customer.current_service.name
        + ' ap ky baqaya sms hain ' + customer.service_usage.Sms
        + ', baqaya on-net minutes hain ' + customer.service_usage.Onnet
        + ' or baqaya off-net minutes hain ' + customer.service_usage.Offnet
        + '. jab k ap ka baqaya data hy ' + customer.service_usage.Data + '.'
      } else {
        message = 'filhaal mojooda number per koi b package mojood nahi hai'
      }
      return simpleMessageResponse(response, message, fallback)
    })
    .catch(err => {
        console.log(err)
        simpleMessageResponse(response, statements.globalerror.romanurdu, fallback)
      })
}

exports.findBundlesRoman = function (request, response) {
  let message = ''
  let fallback = statements.fallback.romanurdu
  var promise = services.findBundles()
  promise
    .then((bundles) => {
      if (bundles.length > 0) {
        let quickReplies = []
        bundles.forEach(element => {
          quickReplies.push(`${element.name}`)
        })
        return quickRepliesResponse(response, '', 'Jazz k packages ka intikhaab keejye', quickReplies)
      } else {
        message = statements.findBundles.romanurdu
      }
      return simpleMessageResponse(response, message, fallback)
    })
    .catch(err => {
      console.log(err)
      simpleMessageResponse(response, statements.globalerror.romanurdu, fallback)
    })
}

exports.findBundleInfoRoman = function (request, response) {
  let message = ''
  let packageName = request.body.queryResult.parameters.package
  let fallback = statements.fallback.romanurdu
  var promise = services.findServiceByName(packageName)
  promise
    .then(found => {
      if(!found) {
        message = statements.findBundleInfo.romanurdu
        return simpleMessageResponse(response, message, fallback)
      } else {
        message = found.name+ ', package ki maloomat hain:'
        +'\n \n On-net Minutes: ' + found.onNet
        +'\n Off-net Minutes: ' + found.offNet
        +'\n Internet: ' + found.internet
        +'\n SMS: ' + found.sms
        +'\n Price: ' + found.price
        +'\n Bill Cycle: ' + found.bill_cycle
        return quickRepliesResponse(response, message, '', ['Activate ' + found.name])
      }
    })
    .catch(err => {
      console.log(err)
      simpleMessageResponse(response, statements.globalerror.romanurdu, fallback)
    })
}

exports.activateBundleInfoRoman = function (request, response) {
  let message = ''
  let packageName = request.body.queryResult.parameters.package
  let fallback = statements.fallback.romanurdu
  let sessionId = request.body.session

  customers.findCustomerBySessionId(sessionId)
  .then(customer => {
    if (!customer) {
      message = 'Ap hamary system main signup nahi hain, ap abhi "Hi" likh ker sign up kerskty hain'
      return simpleMessageResponse(response, message, fallback)
    }
    else {
      services.findServiceByName(packageName)
      .then(found => {
        if(!found) {
          message = statements.findBundleInfo.romanurdu
          return simpleMessageResponse(response, message, fallback)
        } else {
            var userPromise = customers.updatePackageRoman(customer.phone, found._id)
            userPromise.then(updated => {
              if(!updated) {
                message = statements.updatePackage.romanurdu
              } else {
                message = 'Ap ky mojooda number ' + customer.phone +
                '\n per ' + found.name +
                '\n package activate kerdia gaya hy'
              }
            return simpleMessageResponse(response, message, fallback)
          })
          .catch(err => {
            console.log(err)
            simpleMessageResponse(response, statements.globalerror.romanurdu, fallback)
          })
        }
      })
      .catch(err => {
        console.log(err)
        simpleMessageResponse(response, statements.globalerror.romanurdu, fallback)
      })  
    }
  })
}

exports.deActivateBundleRoman = function (request, response) {
  let message = ''
  let fallback = statements.fallback.romanurdu
  let sessionId = request.body.session

  customers.findCustomerBySessionId(sessionId)
  .then(customer => {
    if (!customer) {
      message = 'Ap hamary system main signup nahi hain, ap abhi "Hi" likh ker sign up kerskty hain'
      return simpleMessageResponse(response, message, fallback)
    }
    else { 
      customers.updatePackageRoman(customer.phone, 'deActivatePackage')
      .then(deleted => {
        if(!deleted) {
          message = statements.deletePackage.romanurdu
        } else {
          message = 'Ap ky mojooda number ' + customer.phone +
          '\n sy package de-activate kerdia gaya hy'
        }
        return simpleMessageResponse(response, message, fallback)
      })
      .catch(err => {
        console.log(err)
        simpleMessageResponse(response, statements.globalerror.romanurdu, fallback)
      })
    }
  })
  .catch(err => {
    console.log(err)
    simpleMessageResponse(response, statements.globalerror.romanurdu, fallback)
  })
}

exports.signUpTheCustomer = function (request, response) {
  let message = 'thank you for sign up'
  let otp = request.body.queryResult.parameters.otp
  let phone = request.body.queryResult.parameters.phone
  let language = request.body.queryResult.parameters.Language
  let sessionId = request.body.session
  let languageCode = 'urdu'
  let fallback = statements.fallback.urdu
  if (language === 'Roman Urdu') languageCode = 'romanurdu'
  if (language === 'English') languageCode = 'english'
  if (util.customerDb.otps.indexOf(otp) < 0) {
    message = statements.wrongotp[languageCode]
    fallback = statements.fallback[languageCode]
    return simpleMessageResponse(response, message, fallback)
  }
  customers.insertNewCustomer({
    phone, language, sessionId
  }, (err, customer) => {
    if (err) {
      message = statements.globalerror[languageCode]
      fallback = statements.fallback[languageCode]
      return simpleMessageResponse(response, message, fallback)
    }
    if (customer.exists) {
      message = statements.signup.exists[languageCode]
      fallback = statements.fallback[languageCode]
      return simpleMessageResponse(response, message, fallback)
    } else {
      message = statements.signup.success[languageCode]
      fallback = statements.fallback[languageCode]
      return simpleMessageResponse(response, message, fallback)
    }
  })
}

exports.showServices = function (request, response) {
  let message = 'Sorry, I am unable to answer this for now. Please contact admin'
  let fallback = statements.fallback.english
  console.log(request.body.queryResult.parameters)
  return simpleMessageResponse(response, message, fallback)
}

exports.fetchComplaintIdsEnglish = function (request, response) {
  let message = ''
  let fallback = statements.fallback.english
  let sessionId = request.body.session

  customers.findCustomerBySessionId(sessionId)
  .then(found => {
    console.log(found)
      if (!found) {
        message = statements.findCustomer.english
        return simpleMessageResponse(response, message, fallback)
      }
      return Complaint.fetchComplaintByCustomer(found._id)
    })
  .then(complaints => {
    console.log(complaints)
    if (complaints.length > 0) {
      message = `your complaint ID's are : `
      let quickReplies = []
      complaints.forEach(complain => {
        quickReplies.push(complain.complaintId)
      })
      return quickRepliesResponse(response, '', 'Please select complaint Id', quickReplies)
    } else {
      message = statements.complaints.english
      return simpleMessageResponse(response, message, fallback)
    }
  })
  .catch(err => {
    console.log(err)
    simpleMessageResponse(response, statements.globalerror.romanurdu, fallback)
  })
}

exports.checkComplaintStatusEnglish = function (request, response) {
  let message = ''
  let complaintId = request.body.queryResult.parameters.complaintid
  let fallback = statements.fallback.english
  var promise = Complaint.fetchcomplaint(complaintId)
  promise
    .then(complaint => {
      if(!complaint) {
        message = statements.complain.notExists.english
        return simpleMessageResponse(response, message, fallback)
      } else {
        message =  'your complain description is: ' +complaint.description+
        '\n and your complaint status: ' +complaint.status
        Complaint.fetchComplaintByCustomer(complaint.customer)
        .then(complaints => {
          if (complaints.length > 0) {
            let quickReplies = []
            complaints.forEach(complain => {
              if(complain.complaintId != complaint.complaintId) {
                quickReplies.push(complain.complaintId)
              }
            })
            return quickRepliesResponse(response, message, 'Your other complaints are', quickReplies)
          } else {
            message = statements.complaints.english
            return simpleMessageResponse(response, message, fallback)
          }
        })
        .catch(err => {
          console.log(err)
          message = statements.globalerror.english
          return simpleMessageResponse(response, message,fallback)
        })
      } 
    })
    .catch(err => {
      console.log(err)
      message = statements.globalerror.english
      return simpleMessageResponse(response, message, fallback)
    })
}

exports.updateCustomerLanguageEnglish = function (request, response) {
  let message = ''
  let language = request.body.queryResult.parameters.Language
  let fallback = statements.fallback.english
  let sessionId = request.body.session

  customers.editLanguage(sessionId, language)
  .then(updated => {
    if(!updated) {
      message = statements.updateLanguage.english
    } else {
      message = 'We have set your Language to ' + language
    }
      return simpleMessageResponse(response, message, fallback)
  })
  .catch(err => {
    console.log(err)
    message = statements.globalerror.english
    return simpleMessageResponse(response, message, fallback)
  })
}

exports.registerComplaint = function (request, response) {
  let message = 'Thank you.'
  let complaint = request.body.queryResult.parameters.complain
  let language = 'English' // for now, change it later
  let languageCode = 'urdu'
  let fallback = statements.fallback.urdu
  let sessionId = request.body.session

  if (language === 'Roman Urdu') languageCode = 'romanurdu'
  if (language === 'English') languageCode = 'english'
  Complaint.insertNewComplaint({
    sessionId, complaint
  }, (err, result) => {
    if (err) {
      message = statements.globalerror[languageCode]
      fallback = statements.fallback[languageCode]
      return simpleMessageResponse(response, message,fallback)
    }
    if (!result.exists) {
      message = statements.nocustomer[languageCode]
      fallback = statements.fallback[languageCode]
      return simpleMessageResponse(response, message, fallback)
    } else {
      message = 'Complaint Id: ' + result.complaintId
      fallback = statements.fallback[languageCode]
      return simpleMessageResponse(response, message, fallback)
    }
  })
}

function simpleMessageResponse(response, message, fallback) {
  console.log('Response going to Dialogflow')
  console.log(message)
  response.status(200).json({
    fulfillmentMessages: [
      {
        platform: 'FACEBOOK',
        text: {
          text: [
            message
          ]
        }
      },
      {
        platform: 'FACEBOOK',
        quickReplies: fallback
      }
    ]
  });
}

function quickRepliesResponse(response, message, title, quickReplies) {
  response.status(200).json({
    fulfillmentMessages: [
      {
        platform: 'FACEBOOK',
        text: {
          text: [
            message
          ]
        }
      },
      {
        platform: 'FACEBOOK',
        quickReplies: {
          title: title,
          quickReplies: quickReplies
        }
      }
    ]
  })
}
