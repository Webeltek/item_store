const {
    userModel,
    tokenBlacklistModel
} = require('../models');

const firebaseAdmin = require('firebase-admin');

const utils = require('../utils');
const { authCookieName } = require('../app-config');

const bsonToJson = (data) => { return JSON.parse(JSON.stringify(data)) };
const removePassword = (data) => {
    const { password, __v, ...userData } = data;
    return userData
}

function verifyGtoken(req, res, next){
    const { idToken } = req.body; 
    if(!idToken) return res.status(400).json({
        message: 'Invalid token',
        err: {
            message: 'Invalid token'
        }
    });

    firebaseAdmin.auth().verifyIdToken(idToken)
    .then( decodedToken => {
        const { uid, email, name } = decodedToken;
        userModel.findOne({ email} )
            .then( result => {
                if(result === null){
                    userModel.create({ username : name, email: email, password: uid })
                        .then( createdUser => {
                            createdUser = bsonToJson(createdUser);
                            createdUser = removePassword(createdUser);
                            const token = utils.jwt.createToken({ id: createdUser._id });
                            res.status(200)
                            .send({...createdUser, accessToken: token}); 
                        }).catch(next); 
                } else {
                    foundUser = result
                    foundUser = bsonToJson(foundUser);
                    foundUser = removePassword(foundUser);
                    const token = utils.jwt.createToken({ id: foundUser._id });
                            res.status(200)
                            .send({...foundUser, accessToken: token}); 
                }
            }).catch(next)
    }).catch(next)
}

function register(req, res, next) {
    const { username,email, password, rePassword } = req.body;

    return userModel.create({ username, email, password })
        .then((createdUser) => {
            createdUser = bsonToJson(createdUser);
            createdUser = removePassword(createdUser);

            const token = utils.jwt.createToken({ id: createdUser._id });
//using authorization header instead of cookie

            // if (process.env.NODE_ENV === 'production') {
            //     res.cookie(authCookieName, token, { httpOnly: true, sameSite: 'none', secure: true })
            // } else {
            //     res.cookie(authCookieName, token, { httpOnly: true })
            // }

            res.status(200)
                .send({...createdUser, accessToken: token});
        })
        .catch(err => {
            if (err.name === 'MongoError' && err.code === 11000) {
                let field = err.message.split("index: ")[1];
                field = field.split(" dup key")[0];
                field = field.substring(0, field.lastIndexOf("_"));
                
                res.status(409)
                    .send({ 
                        message: `This ${field} is already registered!`,
                        err : {
                                message: `This ${field} is already registered!`
                            }
                        });
                return;
            }
            next(err);
        });
}

function login(req, res, next) {
    const { email, password } = req.body;

    userModel.findOne({ email })
        .then(user => {
            return Promise.all([user, user ? user.matchPassword(password) : false]);
        })
        .then(([user, match]) => {
            if (!match) {
                res.status(401)
                    .send({ 
                        message: 'Wrong email or password',
                        err: {
                            message: 'Wrong email or password'
                        } });
                return
            }
            user = bsonToJson(user);
            user = removePassword(user);

            const token = utils.jwt.createToken({ id: user._id });

            // if (process.env.NODE_ENV === 'production') {
            //     res.cookie(authCookieName, token, { httpOnly: true, sameSite: 'none', secure: true })
            // } else {
            //     res.cookie(authCookieName, token, { httpOnly: true })
            // }

            res.status(200)
                .send({ ...user, accessToken: token});
        })
        .catch(next);
}

function logout(req, res) {
    // const token = req.cookies[authCookieName];
    const token = req.get('X-Authorization');

    tokenBlacklistModel.create({ token })
        .then(() => {
            //res.clearCookie(authCookieName)
                res.status(204)
                .send();
        })
        .catch(err => res.send(err));
}

function getProfileInfo(req, res, next) {
    const { _id: userId } = req.user;

    userModel.findOne({ _id: userId }, { password: 0, __v: 0 }) //finding by Id and returning without password and __v
        .then(user => { res.status(200).json(user) })
        .catch(next);
}

function editProfileInfo(req, res, next) {
    const { _id: userId } = req.user;
    const { username, email } = req.body;

    const token = req.get('X-Authorization');

    userModel.findOneAndUpdate({ _id: userId }, { username, email }, { runValidators: true, new: true })
        .then(user => {
            user = bsonToJson(user);
            user = removePassword(user);
             
            res.status(200).json({ ...user, accessToken: token}) })
        .catch(next);
}

module.exports = {
    login,
    verifyGtoken,
    register,
    logout,
    getProfileInfo,
    editProfileInfo,
}
