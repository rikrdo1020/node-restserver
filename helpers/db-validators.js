const { Category, Role, User, Product } = require('../models');
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

/**
 * 
 * @param {*} id 
 * Validador personalizado para verificar si existe el id de la categoria
 */
const categoryExistByID = async(id = '') => {
    // Verificar si el id existe
    const categoryExist = await Category.findById(id);
    if(!categoryExist){
        throw new Error(`The id ${id} doesn't exist`)
    }
}

/**
 * 
 */
 const productExistByID = async(id = '') => {
    // Verificar si el id existe
    const productExist = await Product.findById(id);
    if(!productExist){
        throw new Error(`The id ${id} doesn't exist`)
    }
}

/**
 * 
 */
const allowedCollections = (collection = '', collections = []) => {
    const include = collections.includes( collection )
    if( !include ) {
        throw new Error(`The collection ${collection} is not allowed, ${collections}`)
    }
    return true
}

module.exports = {
    isRoleValid,
    emailExist,
    userExistByID,
    categoryExistByID,
    productExistByID,
    allowedCollections
}
