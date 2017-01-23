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
        }
        DAO.login(usuario, function(err, datos){
            if(err){
                callback(null, false);
            } else {
                callback(null, { Id: datos.Id });
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

routerUsuarios.get("/:id", passport.authenticate('basic', {session: false}), function(req, res) {
    res.json({permitido: true}); 
});

module.exports = routerUsuarios;
