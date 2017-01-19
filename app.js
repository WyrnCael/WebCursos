/* 
 * GRUPO 111 - Rubén Casado y Juan José Prieto
 */
var express = require("express");
var DAO = require('./DAO.js');
var config = require('./config.js');

var app = express();

app.listen(config.port, function(next) {
    console.log("Servidor arrancado en el puerto " + config.port);
});