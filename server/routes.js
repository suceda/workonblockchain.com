const express = require('express');
const router = express.Router();
const multer = require('./controller/middleware/multer');

const healthCheck = require('./controller/api/healthCheck.controller');

const authAthenticate = require('./controller/api/users/auth/authenticate.controller');
const authVerifyEmail = require('./controller/api/users/auth/verifyEmail.controller');
const authForgotPassword = require('./controller/api/users/auth/forgotPassword.controller');
const authChangePassword = require('./controller/api/users/auth/changePassword.controller');
const authResetPassword = require('./controller/api/users/auth/resetPassword.controller');
const authVerifyClient = require('./controller/api/users/auth/verifyClient.controller');

const refReferredEmail = require('./controller/api/users/referrals/referredEmail.controller');
const refGetReferralCode = require('./controller/api/users/referrals/getReferralCode.controller');
const refReferral = require('./controller/api/users/referrals/referral.controller');

const candidateRegister = require('./controller/api/users/candidate/register.controller');
const candidateDelete = require('./controller/api/users/candidate/delete.controller');
const candidateGetAll = require('./controller/api/users/candidate/getAll.controller');
const candidateGetCurrent = require('./controller/api/users/candidate/getCurrent.controller');
const candidateImage = require('./controller/api/users/candidate/image.controller');
const candidateReferred = require('./controller/api/users/candidate/referred_id.controller');
const candidateUpdate = require('./controller/api/users/candidate/updateProfile.controller');
const candidateWizardAbout = require('./controller/api/users/candidate/wizard/about.controller');
const candidateWizardExperience = require('./controller/api/users/candidate/wizard/experience.controller');
const candidateWizardJob = require('./controller/api/users/candidate/wizard/job.controller');
const candidateWizardResume = require('./controller/api/users/candidate/wizard/resume.controller');
const candidateWizardTnC = require('./controller/api/users/candidate/wizard/termsAndConditions.controller');

const companyRegister = require('./controller/api/users/company/createCompany.controller');
const companyGet = require('./controller/api/users/company/getCompany.controller');
const companyGetCurrent = require('./controller/api/users/company/getCurrentCompany.controller');
const companyImage = require('./controller/api/users/company/image.controller');
const companyUpdate = require('./controller/api/users/company/updateCompany.controller');
const companyWizardAbout = require('./controller/api/users/company/wizard/about.controller');
const companyWizardTnT = require('./controller/api/users/company/wizard/getSummaryTnC.controller');
const companySearchWord = require('./controller/api/users/company/searchCandidates/searchWord.controller');
const companySearchFilter = require('./controller/api/users/company/searchCandidates/filter.controller');
const companySearchVerifiedCandidates = require('./controller/api/users/company/searchCandidates/verifiedCandidate.controller');

const insertMessage = require('./controller/api/chat/insertMessage.controller');

const addPrivacyContent = require('./controller/api/pages/addPrivacyContent.controller');

router.get('/', healthCheck);
{
// User authorization
    router.post('/users/authenticate', authAthenticate);
    router.put('/users/emailVerify/:email_hash', authVerifyEmail);
    router.put('/users/forgot_password/:email', authForgotPassword);
    router.put('/users/change_password/:id', authChangePassword);
    router.put('/users/reset_password/:hash', authResetPassword);
    router.put('/users/verify_client/:email', authVerifyClient);

// Referrals
    router.post('/users/refered_user_email', refReferredEmail)
    router.post('/users/send_refreal',refReferral);
    router.post('/users/get_refrence_code',refGetReferralCode);

// Candidates
    router.post('/users/register', candidateRegister);
    router.get('/users/', candidateGetAll);
    router.get('/users/current/:id', candidateGetCurrent);
    router.delete('/users/:_id', candidateDelete);
    router.put('/users/welcome/terms/:_id', candidateWizardTnC);
    router.put('/users/welcome/about/:_id', candidateWizardAbout);
    router.put('/users/welcome/job/:_id', candidateWizardJob);
    router.put('/users/welcome/resume/:_id', candidateWizardResume);
    router.put('/users/welcome/exp/:_id', candidateWizardExperience);
    router.post('/users/image/:_id', multer.single('photo'), candidateImage);
    router.put('/users/refered_id/:id', candidateReferred);
    router.put('/users/update_profile/:_id', candidateUpdate);

// Companies
    router.post('/users/create_employer', companyRegister);
    router.get('/users/company', companyGet);
    router.get('/users/current_company/:id', companyGetCurrent);
    router.put('/users/company_wizard/:_id', companyWizardTnT);
    router.put('/users/about_company/:_id', companyWizardAbout);
    router.post('/users/employer_image/:_id', multer.single('photo'), companyImage);
    router.put('/users/update_company_profile/:_id', companyUpdate);
    router.post('/users/search_word', companySearchWord);
    router.post('/users/filter', companySearchFilter);
    router.get('/users/verified_candidate', companySearchVerifiedCandidates);
}
// Chat
router.post('/users/insert_message', insertMessage);
router.post('/users/get_candidate', get_candidate);
router.post('/users/get_messages', get_messages);
router.post('/users/get_user_messages', get_user_messages);
router.get('/users/all_chat' , get_chat);
router.post('/users/upload_chat_file/:_id', multer.single('photo'), upload_chat_file);
router.post('/users/insert_chat_file', insert_chat_file);
router.post('/users/insert_message_job', insert_message_job);
router.post('/users/update_job_message', update_job_message);
router.post('/users/get_unread_msgs_of_user', get_unread_msgs_of_user);

// Pages
router.put('/users/add_privacy_content'  , addPrivacyContent);


module.exports = router;