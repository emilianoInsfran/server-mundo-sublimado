const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fs = require('fs');

var uniqueValidator = require('mongoose-unique-validator');

let categoriaSchema = new Schema({
    id_admin:Number,
    nombre:{
        type: String,
        unique:'El nombre de la categoría no puede repetir',
        required:[true,'El nombre es necesario']
    },
    descripcion:{
        type:String,
        required:[false]
    },
    disponible:{
        type:Boolean,
        default:true
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

categoriaSchema.plugin(uniqueValidator);


module.exports = mongoose.model( 'Categoria' , categoriaSchema );

module.exports.base64_encode = function(file) {
    console.log("archivo base 64", file);
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