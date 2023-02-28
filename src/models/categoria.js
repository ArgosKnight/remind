const {ObjectID} = require ('bson')
const mongoose = require('mongoose')

const Categoria = mongoose.model('Categoria',{
    id:{
        type: ObjectID,
        require: true
    },
    name:{
        type: String
    }
})


module.exports = { Categoria}
