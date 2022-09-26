const { response } = require("express");
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const { generateJWT } = require("../helpers/generate-jwt");

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        // Verificar si el email existe
        const user = await User.findOne({email});
        if( !user ){
            return res.status(400).json({
                msg: 'Incorrect username or password - email'
            });
        }

        // Si el usuario esta activo
        if( !user.state ){
            return res.status(400).json({
                msg: 'Incorrect username or password - status: false'
            });
        }
        // Verificar contraseña
        const validPassword = bcryptjs.compareSync(password, user.password );
        if( !validPassword ){
            return res.status(400).json({
                msg: 'Incorrect username or password - password'
            });
        }

        // Generar JWT
        const token = await generateJWT( user.id );

        res.json({
            user,
            token
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Contact the administrator'
        })
    }

}

module.exports = {
    login
}