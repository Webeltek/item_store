import express from 'express';
import { auth } from '../utils/index.js';
import { itemController, messageController } from '../controllers/index.js';

const router = express.Router();

// middleware that is specific to this router

router.get('/', itemController.getItems);
router.get('/owned', auth(), itemController.getOwnedItems);
router.get('/ordered', auth(), itemController.getOrderedItems);
router.get('/latest', itemController.getLatestItems);
router.post('/', auth(), itemController.createItem);
router.get('/:itemId', itemController.getItem);
router.put('/:itemId',auth(), itemController.editItem)
router.put('/:itemId/order',auth(), itemController.order)
router.delete('/:itemId',auth(), itemController.deleteItem)


// router.get('/my-trips/:id/reservations', auth(), itemController.getReservations);

export default router