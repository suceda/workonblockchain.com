const bcrypt = require('bcryptjs');
const User = require('../../../../model/users');
const CandidateProfile = require('../../../../model/candidate_profile');
const EmployerProfile = require('../../../../model/employer_profile');
const Q = require('q');
const jwtToken = require('../../../services/jwtToken');
const crypto = require('crypto');
const logger = require('../../../services/logger');
const errors = require('../../../services/errors');

module.exports = async function (req, res) {

    let userParam = req.body;
    console.log(userParam);
    if(userParam.linkedin_id) {
        console.log("if")
      const userDoc =  await User.findOne({linkedin_id : userParam.linkedin_id }).lean();
        console.log(userDoc);
      if(userDoc) {
          let jwtUserToken = jwtToken.createJwtToken(userDoc);
          await User.update({_id: userDoc._id}, {$set: {'jwt_token': jwtUserToken}});
          const candidateDoc = await  CandidateProfile.findOne({ _creator:  userDoc._id }).lean();
          console.log(candidateDoc);
          res.send({
              _id:candidateDoc._id,
              _creator: userDoc._id,
              email: userDoc.email,
              email_hash: userDoc.email_hash,
              is_admin:userDoc.is_admin,
              type:userDoc.type,
              is_approved : userDoc.is_approved,
              jwt_token: jwtUserToken
          });
      }
      else {
          errors.throwError("Incorrect Username or Password" , 400)
      }
    }

    else
    {
        let userDoc =  await User.findOne({email : userParam.email }).lean();
        if(userDoc) {
            let hash = crypto.createHmac('sha512', userDoc.salt);
            hash.update(userParam.password);
            let hashedPasswordAndSalt = hash.digest('hex');

            if (hashedPasswordAndSalt === userDoc.password_hash)
            {
                if(userDoc.type === 'candidate') {
                    let jwtUserToken = jwtToken.createJwtToken(userDoc);
                    await User.update({_id: userDoc._id}, {$set: {'jwt_token': jwtUserToken}});
                    const candidateDoc = await CandidateProfile.findOne({ _creator:  userDoc._id }).lean();
                    res.send({
                        _id: candidateDoc._id,
                        _creator: userDoc._id,
                        email: userDoc.email,
                        email_hash: userDoc.email_hash,
                        is_admin: userDoc.is_admin,
                        type: userDoc.type,
                        is_approved: userDoc.is_approved,
                        jwt_token: jwtUserToken
                    });
                }

                if(userDoc.type === 'company') {
                    let jwtUserToken = jwtToken.createJwtToken(userDoc);
                    await User.update({_id: userDoc._id}, {$set: {'jwt_token': jwtUserToken}});
                    const companyDoc = await EmployerProfile.findOne({ _creator:  userDoc._id }).lean();
                    res.send({
                        _id: companyDoc._id,
                        _creator: userDoc._id,
                        email: userDoc.email,
                        email_hash: userDoc.email_hash,
                        is_admin: userDoc.is_admin,
                        type: userDoc.type,
                        is_approved: userDoc.is_approved,
                        jwt_token: jwtUserToken
                    });
                }

            }
            else
            {
                errors.throwError("Incorrect Password" , 400)
            }

        }
        else {
            errors.throwError("Incorrect Username or Password" , 400)
        }

    }

}

