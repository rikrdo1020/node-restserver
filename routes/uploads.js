const { Router } = require('express');
const { check } = require('express-validator');
const { loadFile, updateImage, showImage, updateImageCloudinary } = require('../controllers/uploads');
const { allowedCollections } = require('../helpers');

const { validateFields, validateFileUpload } = require('../middlewares');

const router = Router();

router.post('/',validateFileUpload, loadFile)

router.put('/:collection/:id', [
    validateFileUpload,
    check('id','It must be a Mongo ID').isMongoId(),
    check('collection').custom( c => allowedCollections(c, ['users', 'products'])),
    validateFields
], updateImageCloudinary)

router.get('/:collection/:id',[
    check('id','It must be a Mongo ID').isMongoId(),
    check('collection').custom( c => allowedCollections(c, ['users', 'products'])),
    validateFields
],
showImage)

module.exports = router;