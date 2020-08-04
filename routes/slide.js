const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const fs = require('fs');//filesystem
const path = require('path');

const Slide = require('../models/slide');//importamos el schema

//const Categoria = require('./categoria');

app.use(fileUpload());//fileUpload es un middleware , todos los archivos que se cargen  van en req.file

//-------------------------
// Hacemos una ABM de producto
//-------------------------

//-------------------------
//GET
//-------------------------

app.get('/slide',(req,res)=>{

    Slide.find()
        .exec((err,slide)=>{
            if ( err ) {
                return res.status(500).json({
                    ok:false,
                    err
                })
            }

            res.json({
                ok:true,
                slide
            })
        });
});

//-------------------------
//Carga de Imagenes
//-------------------------

function cargaImagenes(img,res,slide){
    console.log("Estoy cargando la Imagen",img);

    let extensionesValidas = ['png','jpg','gif','jpeg'];

    let nombreArchivo = img.name.split('.');
    let extension = nombreArchivo[nombreArchivo.length -1]

    if(extensionesValidas.indexOf(extension) < 0){
        console.log("extencion no valida");

        return res.status(400).json({
            ok:false,
            message:"Extension no valida, las permitidas son" + extensionesValidas,
            extension: extension
        })
    }
    
    if(slide.section == 'slide') nombreArchivo = `${ new Date().getMilliseconds() }.${ extension }`;
    else {
        nombreArchivo = slide.nombreImg;
    }

    img.mv(`./uploads/${slide.section}/${ nombreArchivo }`,(err) =>{
        console.log("ERROR!",err);
        if ( err ){
            return err.status(500).json({
                ok:false,
                err
            })
        }

        if(slide.section == 'slide')postSlide(nombreArchivo,slide,res)
        else {
            res.json({
                ok:true,
                message:"La imagen se cargo correctamente"
            })
        }

    });
   
}

//-------------------------
//POST
//-------------------------

app.post('/slide',(req,res)=>{

    let data = req.body;

    console.log("slide: ");

    let slideObj = req.body;
    let imagenCargada = req.files;
    console.log("slide",slideObj);
    console.log("imagenCargada del slide",imagenCargada);

    cargaImagenes(imagenCargada.upload,res,slideObj);

});


function postSlide(nombreImagen,slideObj,res){

    console.log("nombre imagen",nombreImagen)

    let slide = new Slide({
        id_admin:1,
        img: nombreImagen
    });

    console.log("slide", slide);

    slide.save((err,slideBD)=>{
        console.log("err", err);
        console.log("slideBD", slideBD);

        if ( err ) 
        {
            return res.status(500).json({//error de datos
                ok:false,
                message: err.errors.nombre.properties.message,
                err
            })
        }

        if( !slideBD )//no se creo la slide
        {
            return res.status(400).json({
                ok:false,
                message: err.Error,
                err
            })
        }

        res.json({
            ok:true,
            slide: slideBD
        })

    })


}

function borraArchivo(tipo,nombreImagen){
    console.log("entro a eliminar imagen",tipo)
    console.log("nombreImagen",nombreImagen)
    //consulta si existe la ruta de la imagen - .resolve() construye un path
    let pathImagen = path.resolve(__dirname,`../uploads/${tipo}/${nombreImagen}`);

    if ( fs.existsSync(pathImagen) ) {//verifica si existe
        console.log('EXISTE');
        fs.unlinkSync(pathImagen);//elimina la imagen del path 
    }

}

app.post('/slide/:id',(req,res)=>{

    let id = req.params.id;
    let  slide = req.body

    console.log('slide ', slide);

    Slide.findByIdAndRemove(id,(err,slideBD)=>{

        borraArchivo(slide.section,slide.nombre);

        if ( err ) {
            return res.status(500).json({
                ok:false,
                err
            })
        };

        if ( !slideBD ) {
            return res.status(400).json({
                ok:false,
                err
            })
        };

        res.json({
            ok:true,
            categoria:slideBD,
            message:'La imagen se borro correctamente'

        })
    })
});







module.exports = app;