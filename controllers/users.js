
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const otp = require('../helpers/otphelper');

signToken = user => {
    return JWT.sign({
            iss:process.env.ISSUER,
            sub:user.id,
            exp: new Date().setDate(new Date().getDate() + 1)
        }, process.env.SECRET);
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
        const token = signToken(req.user);
        res.status(200).json({token});
    },

    secret: async (req,res,next) => {
        res.status(200).json({msg:'You got the secret'});
    },

    getOTP: async (req, res, next) => {
        let email = req.body.email;
        const foundUesr = await User.findOne({email});
        if(!foundUesr)
            return res.status(401).json({error:'no user found!'});
        let phone = foundUesr.phone.replace('+','');
        const OTP = otp.generate();
        const result = await otp.send(`Bolder One Time Password for reset your password is ${OTP}`, "Bolder", phone);
        res.json(result);
    },

    validateOTP: async (req, res, next) => {
        let userotp = req.body.otp;
        res.send(otp.verify(userotp));
    },

    updatePassword: async (req, res, next) => {
        let email = req.body.email;
        let newPassword = req.body.password;
        let query = {email}

        //const salt = await bcrypt.genSalt(10);
        //newPassword = await bcrypt.hash(newPassword,salt);
        //let foundUser = await User.findOneAndUpdate( {email}, {password:newPassword},{upsert:true});

        let foundUser = await User.findOne(query);
        if(!foundUser)
            return res.status(401).json({error: 'no user found!'});

        foundUser.password = newPassword;
        foundUser = await foundUser.save()
       
        return res.status(200).json({user:foundUser});
    }

};
