const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
const fs = require('fs');

let productoSchema = new Schema({
    id_admin:Number,
    id_catalogo:{
        type:String,
        required:[true,"El id catageroría es obligatorio"]
    },
    nombre:{
        type: String,
        required:[true,'El nombre es necesario']
    },
    descripcion:{
        type:String,
        required:[false]
    },
    subTitulo:{
        type: String,
        required:[false]
    },
    detalle:{
        type:String,
        required:[false]
    },
    disponible:{
        type:Boolean,
        default:false
    },
    stock:{
        type:Number,
        required:[false]
    },
    img:{
        type:String,
        required:[false]
    },
    nameImg: {
        type: String,
      },
    mimetype: {
        type: String,
    },
    size: {
        type: Number,
    },
    base64: {
        type: String,
    }

});

productoSchema.plugin(uniqueValidator);


module.exports = mongoose.model( 'Producto' , productoSchema );

module.exports.base64_encode = function(file) {
    return new Promise((resolve, reject) => {
      if(file == undefined){
        reject('no file found');
      } else {
        console.log("entro en el else")
        let encodedData = fs.readFileSync(file, 'base64');
        //console.log("encodeddata",encodedData);
       // fs.unlink(file);
        resolve(encodedData.toString('base64'));
      }
    })
  } 