const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

let slideSchema = new Schema({
    id_admin:Number,
    img:{
        type:String,
        required:[false]
    }
});

slideSchema.plugin(uniqueValidator);


module.exports = mongoose.model( 'slide' , slideSchema );