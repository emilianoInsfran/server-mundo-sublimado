const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const fs = require('fs');//filesystem
const path = require('path');

const Producto = require('../models/producto');//importamos el schema

app.use(fileUpload());//fileUpload es un middleware , todos los archivos que se cargen  van en req.file


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
//Carga de Imagenes
//-------------------------


function cargaImagenes(img,res,productoObj){
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

    nombreArchivo = `${ new Date().getMilliseconds() }.${ extension }`;

    img.mv(`./uploads/producto/${ nombreArchivo }`,(err) =>{
        console.log("ERROR!",err);
        if ( err ){
            return err.status(500).json({
                ok:false,
                err
            })
        }

        postProducto(nombreArchivo,productoObj,res)
    });
}

//-------------------------
//POST
//-------------------------

app.post('/producto',(req,res)=>{
    
    let productoObj = req.body;
    let imagenCargada = req.files;
    console.log("productoObj",productoObj);
    console.log("imagenCargada",imagenCargada);

    cargaImagenes(imagenCargada.upload,res,productoObj);
});


function postProducto(nombreImagen,productoObj,res){

    console.log("nombre imagen",nombreImagen)

    let producto = new Producto({
        id_admin:1,
        id_catalogo:productoObj.id_catalogo || 1,//categoria
        nombre: productoObj.nombre || 'asd',
        descripcion: productoObj.descripcion,
        disponible: productoObj.disponible,
        stock: productoObj.stock,
        img: nombreImagen
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
        //res.sendFile(path.join(__dirname, '/uploads/producto/432.jpg'));
        res.sendFile(path.resolve(__dirname, '/uploads/producto/432.jpg'));

    })


}

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


app.put('/novedades',(req,res)=>{
    let producto = {
        _id:req.body.idtrue
    };

    let productoHideNovedades = {
        _id:req.body.idfalse
    }

/*

   new: true, //devuelve el objeto actualizado
    runValidators: true, //aplica las validaciones del esquema del modelo
    context: 'query' //necesario para las disparar las validaciones de mongoose-unique-validator
    multi: true:actualiza multiples documentos a un valor
*/
    Producto.update(producto,{disponible:true},{new:true,runValidators:true, multi: true },(err,productoBD)=>{

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


        Producto.update(productoHideNovedades,{disponible:false},{new:true,runValidators:true, multi: true },(err,productoBD)=>{
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