var express = require('express'), 
    routes = express.Router();

routes.use('/user', require('./user'));

module.exports = routes;