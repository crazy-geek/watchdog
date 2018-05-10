const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
//const passport = require('passport')
const User = require('../models/user');
const OTP = require('../models/otp');
const otp = require('../helpers/otphelper');
const emailHelper = require('../helpers/emailHelper');

signToken = user => {
    return JWT.sign({
            iss:process.env.ISSUER,
            sub:user.id,
            exp: new Date().setDate(new Date().getDate() + 1)
        }, process.env.APP_JWT_SECRET);
}

getOTP =  (user, otpAction) => {
    const newOTP = otp.generate();

    let foundOTP = OTP.findOne({ userId: user.id });
    if (!foundOTP) {
        foundOTP = new OTP();
        foundOTP.userId = user.id;
        foundOTP.email = user.email;
        foundOTP.OTP = newOTP;
        foundOTO.otpAction = otpAction;
        foundOTP.save();
    } else {
        foundOTP.OTP = newOTP;
        foundOTP.issuedOn = new Date().getTime();
        foundOTP.otpAction = otpAction;
        foundOTP.save();
    }
    return newOTP;
    //const result = await otp.send(otpMessageText ); //`Hi ${foundUser.local.name}, Your Bolder One Time Token is ${newOTP}`, "Bolder", phone);
    //res.status(200).send(result);
}

module.exports = {
    signUp : async (req, res, next) => {
        const {name, email, phone, password} = req.value.body;
        var foundUser = await User.findOne({'local.email':email});

        if(foundUser)
            return res.status(403).json({error: 'user already exists!'});

        var user = new User();
        user.authMethod = 'local';
        user.local.name = name;
        user.local.email = email;
        user.local.phone = phone;
        user.local.password = password; 
         
        await user.save();

        const token = signToken(user);
        res.status(200).json({user, token});
    },

    signIn : async(req, res, next) => {
        let user = req.user;
        const token = signToken(user);
        res.status(200).json({user, token});
    },

    sendOTP: async (req, res, next) => {
        let email = req.body.email;
        let otpAction = req.body.action;
        let access_token = req.body.access_token;

        const foundUser = await User.findOne({
            'local.email': email
        });
        
        if(!foundUser)
            return res.status(401).json({error:'no user found!'});
       
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
        
        const result = await otp.send(`Hi ${foundUser.local.name}, Your Bolder One Time Token is ${newOTP}`, "Bolder", phone);
        res.status(200).send(result);
    },
//#region Change Password WF
    sendChangePasswordOTP: async (req, res, next) => {
        let user = req.user;
        try{
            if (!user)
                return res.status(401).json({
                    error: 'no user found!'
                });
            let phone = user.phone.replace('+','');
            const newOTP = await getOTP(user, 'resetPassword');
            const result = await otp.send(`Hi ${user.name}, Your One Time Token for Bolder password reset is ${newOTP}`, "Bolder", phone);
            return res.status(200).send(result);
        }catch(error){
            return res.status(500).json({error});
        }
    },

    changePassword: async (req, res, next) => {
        let oldPassword = req.body.oldpassword;
        let newPassword = req.body.newpassword;
        let otp = req.body.otp;

        let foundUser = req.user; //await User.findOne(query);
        if (!foundUser)
            return res.status(401).json({
                error: 'no user found!'
            });

        if (!foundUser.comparePassword(oldPassword))
            return res.status(401).json({
                error: 'old password does not match!'
            });

        if (!otp.verify(foundUser.email, otp))
            return res.status(401).json({
                error: 'invalid otp!'
            });
        foundUser.local.password = newPassword;
        foundUser = await foundUser.save()
        return res.status(200).json({
            user: foundUser
        });
    },
//#endregion

   /*validateOTP: async (req, res, next) => {
        let userotp = req.body.token;
        let email = req.body.email;
        if (await otp.verify(email, userotp)){
            try{
                let foundUser = await User.findOne({
                    'local.email': email
                })
                let token = signToken (foundUser);
                res.status(200).json({token})
            }catch(error){
                 res.status(500).json({error})
            }
        }
        res.status(400).json({error:'unauthorized'});
    },*/

    verifyPhone: async (req, res, next) => {
        let user = req.user;           
            user.local.phoneVerified = true;
        try{
            let newUser = await user.save();
            return res.status(200).json(newUser);
        }catch(error){
            return res.status(500).json(error);
        }
    },

//#region ForgotPassword WF
    sendForgotPasswordLink: async (req, res, next) => {
        let email = req.body.email;
        //let otp = req.body.otp
        let foundUser = await (User.findOne({'local.email':email})); //await User.findOne(query);
        if(!foundUser)
            return res.status(401).json({
                error: 'no user found!'
            });
   
        //let otp = await generateOTP(foundUser);
        //if(!await otp.verify(email,otp))
            //return res.status(401).json({error:'invalid otp'});

        let forgotPwdToken = signToken(foundUser);
            
        let emailParams = {
            cc:[],
            to:[foundUser.local.email],
            from:['jijo@bolder.no'],
            subject:'Bolder password reset',
            message:`Here is your password reset link: http://localhost:3000/forgotpassword/?token=${forgotPwdToken}. 
                     This token is valid for 24 hours`
        }
        response = await emailHelper.sendMail(emailParams)
        return res.status(200).json({response});
    },

    verifyForgotPasswordLink: async (req, res, next) =>{
        if(req.user)
            return res.status(200).json({isValid: true, token: req.get('authorization') || req.query.token});
        return res.status(401).json({isValid: false, token:null});
    },

    savePassword: async (req, res, next) =>{
         let user = req.user;
         try{
         user.local.password = req.body.password;
         await user.save();
         res.status(200).json({user});
         }catch(error){
             res.status(500).json({error})
         }
        //foundUser.local.password = newPassword;
        // foundUser = await foundUser.save()
    },

//#endregion
    updateUserPhone: async (req, res, next) => {
        let phone = req.body.phone;
        let user = req.user;
        if(user.phone == phone)
            return res.status(200).json(user);
        try{
            user.local.phone = phone;
            user.local.phoneVerified = false;
            let newUser = await user.save();
            return res.status(200).json({user:newUser});
        }catch(error){
            return res.status(500).send(error);
        }
    },

    googleAuthentication: async (req, res, next) =>{
        let token = signToken(req.user);
        res.status(200).json({token});
    },

    facebookAuthentication: async (req, res, next) => {

    }
};
