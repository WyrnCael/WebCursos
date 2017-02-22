/* 
 * GRUPO 111 - Rubén Casado y Juan José Prieto
 */
var express = require("express");
var routerUsuarios = express.Router();
var bodyParser = require("body-parser");
var passport = require("passport");
var passportHTTP = require("passport-http");
var DAO = require('./DAO.js');

routerUsuarios.use(bodyParser.json());

routerUsuarios.use(passport.initialize());
passport.use(new passportHTTP.BasicStrategy(
    { 
        realm: 'Autenticacion requerida' 
    },
    function(correo, pass, callback) {
        var usuario = {
            Correo: correo,
            Password: pass
        };
        DAO.login(usuario, function(err, datos){
            if(err){
                callback(err);
            } else {
                callback(null, datos);
            }
        });
    }
));

routerUsuarios.post("/", function(req, res) {
    DAO.insertUsuario(req.body, function(err, id){
        if(err){
           res.status(500);
           res.json(err);
        } 
        else{
           var r = {};
           r.IdUsuarioInsertado = id;
           res.status(201);
           res.json(r);
        }      
        res.end();
    });
});

routerUsuarios.get("/", passport.authenticate('basic', {session: false}), function(req, res) {
    res.json({permitido: true});
});

routerUsuarios.post("/inscripcion", passport.authenticate('basic', {session: false}), function(req, res) {
    DAO.inscribirUsuarioEnCurso(req.user.Id, req.body.Id, function(err){
        if(err){
            res.status(500);
            res.json(err);
        } else {
            var r = {};
           r.Exito = "Curso añadido con exito";
           res.status(201);
           res.json(r);
        }
    });
});

routerUsuarios.get("/cursos", passport.authenticate('basic', {session: false}), function(req, res) {
    DAO.getCursosUsuario(req.user.Id, function(err, cursos){
        if(err){
            res.status(404);
            res.end();
        } else {
            res.json(cursos);
        }        
    });
});

routerUsuarios.get("/horarioSemana/:inicioSemana/:finSemana", passport.authenticate('basic', {session: false}), function(req, res) {
    var curso = {};
    var inicio = req.params.inicioSemana;
    var fin = req.params.finSemana;
    curso.FechaInicio = Number(inicio.substring(4,8)) + "-" + Number(inicio.substring(2,4)) + "-" + Number(inicio.substring(0,2));
    curso.FechaFin = Number(fin.substring(4,8)) + "-" + Number(fin.substring(2,4)) + "-" + Number(fin.substring(0,2));   
    curso.IdUsuario = req.user.Id;
    DAO.selectCursoSemanaAct(curso, function(err, cursos){
        if(err){
            res.status(500);
            res.json(err);
        } else {
           res.json(cursos);
        }
    });
});

module.exports = routerUsuarios;
