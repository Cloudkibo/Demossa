const util = require('./../utility')
const customers = require('./../api/customers.controller')
const Complaint = require('./../api/complaint.controller')
const services = require('./../api/services.controller')
const statements = require('./i13n').statements

exports.showServices = function (request, response) {
  let message = 'Sorry, I am unable to answer this for now. Please contact admin'
  let fallback = statements.fallback.english
  console.log(request.body.queryResult.parameters)
  return simpleMessageResponse(response, message, fallback)
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

exports.currentPackage = function (request, response) {
  let  message = ''
  let sessionId = request.body.session
  let languageCode = 'english'

  if (request.body.queryResult.intent.displayName === '0.1.1.my.current.package.roman') {
    languageCode = 'romanurdu'
  } 
  if (request.body.queryResult.intent.displayName === '0.1.3.my.current.package.urdu') {
    languageCode = 'urdu'
  }

  let fallback = statements.fallback[languageCode]

    customers.findCustomerBySessionId(sessionId)
    .then(customer => {
      if (!customer) {
        message = statements.findCustomer[languageCode]
        return simpleMessageResponse(response, message, fallback)
      }
      if(customer.current_service) {
        if(languageCode === 'romanurdu')  message = 'Apka mojooda package hei ' + customer.current_service.name
        if(languageCode === 'urdu') message = customer.current_service.name + 'آپ کا موجودہ پیکج ہے '
        if(languageCode === 'english') message = 'Your current package is ' + customer.current_service.name
       
      }
      else if(customer.service_usage) {
        if(languageCode === 'english') {
          message = 'Your current package is ' + customer.current_service.name
          + ' your remaining sms are ' + customer.service_usage.Sms
          + ', remaining on-net minutes are ' + customer.service_usage.Onnet
          + ' and remaining off-net minutes are ' + customer.service_usage.Offnet
          + '. while, your remaning data is ' + customer.service_usage.Data + '.'
        }
        if (languageCode === 'romanurdu'){
          message = 'Apka mojooda package hei ' + customer.current_service.name
          + ' ap ky baqaya sms hain ' + customer.service_usage.Sms
          + ', baqaya on-net minutes hain ' + customer.service_usage.Onnet
          + ' or baqaya off-net minutes hain ' + customer.service_usage.Offnet
          + '. jab k ap ka baqaya data hy ' + customer.service_usage.Data + '.'
        }
        if(languageCode === 'urdu') {
          message = customer.current_service.name + 'آپ کا موجودہ پیکج ہے '
          + customer.service_usage.Sms + 'آپ کے باقی ایس ایم ایس ہیں'
          + customer.service_usage.Onnet+ 'باقی اون نیٹ منٹ ہیں'
          + customer.service_usage.Offnet + 'اور باقی اوف نیٹ منٹس ہیں '
          + '.' + customer.service_usage.Data + 'حالانکہ، آپ کا بقایا ڈیٹا ہے '
        }
        
      } else {
        message = statements.findServiceOfCustomer[languageCode]
      }
      return simpleMessageResponse(response, message, fallback)
    })
    .catch(err => {
        console.log(err)
        simpleMessageResponse(response, statements.globalerror[languageCode], fallback)
      })
}

exports.findBundles = function (request, response) {
  let message = ''
  let languageCode = 'english'
  let quickReplyTitle = 'Please Select a Jazz Package'

  if (request.body.queryResult.intent.displayName === '0.2.1.find.and.activate.bundle.roman') {
    languageCode = 'romanurdu'
    quickReplyTitle = 'Jazz k packages ka intikhaab keejye'
  } 
  if (request.body.queryResult.intent.displayName === '0.2.3.find.and.activate.bundle.urdu') {
    languageCode = 'urdu'
    quickReplyTitle = 'جاز پیکیج منتخب کریں'
  }

  let fallback = statements.fallback[languageCode]

  var promise = services.findBundles()
  promise
    .then((bundles) => {
      if (bundles.length > 0) {
        let quickReplies = []
        bundles.forEach(element => {
          quickReplies.push(`${element.name}`)
        })
        return quickRepliesResponse(response, '', quickReplyTitle, quickReplies)
      } else {
        message = statements.findBundles[languageCode]
      }
      return simpleMessageResponse(response, message, fallback)
    })
    .catch(err => {
      console.log(err)
      simpleMessageResponse(response, statements.globalerror[languageCode], fallback)
    })
}

exports.findBundleInfo = function (request, response) {
  let message = ''
  let languageCode = 'english'
  let quickReplyTitle = 'Ativate the Package Right Now'
  let packageName = request.body.queryResult.parameters.package

  if (request.body.queryResult.intent.displayName === '0.2.1.find.bundle.roman') {
    languageCode = 'romanurdu'
    quickReplyTitle = 'Abhi package ko activate karain'
  } 
  if (request.body.queryResult.intent.displayName === '0.2.3.find.bundle.urdu') {
    languageCode = 'urdu'
    quickReplyTitle = 'ابھی سبسکرائب کریں '
  }

  let fallback = statements.fallback[languageCode]
  var promise = services.findServiceByName(packageName)
  promise
    .then(found => {
      if(!found) {
        message = statements.findBundleInfo[languageCode]
        return simpleMessageResponse(response, message, fallback)
      } else {
        let temp = []
        if(languageCode === 'romanurdu') {
          temp = ['Activate ' + found.name]
          message = found.name+ ', package ki maloomat hain:'
          +'\n \n On-net Minutes: ' + found.onNet
          +'\n Off-net Minutes: ' + found.offNet
          +'\n Internet: ' + found.internet
          +'\n SMS: ' + found.sms
          +'\n Price: ' + found.price
          +'\n Bill Cycle: ' + found.billCycle
        }
        if(languageCode === 'english') {
          temp = ['Activate ' + found.name]
          message = found.name+ ', information is:'
          +'\n \n On-net Minutes: ' + found.onNet
          +'\n Off-net Minutes: ' + found.offNet
          +'\n Internet: ' + found.internet
          +'\n SMS: ' + found.sms
          +'\n Price: ' + found.price
          +'\n Bill Cycle: ' + found.billCycle
        }
        if(languageCode === 'urdu') {
          temp = ['سبسکرائب ' + found.name]
          message =`,  معلومات ${found.name}`
          +`\n ${found.onNet} : اون نیٹ منٹس `
          +`\n ${found.offNet} : اوف نیٹ منٹس `
          +`\n ${found.internet} : انٹرنیٹ `
          +`\n ${found.sms} : ایس ایم ایس `
          +`\n ${found.price} قیمت `
          +`\n ${found.billCycle} بل سائیکل `
        }
        return quickRepliesResponse(response, message, quickReplyTitle, temp)
      }
    })
    .catch(err => {
      console.log(err)
      simpleMessageResponse(response, statements.globalerror[languageCode], fallback)
    })
}

exports.activateBundle = function (request, response) {
  let message = ''
  let languageCode = 'english'
  let packageName = request.body.queryResult.parameters.package
  let sessionId = request.body.session

  if (request.body.queryResult.intent.displayName === '0.2.1.activate.bundle.roman') {
    languageCode = 'romanurdu'
  } 
  if (request.body.queryResult.intent.displayName === '0.2.3.activate.bundle.urdu') {
    languageCode = 'urdu'
  }

  let fallback = statements.fallback[languageCode]
  customers.findCustomerBySessionId(sessionId)
  .then(customer => {
    if (!customer) {
      message = statements.findCustomer[languageCode]
      return simpleMessageResponse(response, message, fallback)
    }
    else {
      console.log("cusotomers", customer)
      services.findServiceByName(packageName)
      .then(found => {
        if(!found) {
          message = statements.findBundleInfo[languageCode]
          return simpleMessageResponse(response, message, fallback)
        } else {
            var userPromise = customers.updatePackageRoman(customer.phone, found._id)
            userPromise.then(updated => {
              if(!updated) {
                message = statements.updatePackage[languageCode]
              } else {
                if(languageCode === 'romanurdu') {
                  message = 'Ap ky mojooda number ' + customer.phone +
                  '\n per ' + found.name +
                  '\n package activate kerdia gaya hy'
                }
                if(languageCode === 'english') {
                  message = 'We have activated the Package '+ found.name
                  + ' on you number, ' + customer.phone
                }
                if(languageCode === 'urdu') {
                  message = 'پر سبسکرائب کردیا ھے ' + customer.phone+ ' پیکج آپ کے نمبر ' + found.name
                }
              }
            return simpleMessageResponse(response, message, fallback)
          })
          .catch(err => {
            console.log(err)
            simpleMessageResponse(response, statements.globalerror[languageCode], fallback)
          })
        }
      })
      .catch(err => {
        console.log(err)
        simpleMessageResponse(response, statements.globalerror[languageCode], fallback)
      })  
    }
  })
}

exports.registerComplaint = function (request, response) {
  let message = ''
  let complaint = request.body.queryResult.parameters.complain
  let language = 'English' // for now, change it later
  let languageCode = 'english'
  let sessionId = request.body.session

  if (request.body.queryResult.intent.displayName === '0.3.2.register.complaint.roman') {
    languageCode = 'romanurdu'
  }
  if (request.body.queryResult.intent.displayName === '0.3.3.register.complaint.urdu') {
    languageCode = 'urdu'
  } 

  let fallback = statements.fallback[languageCode]

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
      if(languageCode === 'english') {
        message = 'your compalint is registered. Here is your Complaint Id: ' + result.complaintId
      } 
      if(languageCode === 'romanurdu') {
        message = 'Apki complaint registerd hochuki hy.'+ result.complaintId
        +' yeh ap ki Complaint Id hy' 
      } 
      if(languageCode === 'urdu') {
        message = ' یہ آپکی شکایت کی شناخت ہے '+  result.complaintId +' آپکی شکایت رجسٹر ہوچکی ہے'
         
      } 
      fallback = statements.fallback[languageCode]
      return simpleMessageResponse(response, message, fallback)
    }
  })
}

