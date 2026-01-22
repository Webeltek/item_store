import express from 'express';
import { userController } from '../controllers/index.js';
import { auth } from '../utils/index.js';

const router = express.Router();

router.get('/profile', auth(),userController.getProfileInfo);
router.put('/profile', auth(),userController.editProfileInfo);
router.get('/delete_profile', auth(), userController.deleteProfile);


export default router