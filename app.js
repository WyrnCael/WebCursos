/* 
 * GRUPO 111 - Rubén Casado y Juan José Prieto
 */
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var DAO = require('./DAO.js');
var config = require('./config.js');

var app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

app.get("/", function(req, res){
    res.status(300);
    res.redirect("/index.html");
    res.end();
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
   curso.Id = id;
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

app.get("/cursos/:id", function(req, res){
   var id = Number(req.params.id);
   
    DAO.selectCurso(id, function(err, r){
       if(err){
           res.status(500);
           res.json(err);
       } else if (r === -1){
           res.status(404);
       } else {
           res.status(200);
           res.json(r);
       }
       res.end();
   });
});

app.get("/cursos/:str/:num/:pos", function(req, res){
   var datosBusqueda = {};
   datosBusqueda.str = req.params.str;
   datosBusqueda.num = req.params.num;
   datosBusqueda.pos = req.params.pos;
    DAO.searchByNameCurso(datosBusqueda, function(err, r){
       if(err){
           res.status(500);
           res.json(JSON.stringify(err));
       } else {
           res.status(200);
           res.json(JSON.stringify(r));
       }
       res.end();
   });
});

app.listen(config.port, function(next) {
    console.log("Servidor arrancado en el puerto " + config.port);
});