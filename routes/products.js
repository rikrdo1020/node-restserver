const { Router } = require('express');
const { check } = require('express-validator');

const { validateJWT, validateFields, hasRole } = require('../middlewares/');

const { 
    getProducts, 
    getProduct, 
    createProduct, 
    updateProduct, 
    deleteProduct } = require('../controllers/products');
const { productExistByID, categoryExistByID } = require('../helpers/db-validators');

const router = Router();

//List all the products
router.get('/', getProducts );

//Get a product by ID
router.get('/:id',[
    check('id', 'This is not a valid ID').isMongoId().bail().custom( productExistByID ),
    validateFields
],  getProduct );

//Create products
router.post('/', [
    validateJWT,
    check('name', 'The name is required').not().isEmpty(),
    check('category', 'It is not a valid ID').isMongoId(),
    check('category').custom( categoryExistByID ),
    validateFields
], createProduct );


router.put('/:id',[
    validateJWT,
    //check('category', 'It is not a valid ID').isMongoId(),
    check('id', 'This is not a valid ID').isMongoId().bail().custom( productExistByID ),
    validateFields
], updateProduct );

router.delete('/:id',[
    validateJWT,
    check('id', 'This is not a valid ID').isMongoId().bail().custom( productExistByID ),
    hasRole('ADMIN_ROLE'),
    validateFields
], deleteProduct);

module.exports = router;