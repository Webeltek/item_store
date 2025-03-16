const env = process.env.NODE_ENV || 'development';

const config = {
    development: {
        port: process.env.PORT || 3100,
        dbURL: 'mongodb://127.0.0.1:27017/itemstore',
        origin: ['http://localhost:5173']
    },
    production: {
        port: process.env.PORT || 3100,
        dbURL: process.env.DB_URL_CREDENTIALS,
        origin: ['']
    }
};

module.exports = config[env];
