const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const fs = require('fs');//filesystem
const path = require('path');

const Pdf = require('../models/pdf');//importamos el schema



app.get('/pdf',(req,res)=>{

    Pdf.find({})
        .exec((err,pdf)=>{
            if ( err ) {
                return res.status(500).json({
                    ok:false,
                    err
                })
            }

            res.json({
                ok:true,
                pdf
            })
        });

});
//-------------------------
//POST
//-------------------------


app.post('/pdf',(req,res)=>{
    
    let pdfObj = req.body;

    console.log("pdfObj",pdfObj);

    let pdf = new Pdf({//aca
        id_admin:1,
        pdf: pdfObj.pdf,
  
    });

    console.log("pdf", pdf);

    pdf.save((err,pdfBD)=>{
        console.log("err", err);
        console.log("pdfBD", pdfBD);

        if ( err ) 
        {
            return res.status(500).json({//error de datos
                ok:false,
                //message: err.errors.nombre.properties.message,
                err
            })
        }

        if( !pdfBD )//no se creo la pdf
        {
            return res.status(400).json({
                ok:false,
                message: err.Error,
                err
            })
        }

        res.json({
            ok:true,
            pdf: pdfBD,
            message:'El link del pdf se guardo correctamente'
        })

    })

});

module.exports = app;