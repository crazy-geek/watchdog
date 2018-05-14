

module.exports = {
    verifyToken : async (req,res,next) =>{
        let user = req.user;
        if(!req.user)
            return req.status(401).json({error:'unauthorized'})
        return res.status(200).json({'validToken':true});    
    }
}