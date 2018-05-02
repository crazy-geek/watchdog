const AWS = require('aws-sdk');
const speakeasy = require('speakeasy');

AWS.config.update({
    region : process.env.AWS_REGION,
    accessKeyId : process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey : process.env.AWS_ACCESS_SECRET
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
    verify: otp =>{
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
        try{
            let result = await sns.publish(params);
            console.log (result.response)
            return result
        }catch(error){
            return error
        }
    }
};
