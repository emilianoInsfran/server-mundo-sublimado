const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

let productoSchema = new Schema({
    id_admin:Number,
    id_catalogo:{
        type:Number,
        required:[true,"El id catageroría es obligatorio"]
    },
    nombre:{
        type: String,
        unique:'El nombre de la producto no puede repetir',
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
    }

});

productoSchema.plugin(uniqueValidator);


module.exports = mongoose.model( 'Producto' , productoSchema );