const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = Number(process.env.SALTROUNDS) || 5;

const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
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
                return /[a-zA-Z0-9]+/g.test(v);
            },
            message: props => `${props.value} must contains only latin letters and digits!`
        },
    },
    password: {
        type: String,
        required: true,
        minlength: [5, 'Password should be at least 5 characters'],
        validate: {
            validator: function (v) {
                return /[a-zA-Z0-9]+/g.test(v);
            },
            message: props => `${props.value} must contains only latin letters and digits!`
        },
    },
    telephone: {
        type: String,
        required: false
    },
    address: {
        //required: false, not necessery because in Mongoose Schema properties are optional by default
        streetAddress: {
            type : String,
            required: true,
            minlength: [3, 'Street should be at least 3 chars!'],
            validate: {
                validator: function (v) {
                    return /^(?=.*\d).+$/g.test(v);
                },
                message: props => `Street: ${props.value} must contain street number!`
            },
        },
        postalCode: {
            type: Number,
            required: true
        },
        city: {
            type: String,
            required: true,
            minlength: [3, 'City should be 3 chars!']
        }
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


module.exports = mongoose.model('User', userSchema);
