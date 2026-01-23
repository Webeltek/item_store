import express from 'express';
import { auth } from '../utils/index.js';
import { messageController } from '../controllers/index.js';

const router = express.Router();

// middleware that is specific to this router

router.put('/:messageId', auth(), messageController.like);

export default router
