const router = require('express').Router();
const users = require('./users');
const items = require('./items');
const messages = require('./messages');
const likes = require('./likes');
const test = require('./test');
const { authController } = require('../controllers');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/verify_gtoken', authController.verifyGtoken)

router.use('/users', users);
router.use('/items', items);
router.use('/messages', messages);
router.use('/likes', likes);
router.use('/test', test);

module.exports = router;
