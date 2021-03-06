const company = require('../../../model/mongoose/companies');
const users = require('../../../model/mongoose/users');
const jobs = require('../../../model/mongoose/jobs');

const candidateSearch = require('../../api-v2/users/candidates/search/searchCandidates');
const autoNotificationEmail = require('../email/emails/companyAutoNotification');

const settings = require('../../../settings');
const objects = require('../objects');
const logger = require('../logger');
const filterReturnData = require('../../api-v2/users/filterReturnData');

module.exports = async function (companyId) {
    logger.debug('Running candidate auto-notification for company cron');

    let companySelector;

    if (companyId) {
        companySelector = {_creator: companyId}
    } else {
        let userIds = await users.find({type: 'company', disable_account: false, is_approved: 1}, {_id: 1});
        companySelector = {_creator : {$in : userIds},
            job_ids: { $exists: true, $ne : [] },
            when_receive_email_notitfications: {$ne: "Never"}
        }
    }

    logger.debug("Company selector", {selector: companySelector});

    await company.findAndIterate(companySelector, async function (companyDoc) {
        const userDoc = await users.findOne({_id : companyDoc._creator});
        if(userDoc && (userDoc.is_approved !== 1 || userDoc.disable_account) ) {
            logger.debug("Company is disabled, or not approved");
        }
        else if (userDoc) {
            logger.debug("Checking company " + companyDoc.company_name + " with user_id " + userDoc._id);
            const timestamp = Date.now();

            if(!companyDoc.last_email_sent || companyDoc.last_email_sent  <  new Date(timestamp - convertToDays(companyDoc.when_receive_email_notitfications) * 24*60*60*1000)) {
                let blacklist = [];
                for (let candidateSent of companyDoc.candidates_sent_by_email) {
                    blacklist.push(candidateSent.user);
                }

                logger.debug("Company preferences", companyDoc.job_ids);

                let candidateDocs;
                let foundCandidates = [];
                for (let job_id of companyDoc.job_ids) {
                    try {
                        const jobDoc = await jobs.findOneById(job_id);

                        candidateDocs = await candidateSearch.candidateSearch({
                            is_verify: 1,
                            status: 'approved',
                            disable_account: false,
                            blacklist: blacklist,
                            updatedAfter: jobDoc.modified
                        }, {
                            locations: jobDoc.location,
                            visa_needed: jobDoc.visa_needed,
                            positions: jobDoc.position,
                            required_skills: jobDoc.required_skills,
                            expected_salary_min: jobDoc.expected_salary_min,
                            expected_hourly_rate_min: jobDoc.expected_hourly_rate_min,
                            currency: jobDoc.currency,
                            work_type : jobDoc.work_type
                        });
                        if (candidateDocs) {
                            logger.debug("Candidate ids in search", candidateDocs.candidates.map( (candidate) => candidate._id));
                            for (let candidate of  candidateDocs.candidates) {
                                foundCandidates.push(candidate);
                            }
                        }
                    }
                    catch (error) {
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

                foundCandidates = objects.removeDuplicates(foundCandidates, '_id');
                logger.debug("All candidate ids found in search", foundCandidates.map( (candidate) => candidate._id));

                const candidateCount = foundCandidates.length >= 10 ? 10 : foundCandidates.length

                let candidates;
                if(candidateCount > 0) {
                    let candidateList = [], candidateLog = [];

                    for ( let i = 0 ; i < candidateCount; i++) {
                        const candidate = foundCandidates[i];
                        const url = settings.CLIENT.URL + 'candidate-detail?user=' + candidate._id;
                        const candidateInfo = {
                            url: url,
                            why_work: candidate.candidate.why_work,
                            initials: filterReturnData.createInitials(candidate.first_name, candidate.last_name),
                            programming_languages: candidate.candidate.programming_languages
                        };
                        candidateList.push(candidateInfo);
                        candidateLog.push({
                            user: candidate._id,
                            sent: timestamp
                        })
                    }
                    if(foundCandidates.length  <= 10) {
                        candidates = {"count" : candidateCount  , "list" : candidateList};
                    }
                    else {
                        candidates = {"count" : 'More than 10' , "list" : candidateList};
                    }
                    await autoNotificationEmail.sendEmail(userDoc.email , companyDoc.first_name , companyDoc.company_name,candidates,userDoc.disable_account);
                    await company.update({_creator : companyDoc._creator} , {
                        $set : {'last_email_sent' : timestamp},
                        $push: {'candidates_sent_by_email': candidateLog}
                    });
                }
                else {
                    logger.debug("Candidate list is empty");
                }

            } else {
                logger.debug("Company has recently been sent an email");
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