exports.updateCustomerLanguage = function (request, response) {
  let message = ''
  let languageCode = 'english'
  let language = request.body.queryResult.parameters.Language
  let sessionId = request.body.session
  if (request.body.queryResult.intent.displayName === '0.4.2.update.language.roman') {
    languageCode = 'romanurdu'
  } 
  if (request.body.queryResult.intent.displayName === '0.4.3.update.language.urdu') {
    languageCode = 'urdu'
  }

  let fallback = statements.fallback[languageCode]
  customers.editLanguage(sessionId, language)
  .then(updated => {
    if(!updated) {
      message = statements.updateLanguage[languageCode]
    } else {
      if(languageCode === 'english') {
        message = 'We have set your Language to ' + language
      }
      if(languageCode === 'romanurdu') {
        message = 'hum ny ap ki language,' + language + ', set kerdi hy'
      }
      if(languageCode === 'urdu') {
        message = 'سیٹ کردی ہے' + language+ ' ھم نے آپکی زبان '
      }
    }
      return simpleMessageResponse(response, message, fallback)
  })
  .catch(err => {
    console.log(err)
    message = statements.globalerror[languageCode]
    return simpleMessageResponse(response, message, fallback)
  })
}

exports.deActivateBundle = function (request, response) {
  let message = ''
  let languageCode = 'english'
  let sessionId = request.body.session

  if (request.body.queryResult.intent.displayName === '0.5.1.deactivate.bundle.roman') {
    languageCode = 'romanurdu'
  } 
  if (request.body.queryResult.intent.displayName === '0.5.2.deactivate.bundle.urdu') {
    languageCode = 'urdu'
  }

  let fallback = statements.fallback[languageCode]
  customers.findCustomerBySessionId(sessionId)
  .then(customer => {
    if (!customer) {
      message = statements.findCustomer[languageCode]
      return simpleMessageResponse(response, message, fallback)
    }
    else { 
      customers.updatePackageRoman(customer.phone, 'deActivatePackage')
      .then(deleted => {
        if(!deleted) {
          message = statements.deletePackage[languageCode]
        } else {
          if(languageCode === 'english') {
            message = 'we have de-activated the package from you number ' + customer.phone
          }
          if(languageCode === 'romanurdu') {
            message = 'Ap ky mojooda number ' + customer.phone +
            '\n sy package de-activate kerdia gaya hy'
          }
          if(languageCode === 'urdu') {
            message = 'آپکے موجودا نمبر سے  ' + customer.phone +
            '\n پیکج ختم کردیا گیا ہے '
          }
        }
        return simpleMessageResponse(response, message, fallback)
      })
      .catch(err => {
        console.log(err)
        simpleMessageResponse(response, statements.globalerror[languageCode], fallback)
      })
    }
  })
  .catch(err => {
    console.log(err)
    simpleMessageResponse(response, statements.globalerror.romanurdu, fallback)
  })
}

