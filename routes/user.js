
const { Router } = require('express');
const { usersGet, usersPut, usersPost, usersPatch, usersDelete } = require('../controllers/users');

const router = Router();

router.get('/',  usersGet );

router.put('/:id', usersPut)

router.post('/', usersPost)

router.patch('/', usersPatch);

router.delete('/', usersDelete);

module.exports = router;