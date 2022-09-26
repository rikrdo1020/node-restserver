const { request } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validateJWT = async( req = request, res = response, next) => {

    const token = req.header('x-token');

    
    if( !token ){
        return res.status(401).json({
            msg: 'There is not token in the request'
        });
    }

    try {
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        // leer el usuario que corresponde al uid
        const user = await User.findById(uid);
        if( !user ){
            return res.status(401).json({
                msg: 'Invalid token - user does not exist in DB'
            })
        }

        // Verificar si el uid tiene state true
        if(!user.state){
            return res.status(401).json({
                msg: 'Invalid token - user state:false'
            })
        }
        req.user = user;
        next();
        
    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: 'Invalid token'
        })
    }

}

module.exports = {
    validateJWT
}