import path from 'path';
import { CONSTANTS } from '../utils/helpers.js';
import fs from 'fs/promises';
import config from '../config/config.js';
import firebaseAdmin from 'firebase-admin';

export async function deleteImage(req, res,next) {
    const imageDeleter = config["imagesStorage"] === 'firebaseStorage'
        ? firebaseDeleter
        : localDeleter;
    const subdir = req.params[0] || '';
    const filename = req.body.file;
    try {
        await imageDeleter(filename);
        res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
        next(error);
    }
}

async function localDeleter(filePath) {
    const fullPath = path.join(CONSTANTS.MEDIAPATH, filePath);
    try {
        await fs.unlink(fullPath);
        res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
        throw error;
    }
}

async function firebaseDeleter(filePath) {
    const firebaseStoragePath = getStoragePathFromUrl(filePath);
    try {
        const bucket = firebaseAdmin.storage().bucket();
        const file = bucket.file(firebaseStoragePath);
        await file.delete();
    } catch (error) {
        throw error;
    }

}

function getStoragePathFromUrl(url) {
  const decoded = decodeURIComponent(url);
  const parts = decoded.split(".app/")[1];
  return parts;
}