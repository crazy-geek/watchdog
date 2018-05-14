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
    .post(validateBody(schemas.changePhoneSchema),
    passport.authenticate('jwt', {session: false}), 
    userController.changePhone);

router.route('/verifyphone')
    .post(validateBody(schemas.verifyPhoneSchema),
    passport.authenticate('jwt', {session: false}), 
    userController.sendVerificationOTP);

// Forgotpassword
router.route('/forgotpassword')
    .post(validateBody(schemas.forgotPasswordSchema),
    userController.sendForgotPasswordLink);

router.route('/forgotpassword')
    .get(passport.authenticate('jwt', {session: false}),
    userController.verifyForgotPasswordLink);

//Change Password
router.route('/changepassword')
    .post(validateBody(schemas.changePasswordSchema),
    passport.authenticate('jwt', {session: false}),
    userController.changePassword);

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