var crypto = require('bcrypt-nodejs');

module.exports.generateHash = (password) => {
    return crypto.hashSync(password, crypto.genSaltSync(8), null);
}

module.exports.varifyPassword = (password, userobj) => {
    // crypto.compare(password,this.password,(err, result) =>{     if(err)
    // return callback(err,  null);     else         return callback(null, result);
    // });
console.log(userobj.password)
    return crypto.compareSync(password, userobj.password)
}