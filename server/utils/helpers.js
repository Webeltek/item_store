import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootPath = path.resolve(__dirname, '..');

export const CONSTANTS = Object.freeze({
  ROOTPATH: rootPath,
  MEDIAPATH: path.resolve(rootPath, 'public/media'),
});
