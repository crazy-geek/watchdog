const joi = require('joi');

module.exports ={
    validateBody: (schema) =>{
        return (req, res, next) => {
            const result = joi.validate(req.body, schema);
            if(result.error)
                return res.status(400).json(result.error);
            if(!req.value)
                req.value = {};
            
            req.value['body'] = result.value;
            next();
        }
    },

    schemas: {
       signUpSchema: joi.object().keys({
           name: joi.string().required(),
           phone: joi.string().required(),
           email:joi.string().required(),
           password:joi.string().required()
       }),
       signInSchema: joi.object().keys({
           email:joi.string().required(),
           password:joi.string().required()
       }),
       getOTPSchema: joi.object().keys({
           email:joi.string().required()
       }),
       validateOTPSchema: joi.object().keys({
           token:joi.string().required(),
           email:joi.string().required()
       }),
       googleSignInSchema:joi.object().keys({
            access_token:joi.string().required()
       })
    }

};