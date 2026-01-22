import { userModel, messageModel, itemModel } from '../models/index.js';
import { formidable } from 'formidable';
import { log } from 'node:console';
import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getLatestItems(req, res, next) {
    const limit = Number(req.query.limit) || 0;

    itemModel.find()
        .sort({ created_at: -1 })
        .limit(limit)
        .then(items => {
            res.status(200).json(items)
        })
        .catch(next);
}

function getItem(req,res, next){
    const itemId = req.params.itemId
    itemModel.findById(itemId)
    .populate({
        path: 'msgList',
        populate: {
            path: 'authorId'
        }
    })
    .then(result => {
        
        if(result === null){
            const err = new Error('Not found');
            err.status = 404;
            return next(err); 
        }
        res.status(200).json(result)
    })
    .catch( err=>{
        if(err.name === 'CastError' && err.kind === 'ObjectId'){
            const err = new Error('Not found');
            err.status = 404;
            return next(err);
        }
        throw err;
    })
    .catch(next);
}

function getItems(req,res, next){
    itemModel.find().then(items => {
        res.status(200).json(items)
    })
    .catch(next);
}

function getOwnedItems(req,res, next){
    const { _id: userId } = req.user;
    itemModel.find({ owner: userId}).then(items => {
        res.status(200).json(items)
    })
    .catch(next);
}

function getOrderedItems(req,res, next){
    const { _id: userId } = req.user;
    itemModel.find({ orderList: { $in: [userId]}}).then(items => {
        res.status(200).json(items)
    })
    .catch(next);
}

function createItem(req, res, next) {
    const contentType = req.headers['content-type'];
    
    const { _id: userId } = req.user;

    const itemData = req.body;
    const { model, screenSize, description, price,image} = itemData;
    //using appliaction/json body
    if(itemData && contentType==='application/json'){
        return itemModel.create({ model, screenSize, description, price: Number(price),image, owner: userId })
        .then(item => {
            res.status(200).json(item)
        })
        .catch(next)
    }
    //using formidable form.parse from multipart/form-data

    const uploadDir = path.join(__dirname, '../uploads');

    if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    }

    const form = formidable({
        uploadDir,
        keepExtensions: true
    })
    
    form.parse(req, (err,fields,files)=>{
        if (err){
            next(err);
            return;
        }
        console.log({itemControllerFields: fields});
        

        const [ model] = fields.model;
        const [screenSize] = fields.screenSize;
        const [ price] = fields.price;
        const [ image] = fields.image;
        const [description] = fields.description;


        if(files.imageFile){
            const [persistentFile] = files.imageFile;
            const webPath = `${persistentFile.originalFilename}`;
            const newPath = path.join(form.uploadDir, persistentFile.originalFilename);
            
            fs.rename(persistentFile.filepath, newPath,()=>{
                //console.log("Formidable fields, files", {fields, files});
                return itemModel.create({ model, screenSize, description, price: Number(price),image,imageFile: webPath , owner: userId })
                    .then(item => {
                        res.status(200).json(item)
                    })
                    .catch(next)
            })
        } else {
            return itemModel.create({ model, screenSize, description, price: Number(price),image, owner: userId })
                    .then(item => {
                        res.status(200).json(item)
                    })
                    .catch(next)
        }
        

    })

}

function editItem(req, res, next) {
    const contentType = req.headers['content-type'];

    const { itemId } = req.params;
    const { _id: userId } = req.user;

    const itemData = req.body;
    const { model, screenSize, description, price,image} = itemData;
    //using appliaction/json body
    if(itemData && contentType==='application/json'){
        return itemModel.findOneAndUpdate(
            { _id: itemId },
            { model, screenSize, description, price: Number(price),image, owner: userId },
            { new: true })
        .then(item => {
            res.status(200).json(item)
        })
        .catch(next)
    }

    const uploadDir = path.join(__dirname, '../uploads');
    
    const form = formidable({
        uploadDir,
        keepExtensions: true
    })

    form.parse(req, (err,fields,files)=>{
        if (err){
            next(err);
            return;
        }
        const [ model] = fields.model;
        const [screenSize] = fields.screenSize;
        const [ price] = fields.price;
        const [ image] = fields.image;
        const [description] = fields.description;

        if(files.imageFile){
            const [persistentFile] = files.imageFile;
            const webPath = `${persistentFile.originalFilename}`;
            const newPath = path.join(form.uploadDir, persistentFile.originalFilename);
            
            fs.rename(persistentFile.filepath, newPath,(err)=>{
                if(err){
                    console.log({editItemCopyFileErr: err})
                }
                // if the userId is not the same as this one of the item, the item will not be updated
                itemModel.findOneAndUpdate(
                    { _id: itemId, owner: userId }, 
                    { model, screenSize, description, price: Number(price),image,imageFile: webPath , owner: userId }, 
                    { new: true })
                    .then(updatedItem => {
                        if (updatedItem) {
                            res.status(200).json(updatedItem);
                        }
                        else {
                            res.status(401).json({ message: `Not allowed!`,
                                err: {
                                    message: `Not allowed!`
                                }
                             });
                        }
                    })
                    .catch(next);
            })
        } else {
            // if the userId is not the same as this one of the item, the item will not be updated
            itemModel.findOneAndUpdate(
                { _id: itemId, owner: userId }, 
                { model, screenSize, description, price: Number(price),image ,imageFile: '', owner: userId }, 
                { new: true })
                .then(updatedItem => {
                    if (updatedItem) {
                        res.status(200).json(updatedItem);
                    }
                    else {
                        res.status(401).json({ message: `Not allowed!`,
                            err: {
                                message: `Not allowed!`
                            }
                         });
                    }
                })
                .catch(next);
        }
        
    })

}

function deleteItem(req, res, next) {
    const { itemId } = req.params;
    const { _id: userId } = req.user;

    const uploadDir = path.join(__dirname, '../uploads');

    Promise.all([
        itemModel.findOneAndDelete({ _id: itemId, owner: userId }),
        userModel.findOneAndUpdate({ _id: userId }, { $pull: { items: itemId } }),
        messageModel.deleteMany({ itemId: itemId }),
    ])
        .then(([deletedOne, _, __]) => {
            if (deletedOne) {
                const imageFilePath = uploadDir + '/'+ deletedOne.imageFile;
                console.log({imageFilePath: imageFilePath})
                if (fs.existsSync(imageFilePath) && deletedOne.imageFile) {
                    fs.unlink(imageFilePath, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                        return;
                    }
                    console.log('Item and image file deleted successfully!');
                    });
                } else {
                    console.log('Item without image file deleted successfuly!');
                }
                //returning updated collection instead of deleted item
                itemModel.find().then(items => {
                    res.status(200).json(items);
                })
                // res.status(200).json(deletedOne)
            } else {
                res.status(401).json({ message: `Not allowed!`,
                    err: {
                        message: `Not allowed!`
                    }
                 });
            }
        })
        .catch(next);
}

function order(req, res, next) {
    const { itemId } = req.params;
    const { _id: userId } = req.user;

    console.log('order')

    itemModel.findOneAndUpdate({ _id: itemId }, 
        { $addToSet: { orderList: userId } }, 
        { new: true })
        .then((orderedItem) => res.status(200).json(orderedItem))
        .catch(next)
}

export {
    getLatestItems,
    getItem,
    getItems,
    getOwnedItems,
    getOrderedItems,
    createItem,
    editItem,
    deleteItem,
    order,
}
