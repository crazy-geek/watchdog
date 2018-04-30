var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = new schema({
    name:String,
    phone: String,
    email:{
        type:String,
        unique:true,
        lowercase:true
    },
    password: String
});


module.exports = mongoose.model('user',userSchema);