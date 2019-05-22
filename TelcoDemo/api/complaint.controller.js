const Complaint = require('../models/complains.model')
const Customer = require('../models/customers.model')
const util = require('../utility')

exports.fetchcomplaint = (complaintId) => {
    return new Promise(function(resolve, reject) {
        Complaint.findOne({complaintId: complaintId}, (err, complaint) => {
            if (err) {
                reject(err)
            } else {
                resolve(complaint)
            }
        })
    });   
}

exports.fetchComplaintByCustomer = function(customerId) {
    return new Promise(function(resolve, reject) {
        Complaint.find({customer: customerId}, (err, complaints) => {
            if (err) {
                reject(err)
            } else {
                resolve(complaints)
            }
        })
    })
}

exports.insertNewComplaint = function (body, cb) {
    Customer.findOne({phone: body.phone}, (err, customer) => {
        if (err) {
            cb(err)
        }
        if (!customer) {
            return cb(null, {exists: false})
        }
        let complaintId = util.generateId(6)
        let newComplaint = new Complaint({
            customer: customer._id,
            description: body.complaint,
            complaintId: complaintId,
            status: 'open'
        })
        newComplaint.save((err, createdComplaint) => {
            if (err) {
                cb(err)
            }
            return cb(null, {exists: true, complaintId})
        })
    })
}