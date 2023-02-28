const express = require('express');
const dotenv = require('dotenv')
const bodyParser = require('body-parser')



const app = express();
app.use(bodyParser.json())
const connectDB = require('./src/config/db');


dotenv.config({path: './config/config.env'})
connectDB();



//RUTAS ! 

app.use('/products', require('./src/routes/index'))




app.listen(3000, () =>{
    console.log("SERVER ON, LETS GO ! ")
})