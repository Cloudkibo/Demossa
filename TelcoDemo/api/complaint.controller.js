const datalayer = require('./complaint.datalayer')
const customerDatalayer = require('./customers.datalayer')
const util = require('../utility')

exports.fetchcomplaint = (complaintId) => {
    return datalayer.findComplaint(complaintId)
}

exports.fetchComplaintByCustomer = function(customerId) {
    return datalayer.findComplaintByCustomer(customerId)
}

exports.insertNewComplaint = function (body, cb) {
    customerDatalayer.findCustomer(body.phone)
    .then(customer => {
        if (!customer) {
            return cb(null, {exists: false})
        }
        let complaintId = util.generateId(6)
        return datalayer.createComplaint({
            customer: customer._id,
            description: body.complaint,
            complaintId: complaintId,
            status: 'open'
        })
    })
    .then(complaint => {
        cb(null, {exists: true, complaintId: complaint.complaintId})
    })
    .catch(err => cb(err))
}