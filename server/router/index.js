import express from 'express';
import users from './users.js';
import items from './items.js';
import messages from './messages.js';
import likes from './likes.js';
import test from './test.js';
import { userController } from '../controllers/index.js';
import images from './images.js';

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.post('/verify_gtoken', userController.verifyGtoken)

router.use('/users', users);
router.use('/items', items);
router.use('/images', images);
router.use('/messages', messages);
router.use('/likes', likes);
router.use('/test', test);

export default router;
