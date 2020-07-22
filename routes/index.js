const express = require('express');

const app = express();

app.use(require('./categoria'));
app.use(require('./producto'));
app.use(require('./preguntas-frecuentes'));
app.use(require('./como-comprar'));
app.use(require('./buscador'));

module.exports = app;