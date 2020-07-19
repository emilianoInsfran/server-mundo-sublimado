require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());

app.use(cors());

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

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





