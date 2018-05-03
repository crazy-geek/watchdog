const AWS = require('aws-sdk');
const speakeasy = require('speakeasy');
const OTP = require('../models/otp');

AWS.config.region = process.env.AWS_REGION
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_SECRET
});

var sns = new AWS.SNS();
sns.setSMSAttributes({
    attributes:{
        DefaultSMSType : "Transactional"
    }
    }, function(error){
    if(error)
        console.log(error);
    }
);

module.exports = {
    generate: () => {
       let secret = process.env.APP_OTP_SECRET;
       let token = speakeasy.totp({
        secret: secret.base32,
        encoding: 'base32'
        //time: new Date().getTime() + (60*60*60*60)
       });
       return token;
    },

    verify: async (email, otp) =>{
        let foundOTP = await OTP.find({email:email, OTP:otp});
        if(!foundOTP)
            return false;

        let secret = process.env.APP_OTP_SECRET;
        let isvalid = speakeasy.totp.verify({
            secret: secret.base32,
            encoding: 'base32',
            token: otp,
            window:6
          });
        return isvalid;
    },
    
    send: async (message,subject,phonenumber) =>{
        const params = {
            Message: message,
            MessageStructure: 'string',
            PhoneNumber: phonenumber,
            Subject: subject
        };
        await sns.publish(params, (error, data) => {
            if(error)
                return { error:error, data:null };
            return { error:null, data:data };
        })
    
    }
};

