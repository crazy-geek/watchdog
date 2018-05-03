
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const OTP = require('../models/otp');
const otp = require('../helpers/otphelper');

signToken = user => {
    return JWT.sign({
            iss:process.env.ISSUER,
            sub:user.id,
            exp: new Date().setDate(new Date().getDate() + 1)
        }, process.env.APP_JWT_SECRET);
}

module.exports = {
    signUp : async (req, res, next) => {
        const {name, email, phone, password} = req.value.body;
        var foundUser = await User.findOne({email:email});

        if(foundUser)
            return res.status(403).json({error: 'user already exists!'});

        var user = new User({
            name,email,phone,password
        })
        await user.save();

        const token = signToken(user);
        res.status(200).json({token});
    },

    signIn : async(req, res, next) => {
        let user = req.user;
        const token = signToken(user);
        res.status(200).json({user, token});
    },

    secret: async (req,res,next) => {
        res.status(200).json({msg:'You got the secret'});
    },

    getOTP: async (req, res, next) => {
        let email = req.body.email;
        const foundUser = await User.findOne({email});
        if(!foundUser)
            return res.status(401).json({error:'no user found!'});
        let phone = foundUser.phone.replace('+','');
        const newOTP =  otp.generate();

        let foundOTP = await OTP.findOne({userId:foundUser.id});
        if(!foundOTP){
            foundOTP = new OTP();
            foundOTP.userId = foundUser.id;
            foundOTP.email = foundUser.email;
            foundOTP.OTP = newOTP;
            foundOTP.save();
        }else {
            foundOTP.OTP = newOTP;
            foundOTP.issuedOn = new Date().getTime();
            foundOTP.save();
        }   
        
        const result = await otp.send(`Hi ${foundUser.name}, Your Bolder One Time Token is ${newOTP}`, "Bolder", phone);
        res.status(200).send(result);
    },

    validateOTP: async (req, res, next) => {
        let userotp = req.body.token;
        let email = req.body.email;
        if (await otp.verify(email, userotp)){
            try{
                let foundUser = await User.findOne({email})
                let token = signToken (foundUser);
                res.status(200).json({token})
            }catch(error){
                 res.status(500).json({error})
            }
        }
        res.status(400).json({error:'unauthorized'});
    },

    verifyPhone: async (req, res, next) => {
        let user = req.user;           
            user.phoneVerified = true;
        try{
            let newUser = await user.save();
            return res.status(200).json(newUser);
        }catch(error){
            return res.status(500).json(error);
        }
    },

    updatePassword: async (req, res, next) => {
        let email = req.user.email;
        let newPassword = req.body.password;
        let query = {email}

        //const salt = await bcrypt.genSalt(10);
        //newPassword = await bcrypt.hash(newPassword,salt);
        //let foundUser = await User.findOneAndUpdate( {email}, {password:newPassword},{upsert:true});

        let foundUser = req.user; //await User.findOne(query);
        if(!foundUser)
            return res.status(401).json({error: 'no user found!'});

        foundUser.password = newPassword;
        foundUser = await foundUser.save()
        return res.status(200).json({user:foundUser});
    },

    updateUserPhone: async (req, res, next) => {
        let phone = req.body.phone;
        let user = req.user;
        if(user.phone == phone)
            return res.status(200).json(user);
        try{
            user.phone = phone;
            user.phoneVerified = false;
            let newUser = await user.save();
            return res.status(200).json({user:newUser});
        }catch(error){
            return res.status(500).send(error);
        }
    },

    googleAuthentication: async (req, res, next) =>{
        
    },

    facebookAuthentication: async (req, res, next) => {

    }
};
