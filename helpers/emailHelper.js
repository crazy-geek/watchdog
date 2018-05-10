const AWS = require('aws-sdk');
const speakeasy = require('speakeasy');
const OTP = require('../models/otp');

AWS.config.region = process.env.AWS_REGION
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_SECRET
});

module.exports = {
   sendMail: async(data) =>{
       console.log(data);
        let params = {
              Destination: { 
                      CcAddresses : data.cc,
                      ToAddresses : data.to
                  },    
                  Message: { 
                      Body: { 
                          Html: {
                              Charset: "UTF-8",
                              Data: data.message
                          }
                      },
                      Subject: {
                          Charset: 'UTF-8',
                          Data: data.subject
                      },
                   Source: data.from,
                  },
        }
       let sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
       sendPromise.then((data)=> {return {error:null, data}})
                  .catch(error => {return {error, data:null}})
   } 
}