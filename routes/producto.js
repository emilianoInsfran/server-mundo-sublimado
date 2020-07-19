const express = require('express');
const app = express();

const Producto = require('../models/producto');//importamos el schema

//-------------------------
// Hacemos una ABM de producto
//-------------------------


//-------------------------
//GET
//-------------------------

app.get('/producto/:id',(req,res)=>{
    let id_catalogo = req.params.id;

    console.log("producto: ",id_catalogo);

    Producto.find({id_catalogo: id_catalogo})
        .sort('nombre')
        .exec((err,producto)=>{
            if ( err ) {
                return res.status(500).json({
                    ok:false,
                    err
                })

            }

            res.json({
                ok:true,
                producto
            })
        });
});

//-------------------------
//POST
//-------------------------


app.post('/producto',(req,res)=>{
    
    let productoObj = req.body;

    console.log("productoObj",productoObj);

    let producto = new Producto({
        id_admin:1,
        id_catalogo:productoObj.id_catalogo,//categoria
        nombre: productoObj.nombre,
        descripcion: productoObj.descripcion,
        disponible: productoObj.disponible,
        stock: productoObj.stock,
        img: productoObj.img
    });

    console.log("producto", producto);

    producto.save((err,productoBD)=>{
        console.log("err", err);
        console.log("productoBD", productoBD);

        if ( err ) 
        {
            return res.status(500).json({//error de datos
                ok:false,
                message: err.errors.nombre.properties.message,
                err
            })
        }

        if( !productoBD )//no se creo la producto
        {
            return res.status(400).json({
                ok:false,
                message: err.Error,
                err
            })
        }

        res.json({
            ok:true,
            producto: productoBD
        })

    })

});


//-------------------------
//PUT
//-------------------------


app.put('/producto/:id',(req,res)=>{

    let id =req.params.id;
    let productoObj = req.body;

    let producto = {
        id_admin:1,
        id_catalogo:productoObj.id_catalogo,
        nombre: productoObj.nombre,
        descripcion: productoObj.descripcion,
        disponible: productoObj.disponible,
        stock: productoObj.stock,
        img: productoObj.img
    };

    console.log("id", id)
    console.log("productoObj", productoObj)
/*

   new: true, //devuelve el objeto actualizado
    runValidators: true, //aplica las validaciones del esquema del modelo
    context: 'query' //necesario para las disparar las validaciones de mongoose-unique-validator
*/
    Producto.findByIdAndUpdate(id,producto,{new:true,runValidators:true, context: 'query'},(err,productoBD)=>{
        
        if( err ){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if( !productoBD ){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            productoBD
        })


    })

});

app.delete('/producto/:id',(req,res)=>{

    let id = req.params.id;

    console.log('id ', id);

    Producto.findByIdAndRemove(id,(err,productoBD)=>{

        if ( err ) {
            return res.status(500).json({
                ok:false,
                err
            })
        };

        if ( !productoBD ) {
            return res.status(400).json({
                ok:false,
                err
            })
        };

        res.json({
            ok:true,
            categoria:productoBD,
            message:'Producto borrada'
        })

    })

});


module.exports = app;