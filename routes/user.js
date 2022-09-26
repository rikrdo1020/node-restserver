
const { Router } = require('express');
const { check } = require('express-validator');

const { 
    validateFields,
    validateJWT,
    hasRole,
    isAdminRole
} = require('../middlewares');

const { isRoleValid, emailExist, userExistByID, validID } = require('../helpers/db-validators');

const { usersGet, usersPut, usersPost, usersPatch, usersDelete } = require('../controllers/users');



const router = Router();

router.get('/',  usersGet );

router.put('/:id', [
    check('id', 'This is not a valid ID').isMongoId().bail().custom( userExistByID ),
    check('role').custom( isRoleValid ),
    validateFields
], usersPut);

router.post('/', [
    check('name', 'The name is required').not().isEmpty(),
    check('password', 'The password must at least be 6 characters').isLength({ min:6 }),
    check('email', 'The email is not valid').isEmail().bail().custom( emailExist ),
    //check('role', 'It is not valid').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom( isRoleValid ),
    validateFields
], usersPost);

router.patch('/', usersPatch);

router.delete('/:id', [
    validateJWT,
    //isAdminRole,
    hasRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'This is not a valid ID').isMongoId().bail().custom( userExistByID ),
    validateFields
],
 usersDelete);

module.exports = router;