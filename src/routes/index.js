const express = require('express')
const { Status } = require('git')
const { Categoria } = require('../models/categoria')
const router = express.Router()

const { Product } = require ('../models/product')


// GETS 
//(mostrar todo)
//  router.get('/api/products', (req,res)=>{
//      Product.find({}, (err,data)=>{
//          if(!err){
//              res.send(data)
//          }else{
//              console.log(err)
//          }
//      })
// })

//mostar mediante Query todo lo que sea true
router.get('/api/products/',(req,res)=>{
    Product.find({
        isActive: true      
    }, (req,res)=>{
        if (!err) {
            //SI NO HAY ERRORES QUIERO QUE HAGA ESTO ENTONCES 
            //implementamos el query
        } else {
            console.log(err)
        }
    })
})



//:id (mostrar por id)
router.get('/api/products/:id', (req,res)=>{
    Product.findById(req.params.id,(err,data)=>{
        if(!err){
            res.send(data);
        }else{
            console.log(err);
        }
    })
})


//Recibir el promedio de los precios
router.get('/api/prom-preci', (req,res)=>{
    Product.aggregate([
        {
          '$group': {
            '_id': '', 
            'avgQuantity': {
              '$avg': '$price'
            }
          }
        }
      ],(err, $avg)=>{
        if(!err){   
            res.status(200).json(({code:200, message:"PROMEDIO OBTENIDO", $avg}))
        }else{
            console.log(err)
        }
      }
      )
})


/* //mostrar por Status
router.get('/api/status', (req,res)=>{
    //de la tabla Products, uso el find para buscar informacion
    Product.find({

        //aclaro que la informacion que busco es todo aquella que tenga esta condicion, el estado sea activo
        isActive: true

    }, (err, data)=>{
        if(!err){
            res.status(200).json(({code:200, message:"SHOWING ALL THE ACTIVE PRODCUTS", data}))
        }else{
            console.log(err)
        }
    })
}) */


//POST
//agregar una nueva informacion
router.post('/api/products/add', (req,res)=>{
    const prod= new Product({
        name: req.body.name,
        brand: req.body.brand,
        bardCode: req.body.bardCode,
        description: req.body.description,
        keywords: req.body.keywords,
        createAt: req.body.createAt,
        updateAt: req.body.updateAt,
    });
    prod.save((err, data)=>{
        res.status(200).json({code: 200, message: 'PRODUCTO CORRECTAMENTE AGREGADO', addProduct:data})
    });
})



//PULL
//:id (editar mediante ID algo dentro de mi tabla)
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
            res.status(200).json({code:200, message: 'Producto actualizado, modificar la fecha de actualizacion manualmente!', updateProduct:data})
        }else{
            console.log(err)
        }
    })
})

//agregamos precio
router.put('/api/products/:id/price', (req,res)=>{
    const p = {
        price: req.body.price
    };
    Product.findByIdAndUpdate(req.params.id, { $set:p}, {new:true}, (err,data)=>{
        if(!err){
            res.status(200).json({code:200, message: 'Precio agregado correctamente !', updateProduct:data})
        }else{
            console.log(err)
        }
    })
})

//agregamos estado
router.put('/api/products/:id/status',(req,res)=>{
    const d = {
        isActive: req.query.isActive
    };
    Product.findByIdAndUpdate(req.params.id, { $set:d}, {new: true}, (err, data)=>{
        if(!err){
            res.status(200).json({code:200, message:'Status agregado correctamente', updateProduct:data})
        }else{
            console.log(err)
        }
    })
})


//DELETE
//eliminar por id)
router.delete('/api/products/:id', (req, res)=>{
    Product.findByIdAndDelete(req.params.id, (err,data)=>{
        if(!err){
            res.status(200).json({code:200, message:'user delete', deleteProduct: data})
        }
    })
})





//EMPEZAMOS A TRABAJAR CON LOS MODELOS DE BASE DE DATOS RELACIONADOS POR ID 


//get
router.get('/api/categoria', (req,res)=>{
    // Categoria.find({}, (res,data)=>{
    //     if(!err){
    //         res.send(data)
    //     }else{
    //         console.log(err)
    //     }
    // })


    //Esto lo que hace es mostrame Categoria y dentro del ObjectID.Product, me mostrara todo lo que este dentro del ID de Producto
    Categoria.find({},(err,data)=>{
        Product.populate(Categoria,{path: "product"}, function(err,data){
            res.status(200).send(data)
        })
    })
})



//post



module.exports = router;