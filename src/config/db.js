const mongoose = require('mongoose');

//Funcion para conectarme a la base de datos
const connectDB = async () =>{
    const url = "mongodb+srv://argosknight:skatelife1995@cluster0.bx1i440.mongodb.net/TEST"
    try {
        mongoose.set('strictQuery', true)
        const conn = await mongoose.connect(url)
        console.log("CONECTADO A LA BASE DE DATOS")
    } catch (error) {
        console.error(error)
    }
}

module.exports = connectDB;