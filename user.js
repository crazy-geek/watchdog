var mongoose = require('mongoose');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var User = require('./models/user');

module.exports = function (data, callback) {
    mongoose.connect('mongodb://localhost:27017/authentication', (err) => {
        if (err)
            console.log(err);
    })
    this.add = (data, callback) => {
        var user = User.findOne({ 'email': 'jijojoy1@gmail.com' }, (err, result) => {
            //console.log(result);
            if (err) {
                return callback(err, null);
            }
            if (result !== null)
                return callback('user already exists', null);
            else {
                var newuser = new User({
                    full_name: 'Jijo Joy',
                    phone: '1234567',
                    email: 'jijojoy1@gmail.com',
                    password: 'pwd'
                }).save((err, res) => {
                    callback(err, res);
                })
            }
        });


    };


    this.remove = (id, callback) => {

    };

    this.findById = (id) => {

    };

    this.findAll = (limit, page) => {

    };

    this.login = (data, callback) => {


        callback(null, 'success');
    }
};

passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
}),
    (username, password, done) => {
        User.findOne({ email: 'jijojoy@gmail.com' }, (err, result) => {
            if (result == null) { }
        })
});



//module.exports = {save,remove,findById,findAll}