import config from './config.js';
import mongoose from 'mongoose';

export default () => {
  return mongoose.connect(config.dbURL, {
    dbName: 'itemstore',
  });
};
