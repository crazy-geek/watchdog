const AWS = require('aws-sdk');
const speakeasy = require('speakeasy');

AWS.config.region = 'us-west-2'
AWS.config.update({
    accessKeyId: 'AKIAI72OPMFJM6RM4MEA',
    secretAccessKey: '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'  
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
       let secret = 'MYTOPSECRET';
       let token = speakeasy.totp({
        secret: secret.base32,
        encoding: 'base32'
        //time: new Date().getTime() + (60*60*60*60)
       });
       return token;
    },
    verify: otp =>{
        let secret = 'MYTOPSECRET';
        let isvalid = speakeasy.totp.verify({
            secret: secret.base32,
            encoding: 'base32',
            token: otp,
            window:6
          });
        return isvalid;
    },
    send: (message,subject,phonenumber) =>{
        const params = {
            Message: message,
            MessageStructure: 'string',
            PhoneNumber: phonenumber,
            Subject: subject
        };
        sns.publish(params, (error, data) => {
            if(error)
                return { error:error, data:null };
            return { error:null, data:data };
        })
    }
};
