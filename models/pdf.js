const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

let pdfSchema = new Schema({
    id_admin:Number,
    pdf:{
        type:String,
        required:[true,'LINKpdf obligatorio']
    }
});

pdfSchema.plugin(uniqueValidator);


module.exports = mongoose.model( 'pdf' , pdfSchema );