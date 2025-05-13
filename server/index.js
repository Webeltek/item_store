global.__basedir = __dirname;
require('dotenv').config()
const dbConnector = require('./config/db');
// const mongoose = require('mongoose');
const apiRouter = require('./router');
const cors = require('cors');
const firebaseAdmin = require('firebase-admin');
// const config = require('./config/config');
const { errorHandler } = require('./utils');

dbConnector()
  .then(() => {
    const config = require('./config/config');

    const app = require('express')();
    require('./config/express')(app);


    app.use(cors({
      origin: config.origin,
      credentials: true
    }));


    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(config['serviceAccount']),
    })

    const express = require('express');

    app.use('/uploads', express.static('uploads'))

    app.use('/api', apiRouter);

    app.use(errorHandler);

    app.listen(config.port, console.log(`Listening on port ${config.port}!`));
  })
  .catch(console.error);