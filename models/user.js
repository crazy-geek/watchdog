var mongoose = require('mongoose');

var schema = mongoose.Schema;

var userSchema = new schema({
    full_name:String,
    phone: String,
    email:String,
    password: String
});


module.exports = mongoose.model('user',userSchema);