const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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
    }

});

categoriaSchema.plugin(uniqueValidator);


module.exports = mongoose.model( 'Categoria' , categoriaSchema );