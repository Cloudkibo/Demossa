const util = require('./../utility')
const Complaint = require('./../api/complaint.controller')

exports.currentPackageRoman = function (request, response) {
    let message = 'Sorry, I am unable to answer this for now. Please contact admin'
    let otp = request.body.queryResult.parameters.otp
    let phone = request.body.queryResult.parameters.phone
    if (util.customerDb.otps.indexOf(otp) < 0) {
      message = 'Wrong OTP, Please start again.'
    } else {
      let customer = util.customerDb.customers[phone]
      console.log(customer)
      message = `Your package is ${customer.current_package}. Your remaining sms are ${customer.Usage.Sms}, on-net minutes are ${customer.Usage.Onnet} and off-net minutes are ${customer.Usage.Offnet}. While your remaining data is ${customer.Usage.Data}`
    }
    response.status(200).json({ fulfillmentText: message });
}

exports.findBundleInfoRoman = function (request, response) {
    let message = 'Sorry, I am unable to answer this for now. Please contact admin'
    let packagePayload = util.package_db[request.body.queryResult.parameters.package]
    message = 'Information on ' + request.body.queryResult.parameters.package +
      '\n \n On-net Minutes: ' + packagePayload.onNet +
      '\n Off-net Minutes: ' + packagePayload.offNet +
      '\n Internet: ' + packagePayload.Internet + 
      '\n SMS: ' + packagePayload.SMS
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
          title: 'Package ko activate keejye',
          quickReplies: [
            'Activate ' + request.body.queryResult.parameters.package
          ]
        }
      }
    ] });
}

exports.showServices = function (request, response) {
    let message = 'Sorry, I am unable to answer this for now. Please contact admin'
    console.log(request.body.queryResult.parameters)
    response.status(200).json({ fulfillmentText: message });
}

exports.checkComplaintStatus = function(request, response) {
  let message = 'Sorry, I am unable to answer this for now. Please contact admin'
  let complaintId = request.body.queryResult.parameters.complaintId
  message = Complaint.fetchcomplaint(complaintId)
  response.status(200).json({ fulfillmentText: message })
}