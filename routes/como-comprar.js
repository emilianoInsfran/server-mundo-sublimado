const express = require('express');
const app = express();

const Compra = require('../models/como-comprar.js');//importamos el schema

//-------------------------
// Hacemos una ABM de compra
//-------------------------


//-------------------------
//GET
//-------------------------

app.get('/compra',(req,res)=>{

    Compra.find()//aca
        .sort('nombre')
        .exec((err,compra)=>{
            if ( err ) {
                return res.status(500).json({
                    ok:false,
                    err
                })
            }

            res.json({
                ok:true,
                compra
            })
        });
});

//-------------------------
//POST
//-------------------------


app.post('/compra',(req,res)=>{
    
    let compraObj = req.body;

    console.log("compraObj",compraObj);

    let compra = new Compra({//aca
        id_admin:1,
        pregunta: compraObj.pregunta,
        respuesta: compraObj.respuesta,
    });

    console.log("compra", compra);

    compra.save((err,compraBD)=>{
        console.log("err", err);
        console.log("compraBD", compraBD);

        if ( err ) 
        {
            return res.status(500).json({//error de datos
                ok:false,
                //message: err.errors.nombre.properties.message,
                err
            })
        }

        if( !compraBD )//no se creo la compra
        {
            return res.status(400).json({
                ok:false,
                message: err.Error,
                err
            })
        }

        res.json({
            ok:true,
            compra: compraBD
        })

    })

});


//-------------------------
//PUT
//-------------------------


app.put('/compra/:id',(req,res)=>{

    let id =req.params.id;
    let compraObj = req.body;

    let compra = {
        id_admin:1,
        pregunta: compraObj.pregunta,
        respuesta: compraObj.respuesta,
    };

    console.log("id", id)
    console.log("compraObj", compraObj)
/*

   new: true, //devuelve el objeto actualizado
    runValidators: true, //aplica las validaciones del esquema del modelo
    context: 'query' //necesario para las disparar las validaciones de mongoose-unique-validator
*/
    Compra.findByIdAndUpdate(id,compra,{new:true,runValidators:true, context: 'query'},(err,compraBD)=>{//aca
        
        if( err ){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if( !compraBD ){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            compraBD
        })


    })

});

app.delete('/compra/:id',(req,res)=>{

    let id = req.params.id;

    console.log('id ', id);

    Compra.findByIdAndRemove(id,(err,compraBD)=>{//aca

        if ( err ) {
            return res.status(500).json({
                ok:false,
                err
            })
        };

        if ( !compraBD ) {
            return res.status(400).json({
                ok:false,
                err
            })
        };

        res.json({
            ok:true,
            categoria:compraBD,
            message:'compra borrada'
        })

    })

});


module.exports = app;