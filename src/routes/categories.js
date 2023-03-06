const express = require('express')
const { Categoria } = require('../models/categoria')
const router = express.Router()


router.get('/category', (req, res) => {
    Categoria.find({}).exec((err, categorias) => {
        if (!err) {
            res.send(categorias)
        } else {
            console.log(err);
        }
    });
}
)

router.get('/category/:id', (req, res) => {
    Categoria.findById(req.params.id, (err, data) => {
        if (!err) {
            res.send(data);
        } else {
            console.log(err);
        }
    })
})

router.post('/category/add', (req, res) => {
    const cat = new Categoria({
        name: req.body.name
    });
    cat.save((err, data) => {
        res.status(200).json({ code: 200, message: 'CATEGORIA CORRECTAMENTE AGREGADO', addCategoria: data })
    });
})


module.exports = router;