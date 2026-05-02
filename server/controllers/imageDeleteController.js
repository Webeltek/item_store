import path from 'path';
import { CONSTANTS } from '../utils/helpers.js';
import fs from 'fs/promises';
import config from '../config/config.js';
import firebaseAdmin from 'firebase-admin';

const imageDeleter = config["imagesStorage"] === 'firebaseStorage'
    ? firebaseDeleter
    : localDeleter;
    
export async function deleteImage(req, res,next) {
    //unused    
    const subdir = req.params[0] || '';

    // Read files from query params instead of request body
    const singleFile = req.query.file;
    const multipleFiles = req.query.files;

    try {
        // Handle multiple files from query params (array)
        if (multipleFiles && (Array.isArray(multipleFiles) || typeof multipleFiles === 'string')) {
            const filesToDelete = Array.isArray(multipleFiles) ? multipleFiles : [multipleFiles];
            const results = await Promise.allSettled(
                filesToDelete.map((f) => imageDeleter(f))
            );
            const failed = results
                .map((r, idx) => ({ r, idx }))
                .filter(x => x.r.status === 'rejected')
                .map(x => ({ index: x.idx, reason: x.r.reason?.message || x.r.reason }));

            if (failed.length) {
                return res.status(500).json({ message: 'Some files failed to delete', failed });
            }

            return res.status(200).json({ message: 'Files deleted successfully' });
        }

        if (singleFile) {
            await imageDeleter(singleFile);
            return res.status(200).json({ message: 'File deleted successfully' });
        }

        return res.status(400).json({ message: 'No file(s) provided' });
    } catch (error) {
        next(error);
    }
}

export async function deleteImagesByItem(item){
    const filesToDelete = item.images?.map((img) => img.path) || [];
    const results = await Promise.allSettled(
        filesToDelete.map((f) => imageDeleter(f))
    );
    const failed = results
        .map((r, idx) => ({ r, idx }))
        .filter(x => x.r.status === 'rejected')
        .map(x => ({ index: x.idx, reason: x.r.reason?.message || x.r.reason }));

    if (failed.length) {
        const error = new Error('Some files failed to delete');
        error.failedFiles = failed;
        throw error;
    }

    return true;
}

async function localDeleter(filePath) {
    const relativePath = filePath.replace(/^\/?assets/, '');
    const fullPath = path.join(CONSTANTS.MEDIAPATH, relativePath);
    try {
        await fs.unlink(fullPath);
    } catch (error) {
        throw error;
    }
}

async function firebaseDeleter(filePath) {
    console.log('imagePath',filePath);
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