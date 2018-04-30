const User = require('../models/user');
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
        res.status(200).json(user);
    },

    signIn : async(req, res, next) => {

    },
};
