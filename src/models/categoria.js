const mongoose = require('mongoose')

//Procedmos a crear el esquema de Categoria
//Tendremos por defecto el ID de Mongo
//Definir como dato de mi tabla  el "name" como string

const CategorySchema = new mongoose.Schema({
    name: {
        type: String
    }
})


//Como una cosntante, vamos a definir Categoria, donde aca vamos a juntar el modelo con el esquema
const Categoria = mongoose.model('Categoria', CategorySchema)


module.exports = { Categoria, CategorySchema }
