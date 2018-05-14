const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const OTP = require('../models/otp');
const otp = require('../helpers/otphelper');
const emailHelper = require('../helpers/emailHelper');


//#region Private methods
signToken = user => {
    return JWT.sign({
        iss: process.env.ISSUER,
        sub: user.id,
        exp: new Date().setDate(new Date().getDate() + 1)
    }, process.env.APP_JWT_SECRET);
}

getOTP =  async (user) => {
    const newOTP = otp.generate();
    try{
        let foundOTP = await OTP.findOne({
            userId: user._id
        });
       // console.log(foundOTP);
        if (!foundOTP) {
            foundOTP = new OTP();
            foundOTP.userId = user.id;
            foundOTP.email = user.email;
            foundOTP.sendTo = user.unverifiedPhone;
            foundOTP.OTP = newOTP;
            foundOTP.issuedOn = new Date().getTime();
            await foundOTP.save();
        } else {
            foundOTP.OTP = newOTP;
            foundOTP.sendTo = user.unverifiedPhone;
            foundOTP.issuedOn = new Date().getTime();
            await foundOTP.save();
        }
        return newOTP;
    }catch(error){
        //log error using Sentry
        return null;
    }
}
//#endregion Private methods

module.exports = {
    //add new user
    signUp: async (req, res, next) => {
        const {
            name,
            email,
            phone,
            password
        } = req.value.body;
        var foundUser = await User.findOne({
            'local.email': email
        });

        if (foundUser)
            return res.status(403).json({
                error: 'user already exists!'
            });

        var user = new User();
        user.authMethod = 'local';
        user.local.name = name;
        user.local.email = email;
        user.local.unverifiedPhone = phone;
        user.local.password = password;

        await user.save();

        const token = signToken(user);
        res.status(200).json({
            user,
            token
        });
    },
    //login
    signIn: async (req, res, next) => {
        let user = req.user;
        if (!user)
            return res.status(401).json({
                error: 'unauthorized'
            })
        const token = signToken(user);
        res.status(200).json({
            user,
            token
        });
    },
    
    //#region ForgotPassword WF
    sendForgotPasswordLink: async (req, res, next) => {
        let email = req.body.email;
        let foundUser = await (User.findOne({
            'local.email': email
        })); //await User.findOne(query);
        if (!foundUser)
            return res.status(401).json({
                error: 'unauthorized'
            });

        let forgotPwdToken = signToken(foundUser);

        let emailParams = {
            cc: [],
            to: [foundUser.local.email],
            from: ['jijo@bolder.no'],
            subject: 'Bolder password reset',
            message: `Here is your password reset link: 
                     http://localhost:3000/user/forgotpassword/?token=${forgotPwdToken}. 
                     This token is valid for 24 hours`
        }
        response = await emailHelper.sendMail(emailParams)
        return res.status(200).json({
            response
        });
    },

    verifyForgotPasswordLink: async (req, res, next) => {
        if (req.user)
            return res.status(200).json({
                isValid: true,
                token: req.get('authorization') || req.query.token
            });
        return res.status(401).json({
            isValid: false,
            token: null
        });
    },

    changePassword: async (req, res, next) => {
        let oldPassword = req.body.oldPassword;
        let newPassword = req.body.newPassword;

        let foundUser = req.user; //await User.findOne(query);
        if (!foundUser)
            return res.status(401).json({
                error: 'no user found!'
            });

        if (!foundUser.comparePassword(oldPassword))
            return res.status(401).json({
                error: 'old password does not match!'
            });

        if (!newPassword)
            return res.status(401).json({
                error: 'cannot set empty password'
            })
        try {
            foundUser.local.password = newPassword;
            foundUser = await foundUser.save()
            return res.status(200).json({
                user: foundUser
            });
        } catch (error) {
            return res.status(500).json({
                error
            })
        }
    },

    //#endregion of forgotpassword wf

    //#region Phone change WF
    

    sendVerificationOTP: async (req, res, next) => {
        let phone = req.body.phone;
        let user = req.user;
        if(!user || !phone)
            return res.status(401).json({error:'unauthorized'});

        try {
            let newOTP = await getOTP(user);
            if(newOTP !== null){
                const result = await otp.send(`Hi ${user.local.name}, Your Bolder One Time Token for phone number verification is ${newOTP}`,
                                            "Bolder", phone);
                user.local.unverifiedPhone = phone;
                user.local.phoneVerified = false;
                await user.save();
                return res.status(200).json({user, result});
            }else{
                throw new error('something went wrong, please try again after sometime');
            }
        } catch (error) {
            //log error to sentry
            return res.status(500).send(error);
        }
    },

    changePhone: async (req, res, next) => {
        let token = req.body.token;
        let user = req.user;
        try{
            if (!user || !token)
                return res.status(401).json({error:'unauthorized'});

            if(!otp.verify(user,token))
                return res.status(401).json({error:'unauthorized'});
                
            let validOTP = await OTP.findOne({sendTo:user.unverifiedPhone, OTP:token})    
            if(!validOTP)
                return res.status(401).json({error:'unauthorized'})
            
            user.local.phoneVerified = true;
            user.local.phone = user.local.unverifiedPhone;
            //user.local.unverifiedPhone = "";
            await user.save();
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    //#endregion of Phone change WF

    //#region oAth authentication

    //google authentiation
    googleAuthentication: async (req, res, next) => {
        let token = signToken(req.user);
        res.status(200).json({
            token
        });
    },

    //facebook authentications
    facebookAuthentication: async (req, res, next) => {

    }
    //#endregion oAuth authentiation
};