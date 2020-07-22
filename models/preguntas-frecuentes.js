const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PreguntaFreSchema = new Schema({
    id_admin:Number,
    pregunta:{
        type: String,
        required:[true,'La pregunta es necesaria']
    },
    respuesta:{
        type:String,
        required:[true,'La pregunta es necesaria']
    }
});



module.exports = mongoose.model( 'PreFre' , PreguntaFreSchema );