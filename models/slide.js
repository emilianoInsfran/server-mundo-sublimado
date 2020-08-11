const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fs = require('fs');
var uniqueValidator = require('mongoose-unique-validator');

let slideSchema = new Schema({
    id_admin:Number,
    img:{
        type:String,
        required:[false]
    },
    name: {
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

slideSchema.plugin(uniqueValidator);


module.exports = mongoose.model( 'slide' , slideSchema );

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