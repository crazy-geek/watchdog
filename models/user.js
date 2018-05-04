const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const schema = mongoose.Schema;

var userSchema = new schema({
    authMethod:{
        type:String,
        enum:['local','google','facebook'],
        required:true
    },
    local:{
        name: String,
        phone: String,
        email: {
            type: String,
            lowercase: true
        },
        password: String,
        phoneVerified: {
            type: Boolean,
            default: false
        }
    },
    google:{
        id: String,
        email: {
            type:String,
            lowercase:true
        },
        name:String
    },
    facebook:{
        id: String,
        email: {
            type: String,
            lowercase: true
        },
        name: String
    },
    // remove following props after testing
    // name:String,
    // phone: String,
    // email:{
    //     type:String,
    //     unique:true,
    //     lowercase:true
    // },
    // password: String,
    // phoneVerified:{
    //     type: Boolean,
    //     default:false
    // }
});
//this method witll fire before save action
userSchema.pre('save', async function(next){
    if(this.authMethod !== 'local')
        next();
    try{
        const salt = await bcrypt.genSalt(10);
        this.local.password = await bcrypt.hash(this.local.password,salt);
        next();
    }catch(error){
        next (error);
    }
});

userSchema.methods.comparePassword = async function(password){
    try{
        return await bcrypt.compare(password, this.local.password);
    }catch(error){
        throw new Error(error);
    }
}

module.exports = mongoose.model('user',userSchema);