exports.fetchComplaintIds = function (request, response) {
  let message = ''
  let languageCode = 'english'
  let quickReplyTitle = 'Please select complaint Id'
  let sessionId = request.body.session

  if (request.body.queryResult.intent.displayName === '0.6.2.fetch.complaintId.roman') {
    languageCode = 'romanurdu'
    quickReplyTitle = 'complaint id ko select karain'
  } 
  if (request.body.queryResult.intent.displayName === '0.6.3.fetch.complaintId.urdu') {
    languageCode = 'urdu'
    quickReplyTitle = 'شکایت کی شناخت کا انتخاب کریں'
  }
  let fallback = statements.fallback[languageCode]

  customers.findCustomerBySessionId(sessionId)
  .then(found => {
      if (!found) {
        message = statements.findCustomer[languageCode]
        return simpleMessageResponse(response, message, fallback)
      }
      return Complaint.fetchComplaintByCustomer(found._id)
    })
  .then(complaints => {
    if (complaints.length > 0) {
      let quickReplies = []
      complaints.forEach(complain => {
        quickReplies.push(complain.complaintId)
      })
      console.log(quickReplies)
      return quickRepliesResponse(response, '', quickReplyTitle, quickReplies)
    } else {
      message = statements.complaints[languageCode]
      return simpleMessageResponse(response, message, fallback)
    }
  })
  .catch(err => {
    console.log(err)
    simpleMessageResponse(response, statements.globalerror[languageCode], fallback)
  })
}

