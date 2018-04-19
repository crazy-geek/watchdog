var express = require('express'),
    routes = express.Router();

var auth = require('../auth');

routes.post('/verify', (req, res) => {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(!token)
        res.status(401).send('unauthorized');

    auth.varyfyToken(token,
         (err, data) =>{
             if(err)
                res.status(401).send('unauthorized');
             res.status(200).json(data);
         }   
    )
});

module.exports = routes