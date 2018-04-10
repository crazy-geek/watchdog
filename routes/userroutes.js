var express = require('express'), 
    routes = express.Router();

var User = require('../user.js')

var user = new User();

routes.get ('/save', ()=>{
    user.save({'name':'jijo'},(err,res)=>{
        console.log(err, res);
    })
});


module.exports = routes;