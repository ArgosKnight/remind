const express = require('express')
const { Categoria } = require('../models/categoria')
const router = express.Router()
const mongoose = require('mongoose');

const { Product } = require('../models/product')


router.get('/', async (req, res) => {

    try {
        let condition = {}
        if (req.query.isActive === 'true') {
            condition.isActive = true
        } else if (req.query.isActive === 'false') {
            condition.isActive = false
        }
        const product = await Product.find(condition)
        res.json(product)
    } catch (err) {
        console.error(err)
    }
})

router.get('/:id', (req, res) => {
    Product.findById(req.params.id, (err, data) => {
        if (!err) {
            res.send(data);
        } else {
            console.log(err);
        }
    })
})

router.get('/prom-preci', (req, res) => {
    Product.aggregate([
        {
            '$group': {
                '_id': '',
                'avgQuantity': {
                    '$avg': '$price'
                }
            }
        }
    ], (err, $avg) => {
        if (!err) {
            res.status(200).json(({ code: 200, message: "PROMEDIO OBTENIDO", $avg }))
        } else {
            console.log(err)
        }
    }
    )
})

router.post('/add', (req, res) => {
    const prod = new Product({
        name: req.body.name,
        brand: req.body.brand,
        bardCode: req.body.bardCode,
        description: req.body.description,
        keywords: req.body.keywords,
        createAt: req.body.createAt,
        updateAt: req.body.updateAt,
        prrice: req.body.price,
        isActive: req.body.isActive
    });
    prod.save((err, data) => {
        res.status(200).json({ code: 200, message: 'PRODUCTO CORRECTAMENTE AGREGADO', addProduct: data })
    });
})


router.put('/edit/:id', async (req, res, next) => {
    try {
        const categoryId = req.body.categoryId;
        let category = null;
        if (categoryId) {
            const foundCategory = await Categoria.findById(categoryId);
            if (foundCategory) {
                category = foundCategory;
            } else {
                category = null;
            }
        }
        const product = await Product.findById(req.params.id);
        product.name = req.body.name;
        product.brand = req.body.brand;
        product.bardCode = req.body.bardCode;
        product.description = req.body.description;
        product.keywords = req.body.keywords;
        product.createAt = req.body.createAt;
        product.updateAt = req.body.updateAt;
        product.price = req.body.price;
        product.isActive = req.body.isActive;
        product.category = category;
        await product.save();

        res.status(200).json({ code: 200, message: 'Producto actualizado, modificar la fecha de actualizacion manualmente!', updateProduct: product });
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            const newError = new Error('El ID proporcionado no es válido');
            newError.statusCode = 400;
            next(newError);
        } else {
            next(error);
        }
    }

});

router.put('/:id/price', (req, res) => {
    const p = {
        price: req.body.price
    };
    Product.findByIdAndUpdate(req.params.id, { $set: p }, { new: true }, (err, data) => {
        if (!err) {
            res.status(200).json({ code: 200, message: 'Precio agregado correctamente !', updateProduct: data })
        } else {
            console.log(err)
        }
    })
})


router.put('/:id/status', (req, res) => {
    const d = {
        isActive: req.query.isActive
    };
    Product.findByIdAndUpdate(req.params.id, { $set: d }, { new: true }, (err, data) => {
        if (!err) {
            res.status(200).json({ code: 200, message: 'Status agregado correctamente', updateProduct: data })
        } else {
            console.log(err)
        }
    })
})


router.delete('/:id', (req, res) => {
    Product.findByIdAndDelete(req.params.id, (err, data) => {
        if (!err) {
            res.status(200).json({ code: 200, message: 'user delete', deleteProduct: data })
        }
    })
})



module.exports = router;