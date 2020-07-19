require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());

app.use(cors());

app.use(require('./routes/index'));

mongoose.set('useFindAndModify', false);

mongoose.connect(process.env.URLDB,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
},(err,res)=>{

    if( err ) throw err;

    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT ,()=>{
    console.log('escuchando el puerto',process.env.PORT);
});





