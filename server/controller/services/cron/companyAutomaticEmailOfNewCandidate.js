const company = require('../../../model/mongoose/company');
const users = require('../../../model/mongoose/users');

const candidateSearch = require('../../../controller/api/users/candidate/searchCandidates');
const autoNotificationEmail = require('../email/emails/companyAutoNotification');

const logger = require('../logger');
const errors = require('../errors');
const filterReturnData = require('../../api/users/filterReturnData');

module.exports = async function () {

    await company.findAndIterate({
        saved_searches: { $exists: true, $ne : [] },
        "saved_searches.0.when_receive_email_notitfications": {$ne: "Never"}
    }, async function (companyDoc) {
        const userDoc = await users.findOne({_id : companyDoc._creator});
        console.log(userDoc);
        if(userDoc) {
            console.log(companyDoc.last_email_sent);
            console.log(new Date(Date.now() - convertToDays(companyDoc.saved_searches[0].when_receive_email_notitfications) * 24*60*60*1000));
            if(!companyDoc.last_email_sent || companyDoc.last_email_sent  <  new Date(Date.now() - convertToDays(companyDoc.saved_searches[0].when_receive_email_notitfications) * 24*60*60*1000)) {

                const savedSearch = companyDoc.saved_searches[0];
                let candidateDocs
                try {
                    candidateDocs = await candidateSearch.candidateSearch({
                        is_verify: 1,
                        status: 'approved',
                        disable_account: false,
                        firstApprovedDate: companyDoc.last_email_sent
                    }, {
                        skills: savedSearch.skills,
                        locations: savedSearch.location,
                        positions: savedSearch.position,
                        blockchains: savedSearch.blockchains,
                        salary: {
                            current_currency: savedSearch.current_currency,
                            current_salary: savedSearch.current_salary
                        },
                        availability_day: savedSearch.availability_day
                    });

                    let candidateList = [];
                    for ( let i = 0 ; i < candidateDocs.candidates.length; i++) {
                        const candidateInfo = {
                            url : candidateDocs.candidates[i]._creator._id,
                            why_work : candidateDocs.candidates[i].why_work,
                            initials : filterReturnData.createInitials(candidateDocs.candidates[i].first_name, candidateDocs.candidates[i].last_name),
                            programming_languages : candidateDocs.candidates[i].programming_languages
                        }
                        candidateList.push(candidateInfo);
                        console.log("Candidate list : " + candidateList);
                    }

                    let candidates;
                    if(candidateDocs.count > 0) {
                        if(candidateDocs.count  <= 10) {
                            candidates = {"count" : candidateDocs.count  , "list" : candidateList};
                        }
                        else {
                            candidates = {"count" : 'More than 10' , "list" : candidateList.slice(0, 10)};
                        }
                        await autoNotificationEmail.sendEmail(userDoc.email , companyDoc.first_name , companyDoc.company_name,candidates,userDoc.disable_account);
                        await company.update({_creator : companyDoc._creator} , {$set : {'last_email_sent' : new Date()}});
                    }
                    else {
                        logger.debug("Candidate list is empty");
                    }
                } catch (error) {
                    if (error.code === 404) {
                        logger.debug("No candidates found");
                    } else {
                        logger.error(error.message, {
                            stack: error.stack,
                            name: error.name
                        })
                    }
                }
            }
        }
        else {
            logger.error("User doc not found for company " + companyDoc._id);
        }
    })
}



const convertToDays = module.exports.convertToDays = function convertToDays(when_receive_email_notitfications) {
    switch(when_receive_email_notitfications) {
        case "Weekly":
            return 7;
            break;
        case "3 days":
            return 3;
            break;
        case "Daily":
            return 1;
            break;
        default :
            return 0;
            break;
    }
};

