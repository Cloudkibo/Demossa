const config = require('../config/environment')
const api_datasource = require('./api_data_source/complaint.datasource')
const mongo_datasource = require('./mongo_data_source/complaint.datasource')

exports.findComplaint = function (complaintId) {
    if (config.dataSource === 'api') {
        return api_datasource.findComplaintByIdApi(complaintId)
    } else {
        return mongo_datasource.findComplaintByIdMongo(complaintId)
    }
}

exports.findComplaintByCustomer = function (customerId) {
    if (config.dataSource === 'api') {
        return api_datasource.findComplaintByCustomerApi(customerId)
    } else {
        return mongo_datasource.findComplaintByCustomerMongo(customerId)
    }
}

exports.createComplaint = function (payload) {
    if (config.dataSource === 'api') {
        return api_datasource.create(payload)
    } else {
        return mongo_datasource.create(payload)
    }
}

// api_datasource.create({
//     customer: 'xIXndPUZyOYyeIcn',
//     complaintId: '32423423',
//     status: 'open',
//     description: 'I am not having the network',
//   })
//   .then(complaint => console.log(complaint))
//   .catch(err => console.log(err))

// api_datasource.findComplaintByIdApi('32423423')
// .then(complaint => console.log(complaint))
// .catch(err => console.log(err))

// api_datasource.findComplaintByCustomerApi('xIXndPUZyOYyeIcn')
// .then(complaint => console.log(complaint))
// .catch(err => console.log(err))