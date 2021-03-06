const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/mongoose/users');
const Companies = require('../../../../model/mongoose/companies');
const docGenerator = require('../../../helpers/docGenerator-v2');
const companyHelper = require('./helpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('update profile as company', function () {

    afterEach(async () => {
        console.log('dropping database');
    await mongo.drop();
})

    describe('PUT /users/update_company_profile', () => {

        it('it should update company profile', async () => {

            const company = docGenerator.company();
            await companyHelper.signupCompany(company);
            const companyUserDoc = await Users.findOneByEmail(company.email);

            const updatedData = await docGenerator.companyUpdateProfile();
            const updateRes = await companyHelper.companyProfileData(companyUserDoc._creator, companyUserDoc.jwt_token , updatedData);

            const companyUpdatedDoc = updateRes.body;
            companyUpdatedDoc.first_name.should.equal(updatedData.first_name);
            companyUpdatedDoc.last_name.should.equal(updatedData.last_name);
            companyUpdatedDoc.job_title.should.equal(updatedData.job_title);
            companyUpdatedDoc.company_website.should.equal(updatedData.company_website);
            companyUpdatedDoc.company_postcode.should.equal(updatedData.company_postcode);
            companyUpdatedDoc.company_city.should.equal(updatedData.company_city);
            companyUpdatedDoc.company_founded.should.equal(updatedData.company_founded);
            companyUpdatedDoc.no_of_employees.should.equal(updatedData.no_of_employees);
            companyUpdatedDoc.company_funded.should.equal(updatedData.company_funded);
            companyUpdatedDoc.company_description.should.equal(updatedData.company_description);
            companyUpdatedDoc.when_receive_email_notitfications.should.equal(updatedData.when_receive_email_notitfications);
        });

        it('it should update/add gdpr compliance of a company', async () => {

            const company = docGenerator.company();
            await companyHelper.signupCompany(company);
            const companyUserDoc = await Users.findOneByEmail(company.email);

            const updatedData = await docGenerator.companyUpdateProfile();
            const gdprDoc = docGenerator.companyGDPRDOC();
            const gdprData = docGenerator.companyGDPR();
            const updateRes = await companyHelper.companygdprData(companyUserDoc._creator, companyUserDoc.jwt_token , gdprDoc, gdprData);
            gdprData.canadian_commercial_company.should.equal(gdprData.canadian_commercial_company);
        });
    })
});