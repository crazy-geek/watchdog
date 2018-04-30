const express = require('express'); 
const router = require('express-promise-router')();
const userController = require('../controllers/users')
const {validateBody, schemas} = require('../helpers/routehelper');

router.route('/signup')
    .post(validateBody(schemas.authSchema), userController.signUp);

router.route('/signin')
    .post(userController.signIn);

module.exports = router;