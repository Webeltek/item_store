import fs from 'fs/promises';
import path from 'path';
import { CONSTANTS } from '../utils/helpers.js';
import config from '../config/config.js';
import firebaseAdmin from 'firebase-admin';

/**
 * Upload files to the specified destination path.
 * @param {Array} files an array of files in the format of {name: String, data: Buffer}
 * @param {String} destinationPath the destination path
 */
export const uploadFile = async (
  files,
  destinationPath
) => {
  const fileUploader = config["imagesStorage"] === 'firebaseStorage'
    ? firebaseUploader
    : localUploader;

  const results = await fileUploader.upload(files, destinationPath);
  return results;
};

const localUploader = {
  upload: async (
    files,
    destinationPath
  ) => {
    // Assumming the we are using MemoryStorage for multer. Now we need to write the files to disk.
    // The files argument is an array of files from multer.
    const mediaPath = CONSTANTS.MEDIAPATH;
    const destination = path.join(mediaPath, destinationPath);
    // Create the destination folder if it does not exist
    await fs.mkdir(destination, { recursive: true });
    // Save the files to disk asynchrously
    const results = await Promise.all(
      files.map((file) =>
        fs
          .writeFile(path.join(destination, file.filename), file.buffer)
          .then(() => ({
            name: file.filename,
            mimetype: file.mimetype,
            size: file.size,
            url: 
              path
                .join('/assets',destinationPath, file.filename)
                .split('\\')
                .join('/')
                //.replace(/^\//, '')
            
          }))
      )
    );
    return results;
  }
};

const firebaseUploader = {
  upload: async (
    files,
    destinationPath
  ) => {
    const bucket = firebaseAdmin.storage().bucket();
    const results = await Promise.all(
      files.map(async (file) => {
        const fileUpload = bucket.file(path.join(destinationPath, file.filename));

        await fileUpload.save(file.buffer, {
          metadata: { contentType: file.mimetype },
        });
        // Make the file publicly accessible
        await fileUpload.makePublic();
        return {
          name: file.filename,
          mimetype: file.mimetype,
          size: file.size,
          url: fileUpload.publicUrl(),
        };
      })
    );
    return results;
  }
};
