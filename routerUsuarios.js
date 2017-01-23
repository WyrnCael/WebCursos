/* 
 * GRUPO 111 - Rubén Casado y Juan José Prieto
 */
var express = require("express");
var routerUsuarios = express.Router();
var bodyParser = require("body-parser");
var DAO = require('./DAO.js');

routerUsuarios.use(bodyParser.json());

routerUsuarios.post("/", function(req, res) {
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

module.exports = routerUsuarios;
