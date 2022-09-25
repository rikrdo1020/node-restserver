const Role = require('../models/role');
const User = require('../models/user');
const ObjectId = require('mongoose').Types.ObjectId;

const isRoleValid = async(role = '') => {
    const existRole = await Role.findOne({ role });
    if (!existRole ){
        throw new Error(`The role ${ role } is not registered in the database`);
    }
}

const emailExist = async(email = '') => {
      // Verificar si el correo existe
      const existEmail = await User.findOne({ email });
      if(existEmail){
          throw new Error(`The email: ${ email } is already registered`)
      }
}


const userExistByID = async(id = '') => {
    // Verificar si el id existe
    const userExist = await User.findById(id);
    if(!userExist){
        throw new Error(`The id ${id} doesn't exist`)
    }
}
module.exports = {
    isRoleValid,
    emailExist,
    userExistByID
}
