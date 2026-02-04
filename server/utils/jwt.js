import jwt from 'jsonwebtoken';

const secret = process.env.SECRET || 'SoftSecret';

function createToken(data) {
    return new Promise((resolve, reject) => {
        jwt.sign(data, secret, { expiresIn: '12h', algorithm: 'HS256' }, (err, token) => {
            if (err) return reject(err);
            resolve(token);
        });
    });
}

function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, { algorithms: ['HS256'] }, (err, data) => {
            if (err) return reject(err);
            resolve(data);
        });
    });
}

export default {
    createToken,
    verifyToken
}