exports.checkComplaintStatus = function (request, response) {
  let message = ''
  let languageCode = 'english'
  let quickReplyTitle = 'Your other complaints are'
  let complaintId = request.body.queryResult.parameters.complaintid

  if (request.body.queryResult.intent.displayName === '0.6.2.fetch.complaint.status.roman') {
    languageCode = 'romanurdu'
    quickReplyTitle = 'ap ki dosri complaints hain'
  } 
  if (request.body.queryResult.intent.displayName === '0.6.3.fetch.complaint.status.urdu') {
    languageCode = 'urdu'
    quickReplyTitle = 'آپ کی دوسری شکایتیں ہیں'
  }

  let fallback = statements.fallback[languageCode]
  var promise = Complaint.fetchcomplaint(complaintId)
  promise
    .then(complaint => {
      if(!complaint) {
        message = statements.complain.notExists[languageCode]
        return simpleMessageResponse(response, message, fallback)
      } else {
        if(languageCode === 'english') {
          message =  'your complain description is: ' +complaint.description+
          '\n and your complaint status: ' +complaint.status
        }
        if(languageCode === 'romanurdu') {
          message =  'apki shikayat hy: ' +complaint.description+
        '\n or apki shikyat ka status: ' +complaint.status
        }
        if(languageCode === 'urdu') {
          message =  'آپکی شکایت ہے : ' +complaint.description+
        '\n اور آپکی شکایت کا سٹیٹس ہے : ' +complaint.status
        }
        Complaint.fetchComplaintByCustomer(complaint.customer)
        .then(complaints => {
          if (complaints.length > 0) {
            let quickReplies = []
            complaints.forEach(complain => {
              if(complain.complaintId != complaint.complaintId) {
                quickReplies.push(complain.complaintId)
              }
            })
            if(quickReplies.length == 1) {
              quickReplyTitle = ''
            }
            return quickRepliesResponse(response, message, quickReplyTitle, quickReplies)
          } else {
            message = statements.complaints[languageCode]
            return simpleMessageResponse(response, message, fallback)
          }
        })
        .catch(err => {
          console.log(err)
          message = statements.globalerror[languageCode]
          return simpleMessageResponse(response, message,fallback)
        })
      } 
    })
    .catch(err => {
      console.log(err)
      message = statements.globalerror[languageCode]
      return simpleMessageResponse(response, message, fallback)
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
        quickReplies: {
          title: title,
          quickReplies: quickReplies
        }
      }
    ]
  })
}
