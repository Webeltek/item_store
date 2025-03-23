const { userModel, itemModel, messageModel } = require('../models');

function newMessage(text, userId, itemId) {
    return messageModel.create({ text, authorId: userId, itemId })
        .then(message => {

            return itemModel.findByIdAndUpdate(
                { _id: itemId }, 
                { $push: { msgList: message._id }}, 
                { new: true }
            ).then(()=> messageModel.findById(message._id).populate('authorId'))
        })
}

function getLatestMessages(req, res, next) {
    const limit = Number(req.query.limit) || 0;

    messageModel.find()
        .sort({ created_at: -1 })
        .limit(limit)
        .populate('authorId')
        .then(messages => {
            res.status(200).json(messages)
        })
        .catch(next);
}

function getMessages(req, res, next){
    const itemId = req.params.itemId;
    messageModel.find({ itemId})
    .populate('authorId')
    .then(messages =>{
        res.status(200).json(messages)
    })
    .catch(next)
}

function createMessage(req, res, next) {
    const { itemId } = req.params;
    const { _id: userId } = req.user;
    const { messageText } = req.body;
    

    newMessage(messageText, userId, itemId)
        .then(( updatedMsg) => res.status(200).json(updatedMsg))
        .catch(next);
}

function editMessage(req, res, next) {
    const { messageId } = req.params;
    const { messageText } = req.body;
    const { _id: userId } = req.user;

    // if the userId is not the same as this one of the message, the message will not be updated
    messageModel.findOneAndUpdate({ _id: messageId, userId }, { text: messageText }, { new: true })
        .then(updatedMessage => {
            if (updatedMessage) {
                res.status(200).json(updatedMessage);
            }
            else {
                res.status(401).json({ message: `Not allowed!` });
            }
        })
        .catch(next);
}

function deleteMessage(req, res, next) {
    const { messageId, itemId } = req.params;
    const { _id: userId } = req.user;

    Promise.all([
        messageModel.findOneAndDelete({ _id: messageId, userId }),
        userModel.findOneAndUpdate({ _id: userId }, { $pull: { messages: messageId } }),
        itemModel.findOneAndUpdate({ _id: itemId }, { $pull: { messages: messageId } }),
    ])
        .then(([deletedOne, _, __]) => {
            if (deletedOne) {
                res.status(200).json(deletedOne)
            } else {
                res.status(401).json({ message: `Not allowed!` });
            }
        })
        .catch(next);
}

function like(req, res, next) {
    const { messageId } = req.params;
    const { _id: userId } = req.user;

    console.log('like')

    messageModel.updateOne({ _id: messageId }, { $addToSet: { likes: userId } }, { new: true })
        .then(() => res.status(200).json({ message: 'Liked successful!' }))
        .catch(next)
}

module.exports = {
    getLatestMessages,
    getMessages,
    newMessage,
    createMessage,
    editMessage,
    deleteMessage,
    like,
}
