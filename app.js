const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const Router = require('router');

const app = express();
const api = new Router();

app.use(bodyParser.json());

const connectDB = require('./src/config/db');
dotenv.config({ path: './config/config.env' });
connectDB();

api.use('/products', require('./src/routes/products'))
api.use('/category', require('./src/routes/categories'))
app.use('/api', api)


app.use((error, req, res, next) => {
    console.log('entro',error);
    const status = error.statusCode || 500;
    const message = error.message || 'Error interno del servidor';
    res.status(status).json({ code: status, message: message });
});


app.listen(3000, () =>{
    console.log("SERVER ON, LETS GO ! ")
})