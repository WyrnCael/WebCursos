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
                        datosCurso.Localidad, datosCurso.Direccion, datosCurso.NumPlazas, 
                        formateaFechaEntrada(datosCurso.FechaInicio), formateaFechaEntrada(datosCurso.FechaFin)],
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
                            formateaHoraEntrada(h.HoraInicio), formateaHoraEntrada(h.HoraFin)],
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
                        rows[0].FechaInicio = formateaFechaSalida(rows[0].FechaInicio);
                        rows[0].FechaFin = formateaFechaSalida(rows[0].FechaFin);
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
                    rows.forEach(function(h){
                       h.HoraInicio = formateaHoraSalida(h.HoraInicio) ;
                       h.HoraFin = formateaHoraSalida(h.HoraFin) ;
                    });
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
        con.query("SELECT Id, Titulo, Localidad, FechaInicio, FechaFin FROM Cursos WHERE Titulo LIKE ? ORDER BY FechaInicio ASC LIMIT ?, ?", 
                    ['%' + datosBusqueda.str + '%', Number(datosBusqueda.pos), Number(datosBusqueda.num)],
            function(err, rows) { 
                con.release();                
                if (err) {
                    callback(err);
                } else {
                    rows.forEach(function(p){
                        p.FechaInicio = formateaFechaSalida(p.FechaInicio);
                        p.FechaFin = formateaFechaSalida(p.FechaFin);
                    });                    
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
                        usuario.Nombre, usuario.Apellidos, formateaSexoEntrada(usuario.Sexo), formateaFechaEntrada(usuario.FechaNacimiento)],
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

function login(usuario, callback){
    pool.getConnection(function(err, con) {
    if (err) {
        callback(err);
    } else {
        var sql = "SELECT * FROM Usuarios WHERE Correo = ? AND Password = ?";
        con.query(sql, [usuario.Correo, usuario.Password],
            function(err, rows) { 
                con.release();
                if (err) {
                    callback(err);
                } else {
                    if(rows[0] === undefined){
                        callback(-1);
                    } else{
                        rows[0].Sexo = formateaSexoSalida(rows[0].sexo);
                        rows[0].FechaNacimiento = formateaFechaSalida(rows[0].FechaNacimiento);
                        callback(null, rows[0]); 
                    }                   
                }                
            });
        }
    });
}

function inscribirUsuarioEnCurso(idUsuario, idCurso, callback){
    pool.getConnection(function(err, con) {
    if (err) {
        callback(err);
    } else {
        con.query("INSERT INTO UsuariosEnCursos(IdUsuario, IdCurso)" + 
                       " VALUES (?, ?)", [idUsuario, idCurso],
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

function getCursosUsuario(idUsuario, callback){
    pool.getConnection(function(err, con) {
    if (err) {
        callback(err);
    } else {
        con.query("SELECT * FROM UsuariosEnCursos WHERE IdUsuario = ?", 
                    [idUsuario],
            function(err, rows) { 
                con.release();                
                if (err) {
                    callback(err);
                } else {
                    rows.forEach(function(c, index, array){
                        selectCurso(c.IdCurso, function(err, datosCurso){
                            if(err){
                                callback(err);
                            } else {
                                c.DatosCurso = datosCurso;
                                if(index === array.length - 1){
                                    callback(null, rows);
                                }
                            }
                        });                        
                    });                    
                }                
            });
        }
    });
}


function formateaFechaSalida(mySQLDate){
    console.log("Mysqldate " + mySQLDate);
    var fechaFormateada = ('0' + Number(mySQLDate.getDate())).slice(-2) + "/" + ('0' + Number(mySQLDate.getMonth()+1)).slice(-2) + "/" + mySQLDate.getFullYear();    
    return fechaFormateada;
}

function formateaFechaEntrada(stringDate){
    var fNacimiento = new Date();
    fNacimiento.setDate(Number(stringDate.substring(0,2)));
    fNacimiento.setMonth(Number(stringDate.substring(3,5)) - 1);
    fNacimiento.setFullYear(Number(stringDate.substring(6,10)));
    
    return fNacimiento;
}

function formateaSexoEntrada(sexoString){
    var sexo = 0;
    if(sexoString === "Mujer"){
        sexo = 1;
    }  
    return sexo;
}

function formateaSexoSalida(sexoInt){
    var sexo = "Hombre";
    if(sexoInt === 1){
        sexo = "Mujer";
    }  
    return sexo;
}

function formateaHoraEntrada(stringTime){
    stringTime += ":00";
    return stringTime; 
}

function formateaHoraSalida(mysqlTime){
    return mysqlTime.substring(0,5); 
}

module.exports = {
    insertCurso: insertCurso,
    updateCurso: updateCurso,
    removeCurso: removeCurso,
    selectCurso: selectCurso,
    searchByNameCurso: searchByNameCurso,
    insertarImagenCurso: insertarImagenCurso,
    selectImagenCurso: selectImagenCurso,
    insertUsuario: insertUsuario,
    login: login,
    inscribirUsuarioEnCurso: inscribirUsuarioEnCurso,
    getCursosUsuario: getCursosUsuario
};