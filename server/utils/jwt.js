import jwt from 'jsonwebtoken';

const secret = process.env.SECRET || 'SoftSecret';

function createToken(data) {
    return jwt.sign(data, secret, { expiresIn: '12h' });
}

function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
}

export default {
    createToken,
    verifyToken
}