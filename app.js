/* 
 * GRUPO 111 - Rubén Casado y Juan José Prieto
 */
var express = require("express");
var bodyParser = require("body-parser");
var DAO = require('./DAO.js');
var config = require('./config.js');

var app = express();

app.use(bodyParser.json());

app.get("/", function(req, res){
    /* curso = {};
    curso.Titulo = "AAA";
    curso.Descripcion = "BBB";
    curso.Localidad = "MMM";
    curso.Direccion = "MMO";
    curso.NumPlazas = 5;
    curso.FechaInicio = new Date();
    curso.FechaFin = new Date();
    curso.Horarios = [];
    var horario = {};
    horario.Dia = "Lunes";
    var date = new Date();
    horario.HoraInicio = date.getTime();
    horario.HoraFin = date.getTime();
    curso.Horarios.push(horario);
    var horario = {};
    horario.Dia = "Martes";
    var date = new Date();
    horario.HoraInicio = date.getTime();
    horario.HoraFin = date.getTime();
    curso.Horarios.push(horario);
    var horario = {};
    horario.Dia = "Miercoles";
    var date = new Date();
    horario.HoraInicio = date.getTime();
    horario.HoraFin = date.getTime();
    curso.Horarios.push(horario); 
   DAO.insertCurso(curso, function(err, datos){
       res.end();
   }) ; */
});

app.post("/cursos", function(req, res) {
    DAO.insertCurso(req.body, function(err, id){
        if(err){
           res.status(500);
        } 
        else{
           var r = {};
           r.IdCursoInsertado = id;
           res.status(201);
           res.json(r);
        }      
        res.end();
    });
});

app.listen(config.port, function(next) {
    console.log("Servidor arrancado en el puerto " + config.port);
});