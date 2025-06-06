const jwt = require('./jwt');
const { authCookieName } = require('../app-config');
const {
    userModel,
    tokenBlacklistModel
} = require('../models');

function auth(redirectUnauthenticated = true) {

    return function (req, res, next) {

// using  authorization header instead    
        // const token = req.cookies[authCookieName] || '';

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
                if (['token expired', 'blacklisted token', 'jwt must be provided'].includes(err.message)) {
                    if(req.url !== '/profile'){
                        console.error(err); // prevent frontend getProfile error logs when guest access 
                    }
                    res
                        .status(401)
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

module.exports = auth;
