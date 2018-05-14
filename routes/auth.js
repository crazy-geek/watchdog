const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const authController = require('../controllers/authentication');

router.route('/verifytoken')
    .post(passport.authenticate('jwt',{session:false}),
    authController.verifyToken);

module.exports = router;