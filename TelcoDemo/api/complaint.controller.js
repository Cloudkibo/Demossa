const Complaint = require('../models/complains.model')
const Customer = require('../models/customers.model')
const util = require('../utility')

exports.fetchcomplaint = (complaintId) => {
    return new Promise(function(resolve, reject) {
        Complaint.findOne({complaintId: complaintId}, (err, complaint) => {
            if (err) {
                reject('No complaint found with the given complaint id')
            } 
            else if (!complaint) {
                resolve('No complaint found with the given complaint id')
            } else {
                message = `your complaint status is' ${complaint.status}. `
                resolve(message)
            }
        })
    });   
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