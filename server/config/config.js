const path = require('path');
const env = process.env.NODE_ENV || 'development';
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
        serviceAccount: require('../tv-store-2025-serv-acc-key.json')
    } : '',
    production: env === 'production' ?  {
        port: process.env.PORT || 3100,
        dbURL: process.env.DB_URL_CREDENTIALS,
        origin: [
            process.env.ORIGIN_RENDER,
            process.env.ORIGIN_FIREBASE,
            process.env.ORIGIN_FIREBASE2,
            'http://localhost:4173', 
            'http://localhost:5173',
            'http://localhost:4173'],
        serviceAccount: JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY || '{}')    
    } : ''
};

module.exports = config[env];
