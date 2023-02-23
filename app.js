const express = require('express');
const dotenv = require('dotenv')
const bodyParser = require('body-parser')



const app = express();
app.use(bodyParser.json())
const connectDB = require('./src/config/db');


dotenv.config({path: './config/config.env'})
connectDB();



//RUTAS ! 
//get
app.use('/products', require('./src/routes/index'))
//get:id

//post






app.listen(3000, () =>{
    console.log("SERVER ON, LETS GO ! ")
})