const { Router } = require('express');
const { check } = require('express-validator');

const { validateJWT, validateFields, hasRole } = require('../middlewares/');

const { 
    createCategoty, 
    getCategories, 
    updateCategory, 
    deleteCategory, 
    getCategory } = require('../controllers/categories');
const { categoryExistByID } = require('../helpers/db-validators');

const router = Router();

// Obtener todas las categorias - publico
router.get('/', getCategories)

// Obtener una categoria por ID - publico
router.get('/:id', [
    check('id', 'This is not a valid ID').isMongoId().bail().custom( categoryExistByID ),
    validateFields
],getCategory)

// Crear categoria privado cualquier persona con token
router.post('/', [
    validateJWT,
    check('name', 'The name is required').not().isEmpty(),
    validateFields
], createCategoty)

// Actualizar - privado - cualquiera con token valido
router.put('/:id', [
    validateJWT,
    check('name', 'The name is required').not().isEmpty(),
    check('id', 'This is not a valid ID').isMongoId().bail().custom( categoryExistByID ),
    validateFields
], updateCategory)

// Borrar una categoria - Admin 
router.delete('/:id',[
    validateJWT,
    check('id', 'This is not a valid ID').isMongoId().bail().custom( categoryExistByID ),
    hasRole('ADMIN_ROLE'),
    validateFields
], deleteCategory)

module.exports = router;