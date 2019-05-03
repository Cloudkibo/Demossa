let mongoose = require('mongoose')

let customers = require('../models/customers.model')
let complains = require('../models/complains.model')
let services = require('../models/services.model')

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
        name: '2000 Jazz + Warid Minutes',
        onNet: '300 Other Network Minutes',
        offNet: '500 Other Network Minutes',
        internet: '1000 MB',
        sms: '300',
        price: 599,
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
        name: 'J999',
        onNet: 'Unlimited Jazz + Warid Minutes',
        offNet: '500 Other Network Minutes',
        internet: '7000 MB',
        sms: '7000',
        price: 899,
        bill_cycle: 'monthly'
    }
]

var customersData = [
    {
        phone: '+923004132126',
        service_usage: {
            Sms: 3948,
            Data: 3847732,
            Onnet: 400,
            Offnet: 397,
          },
    },
    {
        phone: '+923008769876',
        service_usage: {
            Sms: 3948,
            Data: 3847732,
            Onnet: 400,
            Offnet:397,
          },
    }
]

var complainsData = [
    {
        status: 'open',
        description: 'description of the complaint',
    },
    {
        status: 'processing',
        description: 'description of the complaint',
    },
    {
        status: 'closed',
        description: 'description of the complaint',
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