const { response } = require("express")


const isAdminRole = ( req, res = response, next) => {

    if( !req.user ){
        return res.status(500).json({
            msg: 'Trying to verify the role without first validating the token'
        })
    }
    const { role, name } = req.user;
    if( role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${name} is not authorized to do that`
        });
    }

    next();
}

const hasRole = ( ...roles ) => { 

    return (req, res = response, next) => {
        if( !req.user ){
            return res.status(500).json({
                msg: 'Trying to verify the role without first validating the token'
            })
        }

        if( !roles.includes( req.user.role )){
            return res.status(401).json({
                msg: `Require one of these roles ${roles}`
            })
        }

        next();
    }
}

module.exports = {
    isAdminRole,
    hasRole
}