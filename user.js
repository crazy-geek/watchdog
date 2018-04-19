
var mongoose = require('mongoose');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var jwt = require('jsonwebtoken');

var User = require('./models/user');
var auth = require('./auth.js');

module.exports = function (data, callback) {
    mongoose.connect('mongodb://localhost:27017/authentication', (err) => {
        if (err) 
            console.log(err);
        }
    )
    this.add = (data, callback) => {
        
        var user = User.findOne({
            'email': data.email
        }, (err, result) => {
            //console.log(result);
            if (err) {
                return callback(err, null);
            }
            if (result !== null) 
                return callback('user already exists', null);
            else {
                var newuser = new User({
                    full_name : data.full_name,
                    email: data.email,
                    phone:data.phone,
                    password: auth.generateHash(data.password)
                });
                newuser.save((err, res) => {
                        return callback(err, res);
                    });
                }
            })
};


    this.remove = (id, callback) => {};

    this.findById = (id) => {};

    this.findAll = (limit, page) => {};

    this.login = (data, callback) => {
        User.findOne({
            email: data.email
        }, (err, user) => {
            if (!user) 
                return callback(401, null);
           
            if (!auth.varifyPassword(data.password, user)) 
                return callback(401, null);

            var userInfo = user.toObject();
            delete userInfo['password']
            var token = jwt.sign(userInfo, 'bolder', {expiresIn:'1h'})
            return callback(null, {
                'success': true,
                'token': token
            });
        });
    };
}
