const mongoose = require('mongoose');
const Schema = mongoose.Schema;

otpSchema = new Schema({
    userId:String,
    email:String,
    OTP:String,
    issuedOn: {
        type:Date,
        default:new Date().getTime()
    },
    otpAction:{
        type:String,
        enum:['resetPassword','verifyPhone']
    },
    otpSendTO:{
        type:String,
        enum:['phone','email','both']
    }
});

module.exports =  mongoose.model('otp', otpSchema); 