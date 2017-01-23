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
                    datosCurso.Id = rows.insertId;
                    insertHorariosCurso(datosCurso, callback);
                }                
            });
        }
    });
}

function insertHorariosCurso(datosCurso, callback){
    if(datosCurso.Horarios.length === 0) callback(datosCurso.Id);
    datosCurso.Horarios.forEach(function(h, indexH, arrayH){
        pool.getConnection(function(err, con) {
        if (err) {
            callback(err);
        } else {
            con.query("INSERT INTO Horarios(IdCurso, Dia, HoraInicio, HoraFin)" + 
                           " VALUES (?, ?, ?, ?)", [datosCurso.Id, h.Dia,
                            h.HoraInicio, h.HoraFin],
                function(err, rows) { 
                    con.release();                
                    if (err) {
                        callback(err);
                    } else {
                        if(indexH === arrayH.length - 1){
                            callback(null, datosCurso.Id);
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
                        datosCurso.Localidad, datosCurso.Direccion, datosCurso.NumPlazas, datosCurso.FechaInicio, datosCurso.FechaFin, datosCurso.Id],
            function(err, rows) { 
                con.release();                
                if (err) {
                    callback(err);
                } else {
                    if(rows.affectedRows === 0){
                        callback(null, -1);
                    }
                    else{ 
                        removeHorariosCurso(datosCurso.Id, function(err){
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

function selectCurso(idCurso, callback){
    pool.getConnection(function(err, con) {
    if (err) {
        callback(err);
    } else {
        con.query("SELECT Id, Titulo, Descripcion, Localidad, Direccion, FechaInicio, FechaFin, NumPlazas FROM CURSOS WHERE Id = ?", [idCurso],
            function(err, rows) { 
                con.release();                
                if (err) {
                    callback(err);
                } else {
                    if(rows[0]){
                        selectHorariosCurso(rows[0], callback);
                    } else{
                        callback(null, -1);
                    }
                }                
            });
        }
    });
}

function selectHorariosCurso(curso, callback){
    pool.getConnection(function(err, con) {
    if (err) {
        callback(err);
    } else {
        con.query("SELECT * FROM Horarios WHERE IdCurso = ?", [curso.Id],
            function(err, rows) { 
                con.release();                
                if (err) {
                    callback(err);
                } else {
                    curso.Horarios = rows;
                    callback(null, curso);
                }                
            });
        }
    });
}

function searchByNameCurso(datosBusqueda, callback){
    pool.getConnection(function(err, con) {
    if (err) {
        callback(err);
    } else {
        con.query("SELECT * FROM Cursos WHERE Titulo LIKE ? ORDER BY FechaInicio ASC LIMIT ?, ?", 
                    ['%' + datosBusqueda.str + '%', Number(datosBusqueda.pos), Number(datosBusqueda.num)],
            function(err, rows) { 
                con.release();                
                if (err) {
                    callback(err);
                } else {
                    callback(null, rows);
                }                
            });
        }
    });
}

function insertarImagenCurso(curso, callback){
    pool.getConnection(function(err, con) {
    if (err) {
        callback(err);
    } else {
        con.query("UPDATE Cursos SET Imagen=? WHERE Id=?",
                [curso.Imagen, curso.Id],
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

function selectImagenCurso(idCurso, callback){
    pool.getConnection(function(err, con) {
    if (err) {
        callback(err);
    } else {
        con.query("SELECT Imagen FROM CURSOS WHERE Id = ?", [idCurso],
            function(err, rows) { 
                con.release();                
                if (err) {
                    callback(err);
                } else {
                    if(rows[0].Imagen) callback(null, rows[0].Imagen);
                    else callback("El curso no tiene imagen");
                }                
            });
        }
    });
}

function insertUsuario(usuario, callback){
    pool.getConnection(function(err, con) {
    if (err) {
        callback(err);
    } else {
        con.query("INSERT INTO Usuarios(Correo, Password, Nombre, Apellidos, Sexo, FechaNacimiento)" + 
                       " VALUES (?, ?, ?, ?, ?, ?)", [usuario.Correo, usuario.Password,
                        usuario.Nombre, usuario.Apellidos, usuario.Sexo, usuario.FechaNacimiento],
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

module.exports = {
    insertCurso: insertCurso,
    updateCurso: updateCurso,
    removeCurso: removeCurso,
    selectCurso: selectCurso,
    searchByNameCurso: searchByNameCurso,
    insertarImagenCurso: insertarImagenCurso,
    selectImagenCurso: selectImagenCurso,
    insertUsuario: insertUsuario
};