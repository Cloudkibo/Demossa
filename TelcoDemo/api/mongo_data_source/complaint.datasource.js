const Complaint = require('../../models/complains.model')

exports.create = (payload) => {
    let obj = new Complaint(payload)
    return obj.save()
}

exports.findComplaintByIdMongo = function (complaintId) {
    return new Promise(function(resolve, reject) {
        Complaint.findOne({complaintId: complaintId}, (err, complaint) => {
            if (err) {
                reject(err)
            } 
            else {
                resolve(complaint)
            }
        })
    })
}

exports.findComplaintByCustomerMongo = function (customerId) {
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