var crypto = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');


//###


module.exports.generateHash = (password) => {
    return crypto.hashSync(password, crypto.genSaltSync(8), null);
}

module.exports.varifyPassword = (password, userobj) => {
    return crypto.compareSync(password, userobj.password);
}

module.exports.varyfyToken = (token, callback) =>{
   jwt.verify(token,'bolder',(err,decoded) => {
       if(err)
         return callback(err, null);
    return callback(null, decoded);
   });
};