const express = require('express');
const app = express();

const PreFre = require('../models/preguntas-frecuentes');//importamos el schema

//-------------------------
// Hacemos una ABM de preFre
//-------------------------


//-------------------------
//GET
//-------------------------

app.get('/preFre',(req,res)=>{

    PreFre.find()//aca
        .sort('nombre')
        .exec((err,preFre)=>{
            if ( err ) {
                return res.status(500).json({
                    ok:false,
                    err
                })
            }

            res.json({
                ok:true,
                preFre
            })
        });
});

//-------------------------
//POST
//-------------------------


app.post('/prefre',(req,res)=>{
    
    let preFreObj = req.body;

    console.log("preFreObj",preFreObj);

    let preFre = new PreFre({//aca
        id_admin:1,
        pregunta: preFreObj.pregunta,
        respuesta: preFreObj.respuesta,
    });

    console.log("preFre", preFre);

    preFre.save((err,preFreBD)=>{
        console.log("err", err);
        console.log("preFreBD", preFreBD);

        if ( err ) 
        {
            return res.status(500).json({//error de datos
                ok:false,
                //message: err.errors.nombre.properties.message,
                err
            })
        }

        if( !preFreBD )//no se creo la preFre
        {
            return res.status(400).json({
                ok:false,
                message: err.Error,
                err
            })
        }

        res.json({
            ok:true,
            preFre: preFreBD
        })

    })

});


//-------------------------
//PUT
//-------------------------


app.put('/prefre/:id',(req,res)=>{

    let id =req.params.id;
    let preFreObj = req.body;

    let preFre = {
        id_admin:1,
        pregunta: preFreObj.pregunta,
        respuesta: preFreObj.respuesta,
    };

    console.log("id", id)
    console.log("preFreObj", preFreObj)
/*

   new: true, //devuelve el objeto actualizado
    runValidators: true, //aplica las validaciones del esquema del modelo
    context: 'query' //necesario para las disparar las validaciones de mongoose-unique-validator
*/
    PreFre.findByIdAndUpdate(id,preFre,{new:true,runValidators:true, context: 'query'},(err,preFreBD)=>{//aca
        
        if( err ){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if( !preFreBD ){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            preFreBD
        })


    })

});

app.delete('/prefre/:id',(req,res)=>{

    let id = req.params.id;

    console.log('id ', id);

    PreFre.findByIdAndRemove(id,(err,preFreBD)=>{//aca

        if ( err ) {
            return res.status(500).json({
                ok:false,
                err
            })
        };

        if ( !preFreBD ) {
            return res.status(400).json({
                ok:false,
                err
            })
        };

        res.json({
            ok:true,
            categoria:preFreBD,
            message:'preFre borrada'
        })

    })

});


module.exports = app;