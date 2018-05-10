const express = require('express'); 
const router = require('express-promise-router')();
const passport = require('passport');

const strategies = require('../strategies')
const userController = require('../controllers/users')
const {validateBody, schemas} = require('../helpers/routehelper');

//Register User
router.route('/signup')
    .post(validateBody(schemas.signUpSchema), 
    userController.signUp);

//Login
router.route('/signin')
    .post(validateBody(schemas.signInSchema),
        passport.authenticate('local', {session:false}),
        userController.signIn);


router.route('/updatephone')
    .post(validateBody(schemas.verifyPhoneSchema),
    passport.authenticate('jwt', {session: false}), 
    userController.updateUserPhone);

router.route('/verifyphone')
    .post(validateBody(schemas.verifyPhoneSchema),
         passport.authenticate('jwt', {session: false}), 
         userController.verifyPhone);

//Send One Time Password sms to a user
// router.route('/getotp')
//      .post(validateBody(schemas.getOTPSchema), 
//      userController.getOTP);

//validate OTP   
// router.route('/verifyotp')
//     .post(validateBody(schemas.validateOTPSchema),
//     userController.validateOTP);

// Update User Password
// router.route('/resetpassword')
//     .post(passport.authenticate('jwt', {session: false}),
//      validateBody(schemas.resetPasswordSchema),
//      userController.updatePassword);

// Forgotpassword
router.route('/forgotpassword')
    .get(passport.authenticate('jwt', {session: false}),
     userController.verifyForgotPasswordLink);

router.route('/forgotpassword')
    .post(validateBody(schemas.forgotPasswordSchema),
     userController.sendForgotPasswordLink);

router.route('/savepassword')
    .post(passport.authenticate('jwt', {session: false}),
    userController.savePassword);

//Google Authentication
router.route('/oauth/google')
    .post(validateBody(schemas.oAuthSignInSchema),
    passport.authenticate('google-plus', {session:false}),
    userController.googleAuthentication);

//Facebook Authentication
router.route('/oauth/facebook')
    .post(validateBody(schemas.oAuthSignInSchema),
    passport.authenticate('facebook', {session: false}),
    userController.facebookAuthentication);   
    
    
module.exports = router;