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
   
});

app.post("/cursos", function(req, res) {
    DAO.insertCurso(req.body, function(err, id){
        if(err){
           res.status(500);
           res.json(err);
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

app.put("/cursos/:id", function(req, res){
   var id = Number(req.params.id);
   var curso = req.body;
   curso.IdCurso = id;
   DAO.updateCurso(curso, function(err, r){
       if(err){
           res.status(500);
           res.json(err);
       } else if (r === -1){
           res.status(404);
       } else {
           res.status(200);
       }
       res.end();
   });
});

app.delete("/cursos/:id", function(req, res){
   var id = Number(req.params.id);
   
    DAO.removeCurso(id, function(err, r){
       if(err){
           res.status(500);
           res.json(err);
       } else if (r === -1){
           res.status(404);
       } else {
           res.status(200);
       }
       res.end();
   });
});

app.listen(config.port, function(next) {
    console.log("Servidor arrancado en el puerto " + config.port);
});