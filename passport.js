const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;
const {ExtractJwt} = require('passport-jwt');

const User = require('./models/user');

passport.use(new jwtStrategy({
    jwtFromRequest:ExtractJwt.fromHeader('authorization'),
    secretOrKey:process.env.SECRET
}, async (paylod,done) => {
    try{
        const foundUser = await User.findById(paylod.sub);
        if(!foundUser)
            return done(null,false);
        done(null,foundUser);
    }catch(error){
        done(error,false);
    }
}));
