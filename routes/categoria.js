const express = require('express');
const app = express();
var cors = require('cors');

const Categoria = require('../models/categoria');//importamos el schema

//-------------------------
// Hacemos una ABM de categoria
//-------------------------


//-------------------------
//GET
//-------------------------

app.get('/categoria',(req,res)=>{

    Categoria.find({})
        .sort('nombre')
        .exec((err,categoria)=>{
            if ( err ) {
                return res.status(500).json({
                    ok:false,
                    err
                })

            }

            res.json({
                ok:true,
                categoria
            })
        });

});

//-------------------------
//POST
//-------------------------


app.post('/categoria',(req,res)=>{

    categoriaObj = req.body;

    let categoria = new Categoria({
        id_admin:1,
        nombre: categoriaObj.nombre,
        descripcion: categoriaObj.descripcion,
        disponible: categoriaObj.disponible,
        stock: categoriaObj.stock,
        img: categoriaObj.img
    });

    console.log("categoria", categoria);

    categoria.save((err,categoriaBD)=>{
        console.log("err", err);
        console.log("categoriaBD", categoriaBD);

        if ( err ) 
        {
            return res.status(500).json({//error de datos
                ok:false,
                err
            })
        }

        if( !categoriaBD )//no se creo la categoria
        {
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            categoria: categoriaBD
        })

    })

});


//-------------------------
//PUT
//-------------------------


app.put('/categoria/:id',(req,res)=>{

    let id = req.params.id;
    let categoriaObj = req.body;

    let categoria = {
        id_admin:1,
        nombre: categoriaObj.nombre,
        descripcion: categoriaObj.descripcion,
        disponible: categoriaObj.disponible,
        stock: categoriaObj.stock,
        img: categoriaObj.img
    };

    console.log("id", id)
    console.log("categoria", categoriaObj)
/*

   new: true, //devuelve el objeto actualizado
    runValidators: true, //aplica las validaciones del esquema del modelo
    context: 'query' //necesario para las disparar las validaciones de mongoose-unique-validator
*/
    Categoria.findByIdAndUpdate(id,categoria,{new:true,runValidators:true, context: 'query'},(err,categoriaBD)=>{
        
        if( err ){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if( !categoriaBD ){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            categoriaBD
        })


    })

});

app.delete('/categoria/:id',(req,res)=>{

    let id = req.params.id;

    console.log('id ', id);

    Categoria.findByIdAndRemove(id,(err,categoriaBD)=>{

        if ( err ) {
            return res.status(500).json({
                ok:false,
                err
            })
        };

        if ( !categoriaBD ) {
            return res.status(400).json({
                ok:false,
                err
            })
        };

        res.json({
            ok:true,
            categoria:categoriaBD,
            message:'Categoria borrada'
        })

    })

});


module.exports = app;