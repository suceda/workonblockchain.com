const Schema = require('mongoose').Schema;
const regexes = require('../regexes');
const enumerations = require('../enumerations');

module.exports = new Schema({
    privacy_id: {
        type: Schema.Types.ObjectId,
        ref: 'pages_content'
    },
    terms_id: {
        type: Schema.Types.ObjectId,
        ref: 'pages_content'
    },
    marketing_emails: {
        type:Boolean,
        default:false
    },
    first_name: {
        type:String
    },
    last_name: {
        type:String
    },
    job_title: {
        type:String
    },
    company_name: {
        type:String
    },
    company_website: {
        type:String,
        validate: regexes.url
    },
    company_phone: {
        type:String
    },
    company_country: {
        type: String,
        enum: enumerations.countries
    },
    company_city: {
        type:String
    },
    company_postcode: {
        type:String
    },
    company_founded: {
        type:Number,
        min: 1800
    },
    no_of_employees: {
        type:Number,
        min: 1
    },
    company_funded: {
        type:String
    },
    company_logo: {
        type: String,
        validate: regexes.url
    },
    company_description: {
        type: String,
        maxlength: 3000
    },
    zohocrm_account_id: String,
    canadian_commercial_company: Boolean,
    usa_privacy_shield: Boolean,
    dta_doc_link: {
        type: String,
        validate: regexes.url
    },
    discount: Number,
    pricing_plan: {
        type: String,
        enum: enumerations.pricingPlans
    },
    history : {
        type : [{
            pricing_plan: {
                type: String,
                enum: enumerations.pricingPlans
            },
            discount: Number,
            timestamp: {
                type: Date,
                required:true,
            },
            updated_by: {
                type: Schema.Types.ObjectId,
                ref: "Users",
                required:true
            }
        }]
    },
    saved_searches: { // DELETE ME
        type:[new Schema({
            name: {
                type: String,
                required: true
            },
            work_type : {
                type: String,
                enum: enumerations.workTypes
            },
            location: {
                type: [{
                    city: {
                        type : Schema.Types.ObjectId,
                        ref: 'Cities'
                    },
                    remote: Boolean,

                }]
            },
            visa_needed: {
                type: Boolean,
                default:false,
            },
            job_type: {
                type: [{
                    type: String,
                    enum: enumerations.employmentTypes
                }]

            },
            position: {
                type: [{
                    type: String,
                    required : true,
                    enum: enumerations.workRoles
                }]
            },
            current_salary: {
                type:Number,
                min: 0
            },
            expected_hourly_rate: {
                type:Number,
                min: 0
            },
            current_currency: {
                type: String,
                enum: enumerations.currencies
            },
            required_skills: { //will containg blockchain & languages
                type:[new Schema({
                    skills_id: {
                        type : Schema.Types.ObjectId,
                        ref: 'Skills'
                    },
                    type: String,
                    name: String,
                    exp_year: Number
                })]
            },
            residence_country: {
                type: [{
                    type: String,
                    enum: enumerations.countries
                }]
            },
            other_technologies : {
                type : String
            },
            timestamp : {
                type : Date,
                required: true
            }
        })]
    }, // DELETE ME
    job_ids: [{
        type: Schema.Types.ObjectId,
        ref: 'Jobs',
    }],
    when_receive_email_notitfications : {
        type : String ,
        enum : enumerations.email_notificaiton
    },
    candidates_sent_by_email: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        sent: {
            type: Date,
            required: true
        }
    }],

    last_email_sent: {
        type: Date
    },

    _creator : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },


});