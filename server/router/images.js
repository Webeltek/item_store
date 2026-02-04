import express from 'express';
import { auth } from '../utils/index.js';
import { imageUploadController, imageDeleteController } from '../controllers/index.js';

const router = express.Router();

router.post(/^\/upload\/(.*)$/, (req,res,next)=>{
    next();
}, auth(), 
    imageUploadController.validatePath, 
    imageUploadController.multerFile, 
    imageUploadController.upload, 
    imageUploadController.verifyImages);

router.delete(/^\/delete\/(.*)$/, auth(), 
    imageDeleteController.deleteImage);
              

export default router;    