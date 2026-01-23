import express from 'express';
import { auth } from '../utils/index.js';
import { messageController } from '../controllers/index.js';

const router = express.Router();

// middleware that is specific to this router

router.get('/', messageController.getLatestMessages);
router.get('/:itemId', messageController.getMessages);
router.post('/:itemId', auth(), messageController.createMessage);

router.put('/:itemId/:messageId', auth(), messageController.editMessage);
router.delete('/:itemId/:messageId', auth(), messageController.deleteMessage);

export default router