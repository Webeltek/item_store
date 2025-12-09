const express = require('express');
const router = express.Router();
const { userController } = require('../controllers');
const { auth } = require('../utils');

router.get('/profile', auth(),userController.getProfileInfo);
router.put('/profile', auth(),userController.editProfileInfo);
router.get('/delete_profile', auth(), userController.deleteProfile);


module.exports = router