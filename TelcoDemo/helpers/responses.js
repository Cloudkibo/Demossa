const util = require('./../utility')
const customers = require('./../api/customers.controller')
const Complaint = require('./../api/complaint.controller')
const services = require('./../api/services.controller')
const statements = require('./i13n').statements

exports.currentPackageRoman = function (request, response) {
    let message = 'Sorry, I am unable to answer this for now. Please contact admin'
    let otp = request.body.queryResult.parameters.otp
    let phone = request.body.queryResult.parameters.phone
    if (util.customerDb.otps.indexOf(otp) < 0) {
      message = statements.wrongotp['romanurdu']
    } else {
      var promise = customers.currentPackage(phone)
  promise
  .then((message) => {
    return simpleMessageResponse(response, message)
  })
}
}

exports.findBundlesRoman = function (request, response) {
  let message = 'Sorry, I am unable to answer this for now. Please contact admin'
  var promise = services.findBundles()
  promise
  .then((bundles) => {
    if(bundles.length > 0) {
      let quickReplies = []
      bundles.forEach(element => {
        quickReplies.push(`${element.name}`)
      })
      return quickRepliesResponse(response, '', 'Jazz k packages ka intikhaab keejye', quickReplies )
    } else {
      message = 'filhal, koi package available nahi hain'
    }
    return simpleMessageResponse(response, message)
  })
}

exports.findBundleInfoRoman = function (request, response) {
    let message = 'Sorry, I am unable to answer this for now. Please contact admin'
    let packageName = request.body.queryResult.parameters.package
    var promise = services.findServiceByName(packageName)
    promise
    .then((found) => {
      message = 'Information on ' + found.name +
      '\n \n On-net Minutes: ' + found.onNet +
      '\n Off-net Minutes: ' + found.offNet +
      '\n Internet: ' + found.internet + 
      '\n SMS: ' + found.sms +
      '\n Price: ' + found.price +
      '\n Bill Cycle: ' + found.bill_cycle
      return quickRepliesResponse(response, message, '', ['Activate ' + found.name] )
    })
}

exports.activateBundleInfoRoman = function (request, response) {
  let message = 'Sorry, I am unable to answer this for now. Please contact admin'
  let packageName = request.body.queryResult.parameters.package
  let phone =  request.body.queryResult.parameters.phone
  let otp =  request.body.queryResult.parameters.otp
  if (util.customerDb.otps.indexOf(otp) < 0) {
    message = statements.wrongotp['romanurdu']
    return simpleMessageResponse(response, message)
  } else {
    var servicePromise = services.findServiceByName(packageName)
    servicePromise
    .then((found) => {
      var userPromise = customers.updatePackageRoman(phone, found._id)
      userPromise.then((updated) => {
        message = 'Ap ky mojooda number ' + phone +
        '\n per ' + found.name +
        '\n package activate kerdia gaya hy'
        return simpleMessageResponse(response, message)
      })
    })
  }
}

exports.deActivateBundleRoman = function (request, response) {
  let message = 'Sorry, I am unable to answer this for now. Please contact admin'
  let phone =  request.body.queryResult.parameters.phone
  let otp =  request.body.queryResult.parameters.otp

  if (util.customerDb.otps.indexOf(otp) < 0) {
    message = statements.wrongotp['romanurdu']
    return simpleMessageResponse(response, message)
  } else {
    var Promise = customers.updatePackageRoman(phone, 'deActivatePackage')
    Promise.then((deleted) => {
      message = 'Ap ky mojooda number ' + phone +
      '\n sy package de-activate kerdia gaya hy'
      return simpleMessageResponse(response, message)
    })
  }
}

exports.signUpTheCustomer = function (request, response) {
    let message = 'thank you for sign up'
    let otp = request.body.queryResult.parameters.otp
    let phone = request.body.queryResult.parameters.phone
    let language = request.body.queryResult.parameters.Language
    let languageCode = 'urdu'
    if (language === 'Roman Urdu') languageCode = 'romanurdu'
    if (language === 'English') languageCode = 'english'
    if (util.customerDb.otps.indexOf(otp) < 0) {
      message = statements.wrongotp[languageCode]
      return simpleMessageResponse(response, message)
    }
    customers.insertNewCustomer({
      phone, language
    }, (err, customer) => {
      if (err) {
        message = statements.globalerror[languageCode]
        return simpleMessageResponse(response, message)
      }
      if (customer.exists) {
        message = statements.signup.exists[languageCode]
        return simpleMessageResponse(response, message)
      } else {
        message = statements.signup.success[languageCode]
        return simpleMessageResponse(response, message)
      }
    })
}

