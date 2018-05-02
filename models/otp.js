const mongoose = require('mongoose');
const Schema = mongoose.Schema;

otpSchema = new Schema({
    userId:String,
    email:String,
    OTP:String,
    issuedOn: {
        type:Date,
        default:new Date().getTime()
    }
});

module.exports =  mongoose.model('otp', otpSchema); 