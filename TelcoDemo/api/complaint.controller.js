const Complaint = require('../models/complains.model')

exports.fetchcomplaint = (complaintId) = new Promise((resolve, reject) => {
    Complaint.findOne({complaintId: complaintId}, (err, complaint) => {
        if (err) {
            reject('No complaint found with the given complaint id')
        } else {
            message = `your complaint status is' ${complaint.status}. `
            resolve(message)
        }
    })
  })