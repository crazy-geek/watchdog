const express = require('express'); 
const router = require('express-promise-router')();
const passport = require('passport');

const strategies = require('../strategies')
const userController = require('../controllers/users')
const {validateBody, schemas} = require('../helpers/routehelper');

router.route('/signup')
    .post(validateBody(schemas.signUpSchema), userController.signUp);

router.route('/signin')
    .post(validateBody(schemas.signInSchema),
        passport.authenticate('local', {session:false}),
        userController.signIn);

router.route('/secret')
    .get(passport.authenticate('jwt',{session:false}),
         userController.secret);
module.exports = router;