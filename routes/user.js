var express = require('express'), 
    routes = express.Router();

var User = require('../user.js')

var user = new User();

routes.get ('/save', (req, res)=>{
    user.save({'name':'jijo'},(err,result)=>{
        console.log(err, result);
    })
});

module.exports = routes;