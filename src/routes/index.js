const express = require('express')
const { Categoria } = require('../models/categoria')
const router = express.Router()
const mongoose = require('mongoose');

const { Product } = require ('../models/product')


// Middleware para manejar errores
router.use((error, req, res, next) => {
    // console.log('entro',error);
    // const status = error.statusCode || 500;
    // const message = error.message || 'Error interno del servidor';
    // res.status(status).json({ code: status, message: message });
    if (err instanceof mongoose.Error.CastError) {
        return res.status(400).json({ error: 'El ID proporcionado es inválido' });
      } else {
        console.error(err.stack);
        return res.status(500).json({ error: 'Ocurrió un error interno en el servidor' });
      }
});

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
   
/*
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
*/
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
        prrice: req.body.price,
        isActive: req.body.isActive
    });
    prod.save((err, data)=>{
        res.status(200).json({code: 200, message: 'PRODUCTO CORRECTAMENTE AGREGADO', addProduct:data})
    });
})


//PULL
//:id (editar mediante ID algo dentro de mi tabla)
/*
// router.put('/api/products/edit/:id', (req,res)=>{
//     const x = { 
//         name: req.body.name,
//         brand: req.body.brand,
//         bardCode: req.body.bardCode,
//         description: req.body.description,
//         keywords: req.body.keywords,
//         createAt: req.body.createAt,
//         updateAt: req.body.updateAt,
//         price: req.body.price,
//         isActive: req.body.isActive,
//         category: null
//     };

//     if (req.body.categoryId) {
//         x.category = req.body.catagoryId;
//       }
    
//       Product.findByIdAndUpdate(req.params.id, { $set: x }, { new: true }, (err, data) => {
//         if (!err) {
//           res.status(200).json({ code: 200, message: 'Producto actualizado, modificar la fecha de actualizacion manualmente!', updateProduct: data })
//         } else {
//           console.log(err)
//         }
//       })
// })
*/
/*
router.put('/api/products/edit/:id', async (req, res) => {

    //Buscamos nuestro obejeto mediante la ID 
     try {
         const categoryId = req.body.categoryId;
         //REVISAR ESTA PARTE ? 
         let category = null;
       
        //ESTO CODIGO SIRVE PARA GUARDAR LA INFORMACION COMO UNA VARIABLE MAS -> CODIGO INNECESARIO PARA ESTO QUE SE ESTA REALIZANDO
         // if (!category) {
         //   category = new Categoria({ name: req.body.categoryName });
         //   await category.save();
         // }
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
         //console.log(categoryId)
         res.status(200).json({ code: 200, message: 'Producto actualizado, modificar la fecha de actualizacion manualmente!', updateProduct: product });
     } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.CastError) {
          // Si la excepción es causada por un ID inválido, enviamos una respuesta de error con el código 400 Bad Request
          res.status(400).json({ code: 400, message: 'ID inválido' });
        } else {
          // Si la excepción es causada por otra cosa, enviamos una respuesta de error genérica con el código 500 Internal Server Error
          res.status(500).json({ code: 500, message: 'Error interno del servidor' });
        }
      }
*/
router.put('/api/products/edit/:id', async (req, res, next) => {
    //Buscamos nuestro obejeto mediante la ID 
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
            res.status(400).json({ code: 400, message: 'La ID proporcionada es inválida.' });
          } else {
            next(error);
          }
        }
});

/*     // try {
    //   const { id } = req.params;
    //   const { category } = req.body;
    //   // Verificar si la categoría existe
    //   let categoryObj = null;
    //   if (category) {
    //     const existingCategory = await Category.findOne({ name: category });
    //     if (existingCategory) {
    //       categoryObj = existingCategory;
    //     } else {
    //       categoryObj = null;
    //     }
    //   }
    //   // Verificar si el producto existe
    //   const product = await Product.findById(id);
    //   if (!product) {
    //     return res.status(404).json({ error: 'Producto no encontrado' });
    //   }
    //   // Actualizar el producto con la categoría
    //   product.category = categoryObj;
    //   await product.save();
    //   res.status(200).json(product);
    // } catch (error) {
    //   console.error(error);
    //   res.status(500).json({ error: 'Ocurrió un error al actualizar el producto' });
    // } 
});
*/
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


//Varios formas de agregar Categoria a Product
/*
//agreganos categoria
router.put('/api/products/:id/category', async (req,res)=>{

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
//////////////////////////////////////////////  ///////////////////////////////////////////////
    // const categoriaObj = {
    //      "name": req.body.name
    //    };
    //    console.log()
    //    Product.findByIdAndUpdate(req.params.id, {$set: {category:categoriaObj}}, {new: true}, (err, data) => {
    //      if (!err) {
    //        res.status(200).json({code: 200, message: "CATEGORY ADDED CORRECTLY", updatedProduct: data})
    //      } else {
    //        console.log(err);
    //        res.status(500).json({code: 500, message: "INTERNAL SERVER ERROR"})
    //      }
    //    });
//////////////////////////////////////////////  ///////////////////////////////////////////////
    try {
        const categoria = await Categoria.findOne({ name: req.body.name });
        if (!categoria) {
          return res.status(404).json({ code: 404, message: "CATEGORY NOT FOUND" });
        }
        const updatedProduct = await Product.findByIdAndUpdate(
          req.params.id,
          { $set: { category: categoria._id } },
          { new: true }
        );
        res.status(200).json({
          code: 200,
          message: "CATEGORY ADDED CORRECTLY",
          updatedProduct
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ code: 500, message: "INTERNAL SERVER ERROR" });
      }

})
*/


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