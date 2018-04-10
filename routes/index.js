var express = require('express'), 
    routes = express.Router();

routes.use('/user', require('./userroutes'));

module.exports = routes;