const express = require('express');
const fileUploadCategoria = require('express-fileupload');
const app = express();
var cors = require('cors');

const fs = require('fs');//filesystem
const path = require('path');

const Categoria = require('../models/categoria');//importamos el schema

//app.use(fileUploadCategoria());//fileUpload es un middleware , todos los archivos que se cargen  van en req.file
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

function cargaImagenes(img,res,slide,action,idPut){
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

    let ruta = `./uploads/${slide.section}/${ nombreArchivo }`;

    img.mv(`./uploads/${slide.section}/${ nombreArchivo }`,(err) =>{
        console.log("ERROR!",err);
        if ( err ){
            return err.status(500).json({
                ok:false,
                err
            })
        }

        //if(slide.section == 'slide') postSlide(nombreArchivo,slide,res)
        if(action=='post')postCategoria(img,res,slide,ruta)
        else putCategoria(img,res,slide,ruta,idPut)

    });
   
}

//-------------------------
//POST
//-------------------------


app.post('/categoria',(req,res)=>{
    const tempPath = req.file;
    let categoriaObj = req.body;
    let imagenCargada = req.files;

    console.log("tempPath1",tempPath);
    console.log("categoriaObj1",categoriaObj);
    console.log("imagenCargada1",imagenCargada);

    //postCategoria(res,categoriaObj)
    cargaImagenes(imagenCargada.upload,res,categoriaObj,'post');
 });



//function postCategoria(nombreArchivo,categoriaObj,res) {
function postCategoria(img,res,categoriaObj,rutaImg) {

    let categoria = new Categoria({
        id_admin:1,
        nombre: categoriaObj.nombre,
        descripcion: categoriaObj.descripcion,
        disponible: categoriaObj.disponible,
        stock: categoriaObj.stock,
        img: categoriaObj.nombreImg,
        nameImg: img.name,
        size: img.size,
        mimetype: img.mimetype,
    });

    console.log("categoria final", categoria);

    Categoria.base64_encode(rutaImg)
        .then((base64) => {
            //console.log("ENTRO A BASE 64",base64);
            categoria['base64'] = base64;

            //console.log("NUEVO slide", slide);

            categoria.save((err,categoriaBD)=>{
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
        })
}


//-------------------------
//PUT
//-------------------------

app.put('/categoria/:id',(req,res)=>{

    let id = req.params.id;
    let categoriaObj = req.body;
    let imagenCargada = req.files;

    console.log("categoria =>>>>>", categoriaObj)

    if(categoriaObj.eliminar == 'true') borraArchivo('categoria',categoriaObj.oldnombreImagen);

    if(categoriaObj.eliminar == 'true') cargaImagenes(imagenCargada.upload,res,categoriaObj,'put',id);
    else putCategoriaDescription(res,categoriaObj,id);


});

function putCategoriaDescription(res,categoriaObj,id){
    console.log("entro en el otro put",categoriaObj)
    let categoria = {
        nombre: categoriaObj.nombre,
        descripcion: categoriaObj.descripcion,
    };


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
}

function putCategoria(img,res,categoriaObj,rutaImg,id){
    let categoria = {
        id_admin:1,
        nombre: categoriaObj.nombre,
        descripcion: categoriaObj.descripcion,
        disponible: categoriaObj.disponible,
        stock: categoriaObj.stock,
        img: categoriaObj.nombreImg,
        nameImg: img.name,
        size: img.size,
        mimetype: img.mimetype,
    };

    console.log("id", id);
    console.log("categoria", categoria);
    /*
        new: true, //devuelve el objeto actualizado
        runValidators: true, //aplica las validaciones del esquema del modelo
        context: 'query' //necesario para las disparar las validaciones de mongoose-unique-validator
    */

    Categoria.base64_encode(rutaImg)
        .then((base64) => {
            //console.log("ENTRO A BASE 64",base64);
            categoria['base64'] = base64;

            //console.log("NUEVO slide", slide);

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
        })

}

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
