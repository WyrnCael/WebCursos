/* 
 * GRUPO 111 - Rubén Casado y Juan José Prieto
 */
"use strict";

var mysql = require("mysql");
var config = require('./config.js');

var pool = mysql.createPool({
    host:  config.dbHost, 
    user:  config.dbUser,
    password: config.dbPassword,
    database: config.dbName
});

function insertCurso(datosCurso, callback){
    pool.getConnection(function(err, con) {
    if (err) {
        callback(err);
    } else {
        con.query("INSERT INTO Cursos(Titulo, Descripcion, Localidad, Direccion, NumPlazas, FechaInicio, FechaFin)" + 
                       " VALUES (?, ?, ?, ?, ?, ?, ?)", [datosCurso.Titulo, datosCurso.Descripcion,
                        datosCurso.Localidad, datosCurso.Direccion, datosCurso.NumPlazas, datosCurso.FechaInicio, datosCurso.FechaFin],
            function(err, rows) { 
                con.release();                
                if (err) {
                    callback(err);
                } else {
                    datosCurso.IdCurso = rows.insertId;
                    insertHorariosCurso(datosCurso, callback);
                }                
            });
        }
    });
}

function insertHorariosCurso(datosCurso, callback){
    if(datosCurso.Horarios.length === 0) callback(datosCurso.IdCurso);
    datosCurso.Horarios.forEach(function(h, indexH, arrayH){
        pool.getConnection(function(err, con) {
        if (err) {
            callback(err);
        } else {
            con.query("INSERT INTO Horarios(IdCurso, Dia, HoraInicio, HoraFin)" + 
                           " VALUES (?, ?, ?, ?)", [datosCurso.IdCurso, h.Dia,
                            h.HoraInicio, h.HoraFin],
                function(err, rows) { 
                    con.release();                
                    if (err) {
                        callback(err);
                    } else {
                        if(indexH === arrayH.length - 1){
                            callback(null, datosCurso.IdCurso);
                        }                        
                    }                
                });
            }
        });
    });
}

function updateCurso(datosCurso, callback){
    pool.getConnection(function(err, con) {
    if (err) {
        callback(err);
    } else {
        con.query("UPDATE Cursos SET Titulo=?, Descripcion=?, Localidad=?, Direccion=?, NumPlazas=?, FechaInicio=?, FechaFin=?" + 
                       " WHERE Id = ?", [datosCurso.Titulo, datosCurso.Descripcion,
                        datosCurso.Localidad, datosCurso.Direccion, datosCurso.NumPlazas, datosCurso.FechaInicio, datosCurso.FechaFin, datosCurso.IdCurso],
            function(err, rows) { 
                con.release();                
                if (err) {
                    callback(err);
                } else {
                    if(rows.affectedRows === 0){
                        callback(null, -1);
                    }
                    else{ 
                        removeHorariosCurso(datosCurso.IdCurso, function(err){
                            if(err){
                                callback(err);
                            } else {
                                insertHorariosCurso(datosCurso, callback);
                            }
                        });   
                    }
                }                
            });
        }
    });
}

function removeHorariosCurso(idCurso, callback){
    pool.getConnection(function(err, con) {
        if (err) {
            callback(err);
        } else {
            con.query("DELETE FROM Horarios WHERE IdCurso = ?", 
                    [idCurso],
            function(err, rows) { 
                con.release();                
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }                
            });
        }
    });
}

function removeCurso(idCurso, callback){
    pool.getConnection(function(err, con) {
    if (err) {
        callback(err);
    } else {
        con.query("DELETE FROM CURSOS WHERE Id = ?", [idCurso],
            function(err, rows) { 
                con.release();                
                if (err) {
                    callback(err);
                } else {
                    if(rows.affectedRows === 0){
                        callback(null, -1);
                    }
                    else{ 
                        callback(null);
                    }
                }                
            });
        }
    });
}

module.exports = {
    insertCurso: insertCurso,
    updateCurso: updateCurso,
    removeCurso: removeCurso
};