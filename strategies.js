const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;
const {ExtractJwt} = require('passport-jwt');
const localStrategy = require('passport-local').Strategy;
const googleStrategy = require('passport-google-plus-token');

const User = require('./models/user');

passport.use(new localStrategy({
    usernameField:'email',
    passwordField:'password'
},async (username, password, done)=>{
    try{
        const foundUser = await User.findOne({email:username});
        if(!foundUser)
            return done(null, false);
        if(await foundUser.comparePassword(password))
            return done(null, foundUser);
        done (null, false);
    }catch(error){
        done(error,false)
    }
}));

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

passport.use('google-plus', new googleStrategy({
    clientID:'655933511207-k33ac2rpqdre9r78a8pjngh0pdujt19l.apps.googleusercontent.com',
    clientSecret:'SIj-meBVOgIXq4TBsYc5yTem'
}, async (accesstoken, refreshtoken, profile, done)=>{
    console.log(profile);
}));


