/* 
 * GRUPO 111 - Rubén Casado y Juan José Prieto
 */
var express = require("express");
var path = require("path");
var https = require("https");
var fs = require("fs");
var config = require('./config.js');
var routerCursos = require("./routerCursos");
var routerUsuarios = require("./routerUsuarios");
var clavePrivada = fs.readFileSync(config.private_key);
var certificado = fs.readFileSync(config.certificate);

var app = express();
app.use("/cursos", routerCursos);
app.use("/usuarios", routerUsuarios);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function(req, res){
    res.status(300);
    res.redirect("/index.html");
    res.end();
});

var servidor = https.createServer(
 { key: clavePrivada, cert: certificado }, app );

servidor.listen(config.port, function(next) {
    console.log("Servidor arrancado en el puerto " + config.port);
});