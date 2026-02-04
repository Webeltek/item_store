import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import dbConnector from './config/db.js';
import apiRouter from './router/index.js';
import cors from 'cors';
import express from 'express';
import firebaseAdmin from 'firebase-admin';
import errorHandler from './utils/errHandler.js';
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { GraphQLError } from 'graphql';
import typeDefs from './graphql/schema.js';
import resolvers from './graphql/resolvers.js';
import auth from './utils/auth.js';
import config from './config/config.js';
import initExpress from './config/express.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

global.__basedir = __dirname;
dotenv.config()

dbConnector()
  .then(( mongoose ) => {
    mongoose.set('strictQuery', true); // to suppress deprecation warning

    const app = express();
    initExpress(app);

    app.use(cors({
      origin: config.origin,
      credentials: true
    }));

    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(config['serviceAccount']),
      storageBucket: config['storageBucket']
    })

    // if node process is runned from directory other than server,
    // use absolute path to 'public' folder
    // app.use('/assets', express.static(path.join(__dirname, 'public')))

    app.use('/api/assets', express.static('public/media'))

    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
    });

    apolloServer.start().then( () => {
      app.use(
        '/api/graphql',
        auth(true),
        expressMiddleware(apolloServer, {
          context: ({ req, res }) => {
            if (req && req.authError) {
              throw new GraphQLError(req.authError.message, { extensions: { code: 'UNAUTHENTICATED' } });
            }

            return Promise.resolve({
              user: req.user,
              isLogged: req.isLogged || false
            });
          },
        }),
      );

      app.use('/api', apiRouter);
  
      app.use(errorHandler);
  
      app.listen(config.port, console.log(`Listening on port ${config.port}!`));
    })

  })
  .catch(console.error);