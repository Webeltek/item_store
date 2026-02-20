import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const saltRounds = Number(process.env.SALTROUNDS) || 5;
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    isAdmin: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    isFirebaseUser: {
        type: Boolean
    },
    username: {
        type: String,
        required: true,
        minlength: [5, 'Username should be at least 5 characters'],
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9\s]+$/.test(v);
            },
            message: props => `${props.value} must contains only latin letters and digits!`
        },
    },
    password: {
        type: String,
        required: true,
        minlength: [5, 'Password should be at least 5 characters']
    },
    telephone: {
        type: String,
        required: false
    },
    address: {
        type: {
            streetAddress: {
                type: String,
                minlength: [3, 'Street should be at least 3 chars!'],
                validate: {
                validator: function (v) {
                    return /^(?=.*\d).+$/g.test(v);
                },
                message: props => `Street: ${props.value} must contain street number!`,
                },
            },
            postalCode: {
                type: Number,
            },
            city: {
                type: String,
                minlength: [3, 'City should be 3 chars!'],
            },
        },
        required: false,
        validate: {
            validator: function (v) {
                // If address is not provided, validation passes
                if (!v) {
                return true;
                }
                // If address is provided, all nested fields must be present
                return v.streetAddress && v.postalCode && v.city;
            },
            message: 'If address is provided, streetAddress, postalCode, and city are required',
        },
    },
    items: [{
        type: ObjectId,
        ref: "Item"
    }],
    msgList: [{
        type: ObjectId,
        ref: "Message"
    }]
}, { timestamps: { createdAt: 'created_at' } });

userSchema.methods = {
    matchPassword: function (password) {
        return bcrypt.compare(password, this.password);
    },
    validatePassword: function (plainPassword) {
        if (!plainPassword || plainPassword.length < 5) {
            throw new Error('Password should be at least 5 characters');
        }
        if (!/^[a-zA-Z0-9\s]+$/.test(plainPassword)) {
            throw new Error('Password must contains only latin letters and digits!');
        }
        return true;
    }
}

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) {
                next(err);
            }
            bcrypt.hash(this.password, salt, (err, hash) => {
                if (err) {
                    next(err);
                }
                this.password = hash;
                next();
            })
        })
        return;
    }
    next();
});


export default mongoose.model('User', userSchema);
