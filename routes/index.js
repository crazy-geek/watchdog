var express = require('express'), 
    routes = express.Router();

routes.use('/user', require('./user'));
routes.use('/auth', require('./auth'));
module.exports = routes;