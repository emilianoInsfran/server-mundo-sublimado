require('./config/config');
const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
const fileUpload = require('express-fileupload');

const app = express();



app.use(bodyParser.json({
    limit: '50mb'
  }));
  
  app.use(bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: true 
  }));

app.use('/media',express.static( path.resolve( __dirname, 'uploads')));

app.use(cors());

app.use(require('./routes/slide'));

app.use(require('./routes/categoria'));

app.use(require('./routes/test'));

app.use(require('./routes/producto'));



app.use(require('./routes/preguntas-frecuentes'));
app.use(require('./routes/como-comprar'));
app.use(require('./routes/buscador'));
app.use(require('./routes/email'));
app.use(require('./routes/pdf'));



app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use(fileUpload());





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