exports.showServices = function (request, response) {
    let message = 'Sorry, I am unable to answer this for now. Please contact admin'
    console.log(request.body.queryResult.parameters)
    return simpleMessageResponse(response, message)
}

exports.fetchComplaintIds = function(request, response) {
  let message = 'Sorry, I am unable to answer this for now. Please contact admin'
  let phone = request.body.queryResult.parameters.phone
  let otp = request.body.queryResult.parameters.otp

  if (util.customerDb.otps.indexOf(otp) < 0) {
    message = statements.wrongotp['romanurdu']
  } else {
    var promise = customers.findCustomer(phone)
    promise.then(found => {
      if(!found) {
        message = 'We dont have any customer in our system with this number'
        return simpleMessageResponse(response, message)
      }
      return promiseComplaints = Complaint.fetchComplaintByCustomer(found._id)
    })
    .then(complaints => {
      if(complaints.length > 0) {
        message = `your complaint ID's are : `
      let quickReplies = []
      complaints.forEach(complain => {
        quickReplies.push(complain.complaintId)
        // message += complain.complaintId+', '
      })
      // message += 'please type update on my complaint to see the status of any complaint.'
      return quickRepliesResponse(response, '', 'Please select complaint Id', quickReplies )
    } else {
      message = 'currently there is no registered complaint with this phone number'
      return simpleMessageResponse(response, message)
    }
    })
    .catch((err) => {
      message = 'We dont have any customer in our system with this number'
      return simpleMessageResponse(response, message)
    })
  }
  // let complaintId = request.body.queryResult.parameters.complaintId
  // var promise = Complaint.fetchcomplaint(complaintId)
  // promise
  // .then((message) => {
  //   return simpleMessageResponse(response, message)
  // })
}

exports.checkComplaintStatus = function(request, response) {
  let message = 'Sorry, I am unable to answer this for now. Please contact admin'
  let complaintId = request.body.queryResult.parameters.complaintid
  var promise = Complaint.fetchcomplaint(complaintid)
    promise
    .then((message) => {
      return simpleMessageResponse(response, message)
    })
}

exports.updateCustomerLanguage = function(request, response) {
  let message = 'Sorry, I am unable to answer this for now. Please contact admin'
  let phone = request.body.queryResult.parameters.phone
  let language = request.body.queryResult.parameters.Language
  var promise = customers.editLanguage(phone, language)
  promise
  .then((message) => {
    return simpleMessageResponse(response, message)
  })
}

exports.registerComplaint = function (request, response) {
  let message = 'Thank you.'
  let otp = request.body.queryResult.parameters.otp
  let phone = request.body.queryResult.parameters.phone
  let complaint = request.body.queryResult.parameters.complain
  let language = 'English' // for now, change it later
  let languageCode = 'urdu'
  if (language === 'Roman Urdu') languageCode = 'romanurdu'
  if (language === 'English') languageCode = 'english'
  if (util.customerDb.otps.indexOf(otp) < 0) {
    message = statements.wrongotp[languageCode]
    return simpleMessageResponse(response, message)
  }
  Complaint.insertNewComplaint({
    phone, complaint
  }, (err, result) => {
    if (err) {
      message = statements.globalerror[languageCode]
      return simpleMessageResponse(response, message)
    }
    if (!result.exists) {
      message = statements.nocustomer[languageCode]
      return simpleMessageResponse(response, message)
    } else {
      message = 'Complaint Id: ' + result.complaintId
      return simpleMessageResponse(response, message)
    }
  })
}

function simpleMessageResponse (response, message) {
  console.log('Response going to Dialogflow')
  console.log(message)
  response.status(200).json({ fulfillmentMessages: [
    {
      platform: 'FACEBOOK',
      text: {
        text: [
          message
        ]
      }
    }
  ] });
}

function quickRepliesResponse (response, message , title , quickReplies) {
  response.status(200).json({ fulfillmentMessages: [
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