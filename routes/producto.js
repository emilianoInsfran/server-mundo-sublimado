const express = require('express');
const app = express();

const fs = require('fs');//filesystem
const path = require('path');

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

app.get('/novedades',(req,res)=>{
    let id_catalogo = req.params.id;

    console.log("producto: ",id_catalogo);

    Producto.find({disponible:true})
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


function cargaImagenes(img,productoObj,res,section,idPut){
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
    let ruta = `./uploads/producto/${ nombreArchivo }`;

    img.mv(`./uploads/producto/${ nombreArchivo }`,(err) =>{
        console.log("ERROR!",err);
        if ( err ){
            return err.status(500).json({
                ok:false,
                err
            })
        }

        if(section=='post') postProducto(img,nombreArchivo,res,productoObj,ruta);
        else putProducto(img,nombreArchivo,res,productoObj,ruta,idPut)
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

    cargaImagenes(imagenCargada.upload,productoObj,res,'post');
});


function postProducto(img,nombreArchivo,res,productoObj,rutaImg){

    let producto = new Producto({
        id_admin:1,
        id_catalogo:productoObj.id_catalogo,//categoria
        nombre: productoObj.nombre,
        descripcion: productoObj.descripcion,
        subTitulo: productoObj.subTitulo,
        detalle: productoObj.detalle,
        disponible: productoObj.disponible,
        stock: productoObj.stock,
        img: nombreArchivo,
        nameImg: nombreArchivo,
        size: img.size,
        mimetype: img.mimetype,
    });


    console.log("producto", producto);

    Producto.base64_encode(rutaImg)
        .then((base64) => {
        //console.log("ENTRO A BASE 64",base64);
            producto['base64'] = base64;

            //console.log("NUEVO slide", slide);

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
    
    })

}



//-------------------------
//PUT
//-------------------------


app.put('/producto/:id',(req,res)=>{

    let id =req.params.id;
    let productoObj = req.body;
    let imagenCargada = req.files;

    console.log("categoria =>>>>>", productoObj)
    console.log("imagenCargada =>>>>>", imagenCargada)


    if(productoObj.eliminar == 'true') borraArchivo('producto',productoObj.oldnombreImagen);
    if(productoObj.eliminar == 'true') cargaImagenes(imagenCargada.upload,productoObj,res,'put',id);
    else putCategoriaDescription(res,productoObj,id);
});

function putCategoriaDescription(res,productoObj,id){
    console.log("entro en el otro put",productoObj)
    let producto = {
        id_catalogo:productoObj.id_catalogo,
        nombre: productoObj.nombre,
        descripcion: productoObj.descripcion,
        subTitulo: productoObj.subTitulo,
        detalle: productoObj.detalle
    };


    Producto.findByIdAndUpdate(id,producto,{new:true,runValidators:true, context: 'query'},(err,categoriaBD)=>{
        
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

function putProducto(img,nombreArchivo,res,productoObj,rutaImg,id){

    let producto = {
        id_admin:1,
        id_catalogo:productoObj.id_catalogo,
        nombre: productoObj.nombre,
        descripcion: productoObj.descripcion,
        subTitulo: productoObj.subTitulo,
        detalle: productoObj.detalle,
        img: productoObj.nombreImg,
        nameImg: nombreArchivo,
        size: img.size,
        mimetype: img.mimetype,
    };

    console.log("id", id)
    console.log("producto save", producto)
/*

   new: true, //devuelve el objeto actualizado
    runValidators: true, //aplica las validaciones del esquema del modelo
    context: 'query' //necesario para las disparar las validaciones de mongoose-unique-validator
*/

    Producto.base64_encode(rutaImg)
        .then((base64) => {
        //console.log("ENTRO A BASE 64",base64);
            producto['base64'] = base64;

            //console.log("NUEVO slide", slide);

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

    })

}

function borraArchivo(tipo,nombreImagen){
    console.log("nombreImagen",nombreImagen)
    tipo='producto';
    //consulta si existe la ruta de la imagen - .resolve() construye un path
    let pathImagen = path.resolve(__dirname,`../uploads/producto/${nombreImagen}`);

    if ( fs.existsSync(pathImagen) ) {//verifica si existe
        console.log('EXISTE');
        fs.unlinkSync(pathImagen);//elimina la imagen del path 
    }
}


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