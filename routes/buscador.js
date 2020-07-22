const express = require('express');
const app = express();
const Producto = require('../models/producto');//importamos el schema

//-------------------------
//GET
//-------------------------

app.get('/buscar/:nombre',(req,res)=>{
    let nombre = req.params.nombre;
    console.log("nombre",nombre)
    let regex = new RegExp(nombre,'i')//expresion regular, la i para que sea insensible con mayuculas y minusculas

    Producto.find({nombre: regex})
        .sort('nombre')
        .exec((err, productos)=>{
            if(err) {
                return res.status(500).json({// error de bd 500 serio
                    ok:false,
                    err
                })
            }

            res.json({
                ok:true,
                productos
            })
        })
});

module.exports = app;
