const Complaint = require('../models/complains.model')

exports.fetchcomplaint = function (complaintId) {
    Complaint.findOne({complaintId: complaintId}, (err, complaint) => {
        if (err) {
            return {message: 'No complaint found with the given complaint id'}
        } else {
            message = `your complaint status is' ${complaint.status}. `
            return  message
        }
    })
}