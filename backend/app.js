const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

const routes = require('./routes');
app.use('/', routes);

module.exports = app;