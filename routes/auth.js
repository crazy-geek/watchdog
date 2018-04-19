var express = require('express'),
    routes = express.Router();

var auth = require('../auth');

routes.get('/varify', (req, res) => {

auth.varyfyToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YWQ4N2VmNTE3YTA1ZjMxYzQyODgwYjU' +
        'iLCJmdWxsX25hbWUiOiJKaWpvIEpveSIsInBob25lIjoiMTIzNDU2NyIsImVtYWlsIjoiamlqb2pveTF' +
        'AZ21haWwuY29tIiwiX192IjowLCJpYXQiOjE1MjQxNDczNzIsImV4cCI6MTUyNDE1MDk3Mn0.vyivQ8p' +
        'yDHgYLnNCR_8n6DfC1NaY4Gc4gHvlGxyodTI',
         (err, data) =>{
             if(err)
                res.status(401).send('unauthorized');
             res.status(200).json(data);
         }   
    )
    
});

module.exports = routes