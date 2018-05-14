const passport = require('passport');

module.exports = {
    verifyToken : async (req,res,next) =>{
        let user = req.user;
        console.log(user);
        return res.status(200).json({'validToken':true});    
    }
}