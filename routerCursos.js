/* 
 * GRUPO 111 - Rubén Casado y Juan José Prieto
 */
var express = require("express");
var routerCursos = express.Router();
var bodyParser = require("body-parser");
var multer = require("multer");
var upload = multer({ storage: multer.memoryStorage() });
var DAO = require('./DAO.js');

routerCursos.use(bodyParser.json());

routerCursos.post("/", function(req, res) {
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

routerCursos.put("/:id", function(req, res){
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

routerCursos.delete("/:id", function(req, res){
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

routerCursos.get("/:id", function(req, res){
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

routerCursos.get("/:str/:num/:pos", function(req, res){
   var datosBusqueda = {};
   datosBusqueda.str = req.params.str;
   datosBusqueda.num = req.params.num;
   datosBusqueda.pos = req.params.pos;
    DAO.searchByNameCurso(datosBusqueda, function(err, r){
       if(err){
           res.status(500);
           res.json(err);
       } else {
           res.status(200);
           res.json(JSON.stringify(r));
       }
       res.end();
   });
});

routerCursos.put("/:id/imagen", upload.single("imagen"), function(req, res){
   var id = Number(req.params.id);
   var curso = req.body;
   curso.Id = id;
   curso.Imagen = req.file.buffer;
   DAO.insertarImagenCurso(curso, function(err, r){
       if(err){
           res.status(500);
           res.json(err);
       } else {
           res.status(200);
       }
       res.end();
   });
});

routerCursos.get("/:id/imagen", function(req, res){
   var id = Number(req.params.id);
   
    DAO.selectImagenCurso(id, function(err, imagen){
       if(err){
            res.status(404);
            res.end();
       } else {
            res.status(200);
            res.end(imagen, 'binary');
       }
   });
});

module.exports = routerCursos;
