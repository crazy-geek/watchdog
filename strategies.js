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
        const foundUser = await User.findOne({'local.email':username});
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
    jwtFromRequest: ExtractJwt.fromExtractors([(req) => {
            return req.get('authorization') || req.query.token
       }]),
    secretOrKey : process.env.APP_JWT_SECRET
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
    clientID:process.env.GOOGLE_CLIENT_ID ,
    clientSecret : process.env.GOOGLE_CLIENT_SECRET
}, async (accesstoken, refreshtoken, profile, done)=>{
    try{
        console.log(profile.id);
        let foundUser = await User.findOne({
            "google.id": profile.id
        });
        if (foundUser)
               return done(null, foundUser);
        let newUser = new User({
            authMethod:'google',
            google:{
                id:profile.id,
                emailFromGoogle:profile.emails[0].value,
                displayName: profile.displayName
            }
        });
        await newUser.save();
        return done(null, newUser);
    }catch(error){
        return done(error, false, error.message)
    }
}));


