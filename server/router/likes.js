const express = require('express');
const router = express.Router();
const { auth } = require('../utils');
const { messageController } = require('../controllers');

// middleware that is specific to this router

router.put('/:messageId', auth(), messageController.like);

module.exports = router
