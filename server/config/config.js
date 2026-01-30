import path from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const env = process.env.NODE_ENV || 'development';
const VITE_API_URL_0='https://item-store-rest-api.onrender.com/api'
const VITE_API_URL='https://item-store-server-service-346940718639.europe-west4.run.app/api'
//included CORS origins for running locally with remote backend
// when running frontend with npm run preview it runs on none default port 4173    
const config = {
    development: env === 'development' ? {
        port: process.env.PORT || 3100,
        dbURL: 'mongodb://127.0.0.1:27017/itemstore',
        origin: [
            'http://localhost:4173',
            'http://localhost:4174',
            'http://localhost:5173'
        ],
        serviceAccount: JSON.parse(readFileSync(path.join(__dirname, '../tv-store-2025-serv-acc-key.json'), 'utf-8')),
        get expressApiUrl() { return `http://localhost:${this.port}/api` },
        imagesStorage: 'firebaseStorage',
        storageBucket: "tv-store-2025.firebasestorage.app"
    } : '',
    production: env === 'production' ?  {
        port: process.env.PORT || 3100,
        dbURL: process.env.DB_URL_CREDENTIALS,
        origin: [
            process.env.ORIGIN_RENDER,
            process.env.ORIGIN_FIREBASE,
            process.env.ORIGIN_FIREBASE2,
            process.env.ORIGIN_FIREBASE3,
            'http://localhost:4173', 
            'http://localhost:5173',
            'http://localhost:4173'],
        serviceAccount: JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY || '{}'),
        expressApiUrl: VITE_API_URL,
        imagesStorage: 'firebaseStorage',
        storageBucket: "tv-store-2025.firebasestorage.app"
           
    } : ''
};

export default config[env];
