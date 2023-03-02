const { query } = require('express')
const express = require('express')
const { Status } = require('git')
const { Categoria } = require('../models/categoria')
const router = express.Router()

const { Product } = require ('../models/product')


// GETS 
/*
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
//////////////////////////////////////////////////
// //mostrar por Status
// router.get('/api/status', (req,res)=>{
//     //de la tabla Products, uso el find para buscar informacion
//     Product.find({
//         //aclaro que la informacion que busco es todo aquella que tenga esta condicion, el estado sea activo
//         isActive: true
//     }, (err, data)=>{
//         if(!err){
//             res.status(200).json(({code:200, message:"SHOWING ALL THE ACTIVE PRODCUTS", data}))
//         }else{
//             console.log(err)
//         }
//     })
// }) 
*/
//////////////////////////////////////////////////
//mostar mediante Query todo lo que sea true
router.get('/api/products', async (req,res)=>{
    // const { isActive = true} = req.query;
    // Product.find({
    //     isActive: isActive
    // }, (err,data)=>{
    //     if(!err){
    //         res.send(data)
    //     }else{
    //         console.log(err)
    //     }
    // })
    try {
        let condition = {}
        if(req.query.isActive === 'true') {
            condition.isActive = true
        }else if(req.query.isActive === 'false'){
            condition.isActive = false
        }
        const product = await Product.find(condition)
        res.json(product)
    } catch (err) {
        console.error(err)
    }
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
//usamos una herramienta de mongoose $AVG de aggregation la cual nos permitra agrupar y sacar el promedio de la informacion pedida.
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
        updateAt: req.body.updateAt,
        price: req.body.price,
        isActive: req.body.isActive,
        catagory: req.body.catagory
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

//agreganos categoria
router.put('/api/products/:id/category', (req,res)=>{
    /*
    // const { productId, categoryId } = req.params;

    //  Product.findByIdAndUpdate(
    //    productId,
    //    { categoryId },
    //    { new: true },
    //    (err, updatedProduct) => {
    //      if (err) {
    //        console.error(err);
    //        res.status(500).json({ error: 'Failed to add category to product' });
    //      } else if (!updatedProduct) {
    //        res.status(404).json({ error: 'Product not found' });
    //      } else {
    //        res.json({
    //          message: 'Category added to product successfully',
    //      updatedProduct,
    //        });
    //      }
    //    },
    // );
    // const categoriaObj = {
    //     "name": req.body.name
    //   };

    //   console.log()
    //   Product.findByIdAndUpdate(req.params.id, {$set: {category:categoriaObj}}, {new: true}, (err, data) => {
    //     if (!err) {
    //       res.status(200).json({code: 200, message: "CATEGORY ADDED CORRECTLY", updatedProduct: data})
    //     } else {
    //       console.log(err);
    //       res.status(500).json({code: 500, message: "INTERNAL SERVER ERROR"})
    //     }
    //   });*/


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



//GET Y POST DE CATEGORIA!
//Esto lo que hace es mostrame Categoria y dentro del ObjectID.Product, me mostrara todo lo que este dentro del ID de Producto 
router.get('/api/categoria/show', (req,res)=>{
    Categoria.find({}).exec((err, categorias) => {
        if (!err) {
          res.send(categorias)
        } else {
          console.log(err);
        }
      });
    }
)

//:id (mostrar por id)
router.get('/api/category/:id', (req,res)=>{
    Categoria.findById(req.params.id,(err,data)=>{
        if(!err){
            res.send(data);
        }else{
            console.log(err);
        }
    })
})

//post
router.post('/api/categoria/add', (req,res)=>{
    const cat= new Categoria({
        name: req.body.name
    });
    cat.save((err, data)=>{
        res.status(200).json({code: 200, message: 'CATEGORIA CORRECTAMENTE AGREGADO', addCategoria:data})
    });
})




module.exports = router;