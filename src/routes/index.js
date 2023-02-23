const express = require('express')
const router = express.Router()

const { Product } = require ('../models/product')

//Get (mostrar todo)
router.get('/api/products', (req,res)=>{
    Product.find({}, (err,data)=>{
        if(!err){
            res.send(data)
        }else{
            console.log(err)
        }
    })
})

//GET:id (mostrar por id)
router.get('/api/products/:id', (req,res)=>{
    Product.findById(req.params.id,(err,data)=>{
        if(!err){
            res.send(data);
        }else{
            console.log(err);
        }
    })
})


//POST (agregar)
router.post('/api/products/add', (req,res)=>{
    const prod= new Product({
        name: req.body.name,
        brand: req.body.brand,
        bardCode: req.body.bardCode,
        description: req.body.description,
        keywords: req.body.keywords,
        createAt: req.body.createAt,
        updateAt: req.body.updateAt
    });
    prod.save((err, data)=>{
        res.status(200).json({code: 200, message: 'PRODUCTO CORRECTAMENTE AGREGADO', addProducts:data})
    });
})

//PULL:id (editar)
 router.put('/api/products/edit/:id', (req,res)=>{
    const x = {
        name: req.body.name,
        brand: req.body.brand,
        bardCode: req.body.bardCode,
        description: req.body.description,
        keywords: req.body.keywords,
        createAt: req.body.createAt,
        updateAt: req.body.updateAt
    };
    Product.findByIdAndUpdate(req.params.id, { $set:x}, {new:true}, (err,data)=>{
        if(!err){
            res.status(200).json({code:200, message: 'Producto actualizado, modificar la fecha de actualizacion manualmente!'})
        }else{
            console.log(err)
        }
    })
 })


//Delete (eliminar por id)
router.delete('/api/products/:id', (req, res)=>{
    Product.findByIdAndDelete(req.params.id, (err,data)=>{
        if(!err){
            res.status(200).json({code:200, message:'user delete', deleteProduct: data})
        }
    })
})



module.exports = router;