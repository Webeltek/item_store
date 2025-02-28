const express = require('express');
const router = express.Router();
const { auth } = require('../utils');
const { messageController } = require('../controllers');

// middleware that is specific to this router

router.get('/', messageController.getLatestMessages);
router.get('/:itemId', messageController.getMessages);
router.post('/:itemId', auth(), messageController.createMessage);

router.put('/:itemId/:messageId', auth(), messageController.editMessage);
router.delete('/:itemId/:messageId', auth(), messageController.deleteMessage);

module.exports = router