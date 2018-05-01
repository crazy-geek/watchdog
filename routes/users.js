const express = require('express'); 
const router = require('express-promise-router')();
const passport = require('passport');

const strategies = require('../strategies')
const userController = require('../controllers/users')
const {validateBody, schemas} = require('../helpers/routehelper');

router.route('/signup')
    .post(validateBody(schemas.signUpSchema), 
    userController.signUp);

router.route('/signin')
    .post(validateBody(schemas.signInSchema),
        passport.authenticate('local', {session:false}),
        userController.signIn);

router.route('/secret')
    .get(passport.authenticate('jwt',{session:false}),
         userController.secret);

router.route('/reset')
     .post(validateBody(schemas.getOTPSchema), 
     userController.getOTP);
    
router.route('/verify')
    .post(validateBody(schemas.validateOTPSchema),
    userController.validateOTP);

router.route('/updatepassword')
    .post(validateBody(schemas.signInSchema),
    userController.updatePassword);

router.route('/oauth/google')
    .post(validateBody(schemas.googleSignInSchema),
    passport.authenticate('google-plus', {session:false}),
    userController.googleAuthentication);

module.exports = router;