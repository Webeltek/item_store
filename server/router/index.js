const router = require('express').Router();
const users = require('./users');
const items = require('./items');
const messages = require('./messages');
const likes = require('./likes');
const test = require('./test');
const { userController } = require('../controllers');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.post('/verify_gtoken', userController.verifyGtoken)

router.use('/users', users);
router.use('/items', items);
router.use('/messages', messages);
router.use('/likes', likes);
router.use('/test', test);

module.exports = router;
