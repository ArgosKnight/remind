const { ObjectID } = require('bson');
const mongoose = require('mongoose');

//Schema
const Product = mongoose.model('Product',{
    id:{
        type: ObjectID,
        require: true
    },
    name:{  
        type: String
    },
    brand:{ 
        type: String 
     },
    bardCode:{ 
        type: String
    },
    description:{ 
        type: String
     },
    Keywords:{
        type: Array 
    },
    createAt:{
         type: Date
    },
    updateAt:{ 
        type: Date 
    },
    price:{ 
        type: Number
    },
    isActive:{
        type: Boolean
    }
})

module.exports = {Product}