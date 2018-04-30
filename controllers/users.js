const JWT = require('jsonwebtoken');
const User = require('../models/user');

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

    },

    secret: async (req,res,next) => {
        res.status(200).json({msg:'You got the secret'});
    }
};
