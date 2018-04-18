var express = require('express'), 
    routes = express.Router();

var User = require('../user.js')

var user = new User();

routes.get ('/save', (req, res)=>{
    user.add({'name':'jijo'},(err,result)=>{
        res.set('Content-Type', 'application/json');
        if(err)
            res.status(500).json({'error':err,'result':result});
        else
            res.status(200).json({'Error': err, 'result': result});
    })
});

routes.get('/login', (req,res) => {
    user.login({}, (err, result) => {
        res.status(200).send({"Error":err, 'result': result})
    })
});

module.exports = routes;