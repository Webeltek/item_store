import validatePath from '../imageUpload/validatePath.js';
import multerFile from '../imageUpload/[auth,validatePath]multerFile.js';
import verifyImages from '../imageUpload/[multerFile]verifyImages[upload].js';
import upload from '../imageUpload/[multerFile]upload.js';

export {
    validatePath,
    multerFile,
    verifyImages,
    upload
}