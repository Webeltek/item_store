import jwt from './jwt.js';
import appConfig from '../app-config.js';
import { userModel, tokenBlacklistModel } from '../models/index.js';

const { authCookieName } = appConfig;

function auth(redirectUnauthenticated = true) {

    return function (req, res, next) {
        // const token = req.cookies[authCookieName] || '';
        // using  authorization header instead    

        const token = req.get('X-Authorization');
        
        Promise.all([
            jwt.verifyToken(token),
            tokenBlacklistModel.findOne({ token })
        ])
            .then(([data, blacklistedToken]) => {
                if (blacklistedToken) {
                    return Promise.reject(new Error('blacklisted token'));
                }
                userModel.findById(data.id)
                    .then(user => {
                        req.user = user;
                        req.isLogged = true;
                        next();
                    })
            })
            .catch(err => {
                if (!redirectUnauthenticated) {
                    next();
                    return;
                }

                if (['jwt expired', 'blacklisted token', 'jwt must be provided'].includes(err.message)) {
                    // If this request is for the GraphQL endpoint, forward the auth error
                    // to the GraphQL middleware by attaching it to the request and calling next().
                    // Apollo's context can then convert it to a GraphQLError.
                    const isGraphql = req.originalUrl && req.originalUrl.startsWith('/api/graphql');
                    if (isGraphql) {
                        req.authError = err;
                        next();
                        return;
                    }

                    if(req.url !== '/profile'){
                        process.env.NODE_ENV === 'development' &&
                        console.error(err); // prevent frontend getProfile error logs when guest access 
                    }
                    res.status(401)
                    .send({ message: "Invalid token!" ,
                        err : {
                            message: err.message
                        }
                    });
                    return;
                }
                next(err);
            });
    }
}

export default auth;
