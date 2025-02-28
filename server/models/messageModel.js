const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    authorId: {
        type: ObjectId,
        ref: "User"
    },
    itemId: {
        type: ObjectId,
        ref: "Item"
    },
}, { timestamps: { createdAt: 'created_at' } });

const messageModel = mongoose.model('Message', messageSchema);


module.exports = messageModel;
