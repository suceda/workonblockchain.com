const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
const docGenerator = require('../../../helpers/docGenerator');
const companyHelper = require('../../users/company/companyHelpers');
const candidateHelper = require('../../users/candidate/candidateHelpers');
const adminHelper = require('./adminHelpers');
const userHelper = require('../../users/usersHelpers');
const settings = require('../../../../settings');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('admin get metrics', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('GET /users/get_metrics', () => {

        it('it should get the application metrics', async () => {

            const candidate = docGenerator.candidate();
            const profileData = docGenerator.profileData();
            const job = docGenerator.job();
            const resume = docGenerator.resume();
            const experience = docGenerator.experience();
            await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData,job,resume,experience );

            const company = docGenerator.company();
            const companyTnCWizard = docGenerator.companyTnCWizard();
            const companyAbout = docGenerator.companyAbout();
            await companyHelper.signupCompanyAndCompleteProfile(company,companyTnCWizard,companyAbout);
            await userHelper.makeAdmin(company.email);
            const companyUserDoc = await Users.findOne({email: company.email}).lean();

            const metricsRes = await adminHelper.getMetrics(companyUserDoc.jwt_token);
            const metrics = metricsRes.body;
            metrics.candidates.should.equal(1);
            metrics.emailVerified.should.equal(1);
            metrics.dissabled.should.equal(0);
            metrics.approved.count.should.equal(1);

            const aggregrated = metrics.approved.aggregated;
            aggregrated.nationality[profileData.nationality].should.equal(1);
            should.not.exist(aggregrated.nationality.Australian);
            aggregrated.availabilityDay[job.availability_day].should.equal(1);
            aggregrated.baseCountry[profileData.country].should.equal(1);
            aggregrated.expectedSalaryUSD.min.should.equal(job.expected_salary*settings.CURRENCY_RATES.USD.Euro);
            aggregrated.interestAreas[job.interest_area[0]].should.equal(1);
            aggregrated.locations[job.country[0]].should.equal(1);
            aggregrated.locations[job.country[1]].should.equal(1);
            aggregrated.roles[job.roles[0]].should.equal(1);
            aggregrated.programmingLanguages[experience.language_exp[0].language].should.equal(1);
            aggregrated.programmingLanguages[experience.language_exp[1].language].should.equal(1);
            aggregrated.blockchain.experimented[resume.experimented_platform[0].name].should.equal(1);
            aggregrated.blockchain.experimented[resume.experimented_platform[1].name].should.equal(1);
            should.not.exist(aggregrated.blockchain.experimented["EOS"]);
        })
    })
});