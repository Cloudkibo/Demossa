let mongoose = require('mongoose')

let customers = require('../models/customers.model')
let complains = require('../models/complains.model')
let services = require('../models/services.model')
let util = require('../utility')

var servicesData= [
    {
        name: 'J300',
        onNet: '1000 Jazz + Warid Minutes',
        offNet: '150 Other Network Minutes',
        internet: '500 MB',
        sms: '150',
        price: 300,
        bill_cycle: 'monthly'
    },
    {
        name: 'J600',
        onNet: '2500 Other Network Minutes',
        offNet: '500 Other Network Minutes',
        internet: '2000 MB',
        sms: '600',
        price: 600,
        bill_cycle: 'monthly'
    },
    {
        name: 'J999',
        onNet: 'Unlimited Jazz + Warid Minutes',
        offNet: '500 Other Network Minutes',
        internet: '2000 MB',
        sms: '1000',
        price: 699,
        bill_cycle: 'monthly'
    },
    {
        name: 'J1500',
        onNet: 'Unlimited Jazz + Warid Minutes',
        offNet: '500 Other Network Minutes',
        internet: '7000 MB',
        sms: '7000 SMS',
        price: 800,
        bill_cycle: 'monthly'
    }
]

var customersData = [
    // {
    //     phone: '+923004132126',
    //     service_usage: {
    //         Sms: '3948',
    //         Data: '4500 MB',
    //         Onnet: '400',
    //         Offnet: '397',
    //       },
    // },
    // {
    //     phone: '+923008769876',
    //     service_usage: {
    //         Sms: "3948",
    //         Data: "2600 MB",
    //         Onnet: "400",
    //         Offnet:'397',
    //       },
    // }
]

var complainsData = [
    {
        complaintId: util.generateId(6),
        status: 'open',
        description: 'description of the complaint'
    },
    {
        complaintId: util.generateId(6),
        status: 'processing',
        description: 'description of the complaint'
    },
    {
        complaintId: util.generateId(6),
        status: 'closed',
        description: 'description of the complaint'
    }
]

function seedDb() {
    services.remove({}, (err, result) => {
        if(err) console.log(err)
        else {
            services.insertMany(servicesData, {ordered: true}, (err, insertedServices) => {
                if(err) console.log(err)
                else {
                    customers.remove({}, (err, result) => {
                        if(err) console.log(err)
                        else {
                            customersData.forEach(customer => {
                                customer.current_service = insertedServices[0]
                            })
                            customers.insertMany(customersData, {ordered: true}, (err, insertedCustomers) => {
                                if(err) console.log(err)
                                else {
                                    complains.remove({}, (err, result) => {
                                        if(err) console.log(err)
                                        else {
                                            complainsData.forEach(complains => {
                                                complains.customer = insertedCustomers[0]
                                            })
                                            complains.insertMany(complainsData, {ordered: true}, (err, insetedComplains) => {
                                                if(err) console.log(err)
                                            })
                                        } 
                                    })

                                }
                            })

                        }
                    })
                }
            })
        }
    })
}

module.exports = seedDb

