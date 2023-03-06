const mongoose = require('mongoose')
const CategorySchema = new mongoose.Schema({
    name: {
        type: String
    }
})
const Categoria = mongoose.model('Categoria', CategorySchema)

module.exports = { Categoria, CategorySchema }
