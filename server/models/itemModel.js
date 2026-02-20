import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const itemSchema = new Schema({
    name: {
        type: String,
        required:true,
        minLength: 5
    },
    description: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required:true,
        validate: {
            validator : function(value){
                return value >= 0;
            },
            message: 'Stock must be non-negative num'
        }
    },
    price: {
        type: Number,
        required:true,
        validate: {
            validator : function(value){
                return value > 0;
            },
            message: 'Must be positive num'
        }
    },
    images: [{
        type: {
            uuid: String,
            path: String,
            url: String,
            },
        required:false,
        validate : function(v){
        // implementation
        },
        message: 'Invalid image object'
            
    }],
    imageFile: {
        type: String,
        required: false,
    },
    orderList: [{
        type: Types.ObjectId,
        ref: 'User'
    }],
    owner: {
        type: Types.ObjectId,
        ref: 'User'
    },
    msgList: [{
        type: Types.ObjectId,
        ref: 'Message'
    }]
},{ timestamps: { createdAt: 'created_at' } });

itemSchema.methods = {
    testMethod: function(){
        console.log('itemSchema test method');
        
    }
}

const itemModel = mongoose.model('Item', itemSchema);


export default itemModel;