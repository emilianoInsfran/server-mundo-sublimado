const express = require('express');
const fileUploadCategoria = require('express-fileupload');
const app = express();
var cors = require('cors');

const fs = require('fs');//filesystem
const path = require('path');

const Categoria = require('../models/categoria');//importamos el schema


app.use(fileUploadCategoria());//fileUpload es un middleware , todos los archivos que se cargen  van en req.file
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
//Carga de Imagenes
//-------------------------

function cargaImagenes(img,res,categoriaObj) {
    console.log("Estoy cargando la Imagen de categoria",img);

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

    nombreArchivo = `${ new Date().getMilliseconds() }.${ extension }`;

    img.mv(`./uploads/categoria/${ nombreArchivo }`,(err) =>{
        console.log("ERROR!",err);
        if ( err ){
            return err.status(500).json({
                ok:false,
                err
            })
        }

        postCategoria(nombreArchivo,categoriaObj,res)
    });
}

//-------------------------
//POST
//-------------------------

app.post('/categoria',(req,res)=>{
    let categoriaObj = req.body;
     let imagenCargada = req.files;
     console.log("categoriaObj",categoriaObj);
     console.log("imagenCargada",imagenCargada);
     postCategoria(res,categoriaObj)
    // cargaImagenes(imagenCargada.upload,res,categoriaObj);
 });



//function postCategoria(nombreArchivo,categoriaObj,res) {
function postCategoria(res,categoriaObj) {

      let categoria = new Categoria({
        id_admin:1,
        nombre: categoriaObj.nombre,
        descripcion: categoriaObj.descripcion,
        disponible: categoriaObj.disponible,
        stock: categoriaObj.stock,
        img: categoriaObj.nombreImg
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

}


//-------------------------
//PUT
//-------------------------


app.put('/categoria/:id',(req,res)=>{

    let id = req.params.id;
    let categoriaObj = req.body;

    console.log("categoria =>>>>>", categoriaObj)


    if(categoriaObj.eliminar == 'true') borraArchivo('categoria',categoriaObj.oldnombreImagen);


    let categoria = {
        id_admin:1,
        nombre: categoriaObj.nombre,
        descripcion: categoriaObj.descripcion,
        disponible: categoriaObj.disponible,
        stock: categoriaObj.stock,
        img: categoriaObj.nombreImg
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


function borraArchivo(tipo,nombreImagen){
    console.log("nombreImagen",nombreImagen)
    //consulta si existe la ruta de la imagen - .resolve() construye un path
    let pathImagen = path.resolve(__dirname,`../uploads/categoria/${nombreImagen}`);

    if ( fs.existsSync(pathImagen) ) {//verifica si existe
        console.log('EXISTE');
        fs.unlinkSync(pathImagen);//elimina la imagen del path 
    }
}



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


module.exports = app ;
