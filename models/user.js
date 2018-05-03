const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const schema = mongoose.Schema;

var userSchema = new schema({
    name:String,
    phone: String,
    email:{
        type:String,
        unique:true,
        lowercase:true
    },
    password: String,
    phoneVerified:{
        type: Boolean,
        default:false
    }
});
//this method witll fire before save action
userSchema.pre('save', async function(next){
    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);
        next();
    }catch(error){
        next (error);
    }
});

userSchema.methods.comparePassword = async function(password){
    try{
        return await bcrypt.compare(password, this.password);
    }catch(error){
        throw new Error(error);
    }
}

module.exports = mongoose.model('user',userSchema);