/* 
 * GRUPO 111 - Rubén Casado y Juan José Prieto
 */
"use strict";

define([], function() {
    var cadenaBase64 = null;
    var inSemHorarioActual = undefined;
    
    function mostrarIdentificarse(){
        $("#panelCentral").find("*").remove();
        
        var panel = $("<h1>Identificación</h1>" +
                "<div id='erroresLogin'></div>" +
            "<form role='form' id='formIdent'>" +
                "<div class='form-group'>" +
                    "<label for='correo'>" +
                    "Dirección de correo:</label>" +
                    "<div class='input-group col-sm-12' id='inputIdentificacion'>" +
                        "<input class='form-control'" +
                            "id='correo'" +
                            "placeholder='ejemplo@ejemplo.com'" +
                            "type='text'>" +
                    "</div></div>" +
                "<div class='form-group'>" +
                    "<label for='password'>" +
                    "Contraseña:</label>" +
                    "<div class='input-group col-sm-12' id='inputIdentificacion'>" +
                        "<input class='form-control'" +
                            "id='password'" +
                            "placeholder='****'" +
                            "type='password'>" +
                    "</div></div>" + 
                "<div class='form-group'>" +
                    "<div id='botonesRegistro' class='input-group'>" +
                        "<button class='btn btn-primary' id='botonLogin'>Identificarse</button>" +
                        "<button class='btn btn-link' id='botonRegistro'>Crear nueva cuenta</button>" +
                    "</div></div>" +
                "</div>" +
            "</form>");
        
        $("#panelCentral").append(panel);
        
        $("#buscarCursos").removeClass("active");
        $("#misCursos").removeClass("active");
        
        $("#botonLogin").on("click", function(e) {
            e.preventDefault();
            var correo = $("#correo").val();
            var password = $("#password").val();

            $("#erroresLogin").text("");
            $("#erroresLogin").removeClass("alert alert-danger");
           
            if(correo === ""){
                $("#erroresLogin").addClass("alert alert-danger");
                $("#erroresLogin").append("<strong>¡Error!</strong> La dirección de correo no puede estar vacia.");
            }
            else if(password === "") {
                $("#erroresLogin").addClass("alert alert-danger");
                $("#erroresLogin").append("<strong>¡Error!</strong> La contraseña no puede estar vacia.");
            }
            else{
                login(correo, password);
            }                 
        });
        
        $("#botonRegistro").on("click", function(e) {
            e.preventDefault();
            mostrarNuevoRegistro();                
        });
    }
    
    function mostrarNuevoRegistro(){
        $("#panelCentral").find("*").remove();
        
        var panel = $("<h1>Nuevo usuario</h1>" +
                "<div id='erroresRegistro'></div>" +
            "<form id='formRegistro' class='form-horizontal' role='form'>" +
                "<div class='form-group'>" +
                    "<label class='contol-label col-sm-2' for='correo'>" +
                    "Dirección de correo</label>" +
                    "<div class='col-sm-10' id='inputIdentificacion'>" +
                        "<input class='form-control'" +
                            "id='correo'" +
                            "placeholder='ejemplo@ejemplo.com'" +
                            "type='text'>" +
                    "</div></div>" + 
                "<div class='form-group'>" +
                    "<label class='contol-label col-sm-2' for='password'>" +
                    "Contraseña</label>" +
                    "<div class='col-sm-10' id='inputIdentificacion'>" +
                        "<input class='form-control'" +
                            "id='password'" +
                            "placeholder='****'" +
                            "type='password'>" +
                    "</div></div>" +
                "<div class='form-group'>" +
                    "<label class='contol-label col-sm-2' for='nombre'>" +
                    "Nombre</label>" +
                    "<div class='col-sm-10' id='inputIdentificacion'>" +
                        "<input class='form-control'" +
                            "id='nombre'" +
                            "placeholder='Pepito'" +
                            "type='text'>" +
                    "</div></div>" + 
                "<div class='form-group'>" +
                    "<label class='contol-label col-sm-2' for='apellidos'>" +
                    "Apellidos</label>" +
                    "<div class='col-sm-10' id='inputIdentificacion'>" +
                        "<input class='form-control'" +
                            "id='apellidos'" +
                            "placeholder='Grillo'" +
                            "type='text'>" +
                    "</div></div>" + 
                "<div class='form-group'>" +
                    "<label class='contol-label col-sm-2' for='sexo'>" +
                    "Sexo</label>" +
                    "<div class='col-sm-10' id='inputIdentificacion'>" +
                        "<label class='radio-inline'>" +
                            "<input type='radio' id='sexo' value='Hombre' name='tipoSexo'>Hombre" +
                        "</label>" +
                        "<label class='radio-inline'>" +
                            "<input type='radio' id='sexo' value='Mujer' name='tipoSexo'>Mujer" +
                        "</label>" +
                    "</div></div>" + 
                "<div class='form-group'>" +
                    "<label class='contol-label col-sm-2' for='fNacimiento'>" +
                    "Fecha nacimiento</label>" +
                    "<div class='col-sm-10' id='inputIdentificacion'>" +
                        "<input class='form-control'" +
                            "id='fNacimiento'" +
                            "placeholder='dd/mm/aaaa'" +
                            "type='text'>" +
                    "</div></div>" + 
                "<div class='form-group'>" +
                    "<div id='botonesRegistro' class='input-group'>" +
                        "<button class='btn btn-primary' id='botonCrearUsuario'>Crear nuevo usuario</button>" +
                    "</div>" +
                "</div></div>" +
            "</form>");
        
        $("#panelCentral").append(panel);
        
        $("#botonCrearUsuario").on("click", function(e) {
            e.preventDefault();
            var usuario = {
                Correo: $("#correo").val(),
                Password: $("#password").val(),
                Nombre: $("#nombre").val(),
                Apellidos: $("#apellidos").val(),
                Sexo: $("input[name=tipoSexo]:checked", "#formRegistro").val(),
                FechaNacimiento: $("#fNacimiento").val()
            };
            if(validaRegistro(usuario)) registrar(usuario);        
        });
    }
    
    function login(correo, password){
        cadenaBase64 = btoa(correo + ":" + password);
        
        $.ajax({
            method: "GET",
            url: "/usuarios",
            beforeSend: function(req) {
                req.setRequestHeader("Authorization",
                "Basic " + cadenaBase64);
            },
            success: function(data, state, jqXHR) {
                if (data.permitido) {
                    $("#navDerecha").find("li").remove();
                    var datosUsuario = $("<li id='datosUser'>" + correo + "</li>");
                    $("#navDerecha").append(datosUsuario);
                    var botonDesconectar = $("<li><button class='btn btn-default navbar-btn' id='botonDesconectar'>Desconectarse</button></li>");
                    $("#navDerecha").append(botonDesconectar);                    
                    $("#navIzquierda").append("<li id='misCursos'><a href='#'>Mis cursos</a></li>");                    
                    
                    $("#botonDesconectar").on("click", function(e) {
                        e.preventDefault();
                        desconectar();                
                    });
                    
                    $("#misCursos").on("click", function(e) {
                        e.preventDefault();
                        $("#buscarCursos").removeClass("active");
                        $("#misCursos").addClass("active");
                        mostrarCursosUsuario();                        
                    });
                    
                    requirejs("navegacion").mostrarBuscarCursos();
                }
            },
            error: function (jqXHR, textStatus, errorThrown ) {
                if(jqXHR.responseText === "-1\n"){
                    $("#erroresLogin").text("");
                    $("#erroresLogin").addClass("alert alert-danger");
                    $("#erroresLogin").append("<strong>¡Usuario o contraseña incorrectos!</strong>");
                } else {
                    alert( "Se ha producido un error: " + jqXHR.responseText);
                }
            }
                    
        });

    }
    
    function registrar(usuario){
        $.ajax({
            method: "POST",
            type: "POST",
            url: "/usuarios",
            contentType: "application/json",
            data: JSON.stringify(usuario),
            success: function(data, state, jqXHR) {
                login(usuario.Correo, usuario.Password);
            },
            error: function (jqXHR, textStatus, errorThrown ) {
                if(jqXHR.responseJSON.code === "ER_DUP_ENTRY"){
                    $("#erroresRegistro").text("");
                    $("#erroresRegistro").addClass("alert alert-danger");
                    $("#erroresRegistro").append("<strong>¡Error!</strong> Ya existe un usuario con esa dirección de correo.");
                } else {
                    alert( "Se ha producido un error: " + jqXHR.responseJSON.code);
                }
            }
                    
        });
    }
    
    function estaInscrito(idCurso, vacantes){
        if(cadenaBase64){
            $.ajax({
                method: "GET",
                url: "/usuarios/cursos",
                beforeSend: function(req) {
                    req.setRequestHeader("Authorization",
                    "Basic " + cadenaBase64);
                },
                success: function(data, state, jqXHR) {
                    var cursos = data.filter(function(curso){
                       return curso.IdCurso ===  idCurso;
                    });            
                    
                    if(cursos.length > 0) $(".modal-footer").append("<a href='#' disabled='disabled' class='btn btn-success' id='insritoCurso' data-id='" + idCurso + "'>Ya estás inscrito</a>");
                    else if(vacantes === 0) $(".modal-footer").append("<a href='#' disabled='disabled' class='btn btn-danger' id='insribirSinVacantes' data-id='" + data.Id + "'>No hay vacantes</a>");
                    else $(".modal-footer").append("<a href='#' class='btn btn-primary' id='insribirseCurso' data-id='" + idCurso + "'>Inscribirse</a>");
                    
                    $("#insribirseCurso").on("click", function() {
                        incribirseEnCurso(Number($(this).data("id")));
                    });
                },
                error: function (jqXHR, textStatus, errorThrown ) {
                    alert("¡Acceso denegado!");
                }

            });            
        } else {
            return -1;
        }
    }
    
    function desconectar(){
        cadenaBase64 = null;
        
        $("#navDerecha").find("li").remove();
        var botonConectar = $("<li><button class='btn btn-default navbar-btn' id='botonIdentificarse'>Identificarse</button></li>");
        $("#navDerecha").append(botonConectar);
        $("#misCursos").remove();        
        
        $("#botonIdentificarse").on("click", function(e) {
            e.preventDefault();        
            mostrarIdentificarse();
        });
        
        requirejs("navegacion").mostrarBuscarCursos();
    }
    
    function incribirseEnCurso(idCurso){
        $.ajax({
            method: "POST",
            type: "POST",
            url: "/usuarios/inscripcion",
            contentType: "application/json",
            beforeSend: function(req) {
                req.setRequestHeader("Authorization",
                "Basic " + cadenaBase64);
            },
            data: JSON.stringify({ Id: idCurso }),
            success: function(data, state, jqXHR) {
                $("#insribirseCurso").remove();
                $(".modal-footer").append("<a href='#' disabled='disabled' class='btn btn-success' id='insritoCurso'>Inscrito con éxito</a>");
            },
            error: function (jqXHR, textStatus, errorThrown ) {
                alert( "Se ha producido un error: " + jqXHR.responseJSON.code);
            }
                    
        });
    }
    
    function mostrarCursosUsuario(){
        $("#panelCentral").find("*").remove();

        var panelProximos = $("<h1>Próximos cursos</h1>" +
            "<div id='tablaProximosCursos' class='table-responsive'>" +
                "<table class='table  table-hover'>" +
                "<thead>" +
                    "<tr><th>Nombre</th>" +
                        "<th>Lugar</th>" +
                        "<th>Inicio</th>" +
                        "<th>Fin</th></tr>" +
                "</thead>" +
                "<tbody>               " +
                "</tbody>" +
                "</table>" +
            "</div>");
        $("#panelCentral").append(panelProximos); 
        
        var panelActuales = $("<h1>Cursos realizados</h1>" +
            "<div id='tablaCursosActuales' class='table-responsive'>" +
                "<table class='table  table-hover'>" +
                "<thead>" +
                    "<tr><th>Nombre</th>" +
                        "<th>Lugar</th>" +
                        "<th>Inicio</th>" +
                        "<th>Fin</th></tr>" +
                "</thead>" +
                "<tbody>               " +
                "</tbody>" +
                "</table>" +
            "</div>");
    
        $("#panelCentral").append(panelActuales);
    
        var panelHorarios = $("<h1>Horario</h1>" +
            "<div id='tablaHorarios' class='table-responsive'>" +
                "<table class='table  table-bordered'>" +
                "<thead>" +
                        "<tr><th>Horas</th>" +
                        "<th>Lunes</th>" +
                        "<th>Martes</th>" +
                        "<th>Miercoles</th>" +
                        "<th>Jueves</th>" +
                        "<th>Viernes</th>" +
                        "<th>Sabado</th>" +
                        "<th>Domingo</th></tr>" +
                        "</thead>" +
                "<tbody>               " +
                "</tbody>" +
                "</table>" +
                "<div id='paginadorHorarios'></div>" +
            "</div>");
           
        $("#panelCentral").append(panelHorarios); 
        
        
        
        var modal = $("<div class='modal fade' id='infoCurso' tabindex='-1' role='dialog' aria-labelledby='cursoModal' aria-hidden='true'>" +
                "<div class='modal-dialog' role='document'>" +
                    "<div class='modal-content'>" +
                        "<div class='modal-header'>" +
                           "<button type='button' class='close' data-dismiss='modal' aria-label='Close'>&times;</button>    " +
                           "<h3 class='modal-title' id='cursoModal'></h3>" +
                        "</div>" +
                       "<div class='modal-body'>" +
                       "</div>" +
                       "<div class='modal-footer'>" +
                           "<a href='#' data-dismiss='modal' class='btn btn-default'>Cerrar</a>" +                           
                       "</div>" +
                    "</div>" +
                "</div>" +
            "</div>");
            
        $("body").append(modal); 
            
        
        buscarYMostrarCursos();
    }
    
    function buscarYMostrarCursos(){
        $.ajax({
            method: "GET",
            url: "/usuarios/cursos",
            beforeSend: function(req) {
                req.setRequestHeader("Authorization",
                "Basic " + cadenaBase64);
            },
            success: function(data, state, jqXHR) {
                var resultadosProximos = false, resultadosActuales = false;
                $.each(data, function(index, curso) {
                    var nuevaFila = $("<tr data-id='" + curso.DatosCurso.Id + "'  style='cursor: pointer'><td>" + curso.DatosCurso.Titulo + "</td>" +
                            "<td>" + curso.DatosCurso.Localidad + "</td>" +
                            "<td>" + curso.DatosCurso.FechaInicio + "</td>" +
                            "<td>" + curso.DatosCurso.FechaFin + "</td></tr>");
                    var fechaInicio = new Date(Number(curso.DatosCurso.FechaInicio.substring(6,10)), Number(curso.DatosCurso.FechaInicio.substring(3,5)) - 1, Number(curso.DatosCurso.FechaInicio.substring(0,2)));
                    var fechaActual = new Date();
                    if(fechaInicio > fechaActual){
                        $("#tablaProximosCursos").find("tBody").append(nuevaFila);
                        resultadosProximos = true;
                    }
                    else {
                        $("#tablaCursosActuales").find("tBody").append(nuevaFila);
                        resultadosActuales = true;
                    }
                    
                });
                if(!resultadosProximos){
                    $("#tablaProximosCursos thead").find("th").remove();
                    $("#tablaProximosCursos thead").find("tr").append("No estas inscrito en ningun curso que no haya comenzado o finalizado.");
                }
                if(!resultadosActuales){
                    $("#tablaCursosActuales thead").find("th").remove();
                    $("#tablaCursosActuales thead").find("tr").append("No estas inscrito en ningun curso que haya empezado o finalizado.");
                }
                
                $("#tablaProximosCursos tbody tr").on("click", function() {
                    requirejs("cursos").mostrarInfoCurso(Number($(this).data("id")));
                });
                $("#tablaCursosActuales tbody tr").on("click", function() {
                    requirejs("cursos").mostrarInfoCurso(Number($(this).data("id")));
                });
                
                muestraHorario(data);
            },
            error: function (jqXHR, textStatus, errorThrown ) {
                alert("¡Acceso denegado!");
            }
                    
        });
    }
    
    function validaRegistro(usuario){
        $("#erroresRegistro").text("");
        $("#erroresRegistro").removeClass("alert alert-danger");
        var dtRegex = new RegExp(/\b\d\d\/\d\d\/\d\d\d\d\b/);

        if(usuario.Correo === ""){
            $("#erroresRegistro").addClass("alert alert-danger");
            $("#erroresRegistro").append("<strong>¡Error!</strong> La dirección de correo no puede estar vacia.");
        } else if(usuario.Password === "") {
            $("#erroresRegistro").addClass("alert alert-danger");
            $("#erroresRegistro").append("<strong>¡Error!</strong> La contraseña no puede estar vacia.");
        } else if(usuario.Nombre === "") {
            $("#erroresRegistro").addClass("alert alert-danger");
            $("#erroresRegistro").append("<strong>¡Error!</strong> El nombre no puede estar vacio.");
        } else if(usuario.Apellidos === "") {
            $("#erroresRegistro").addClass("alert alert-danger");
            $("#erroresRegistro").append("<strong>¡Error!</strong> Debes introducir Apellidos.");
        } else if(usuario.Sexo === undefined) {
            $("#erroresRegistro").addClass("alert alert-danger");
            $("#erroresRegistro").append("<strong>¡Error!</strong> Debes elegir un sexo.");
        } else if(usuario.FechaNacimiento === "") {
            $("#erroresRegistro").addClass("alert alert-danger");
            $("#erroresRegistro").append("<strong>¡Error!</strong> La fecha de nacimiento no puede estar vacia.");
        } else if(!dtRegex.test(usuario.FechaNacimiento)) {
            $("#erroresRegistro").addClass("alert alert-danger");
            $("#erroresRegistro").append("<strong>¡Error!</strong> El formato de la fecha de nacimiento debe ser del tipo dd/mm/aaaa.");
        } else {
            return true;
        }            
        return false;
    }
    
    function rellenaHorario(semanaActual){
        // Guardamos los horarios de la semana actual en un array
        var horariosSemanaActual = [];
        semanaActual.forEach(function (curso){
            curso.DatosCurso.Horarios.forEach(function (horario){
                horario.Nombre = curso.DatosCurso.Titulo;            
                horariosSemanaActual.push(horario);        
            });                
        });
        
        // Ordenamos el array por fecha de inicio
        if(horariosSemanaActual.length > 0){
            horariosSemanaActual.sort(function(a, b){ 
                if(a.HoraInicio === b.HoraInicio){
                    return a.HoraFin > b.HoraFin; 
                } else {
                    return a.HoraInicio > b.HoraInicio;
                }            
            });
        }
        
        // Calculamos las filas necesarias
        var tramos = [];
        tramos[0] = "00:00";
        tramos[1] = "24:00";
        var iHoras = 2;
        horariosSemanaActual.forEach(function(horario, index, array){
            if(!tramos.includes(horario.HoraInicio)){
                tramos[iHoras] = horario.HoraInicio;
                iHoras++;
            }
            if(!tramos.includes(horario.HoraFin)){
                tramos[iHoras] = horario.HoraFin;
                iHoras++;
            }
        });        
        tramos.sort();         
        for(var i = 0; i < tramos.length - 1; i++){
            $("#tablaHorarios").find("tBody").append("<tr id='tramo" + i +"'><td>" + tramos[i] + " - " + tramos[i+1] + "</td></tr>");
        }
        
        
        // Rellenamos la tabla
        for(var i = 1; i <= 7;i++){
            var diaActual = horariosSemanaActual.filter(function(h){
               if( h.Dia === i) return true; 
            });
            
            var texto = "";
            var tamanyoCol = 1;
            tramos.forEach(function(tramo, index, array){
                var textoAnterior = texto;
                diaActual.forEach(function(hor, indexH, arrayH) {
                    if(comparaHorarios(hor.HoraInicio, tramo) <= 0 && comparaHorarios(hor.HoraFin, tramo) > 0){
                        if(texto === "") texto = hor.Nombre;
                        else texto += " / " +  hor.Nombre;
                    }
                });
                if(texto !== "" && texto === textoAnterior) tamanyoCol++;
                else {
                    if(texto === "")$("#tramo" + index).append("<td></td>");
                    else
                        $("#tramo" + index).append("<td class='bg-success' align='center' valign='middle' rowspan='" + tamanyoCol + "'>" + texto + "</td>");
                    tamanyoCol = 1;
                    texto = "";
                }
            });
        }        
    }
    
    function muestraHorario(data){
        // Filtramos los datos por la semana actual
        var inicioSemana = new Date();
        inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay() + 1);
        var finSemana = new Date(inicioSemana);
        finSemana.setDate(finSemana.getDate() + 6);
        inSemHorarioActual = inicioSemana;
        
        var semanaActual = data.filter(function (curso){
            var fechaInicio = formateaFecha(curso.DatosCurso.FechaInicio);
            var fechaFin = formateaFecha(curso.DatosCurso.FechaFin);
            if( fechaInicio <= finSemana && fechaFin >= inicioSemana){
                return true;
            }
        });
        
        // Mostramos el horario de la semana actual
        rellenaHorario(semanaActual);       
        
        $("#paginadorHorarios").append("<button id='btnHAnterior' class='btn btn-default botonHorario' type='submit' align='left'> &larr; Semana anterior</button>");
        $("#paginadorHorarios").append("<div id='semanaHor' align='center'>" + textoPeriodoHActual(inicioSemana, finSemana) + "</div>");
        $("#paginadorHorarios").append("<button id='btnHSiguiente' class='btn btn-default botonHorario' type='submit'>Semana siguiente &rarr; </button>");
        
        $("#btnHAnterior").on("click", function(e) {
            e.preventDefault();
            
            var inicioSemAct = new Date(inSemHorarioActual);
            inicioSemAct.setDate(inicioSemAct.getDate() - 7);
            obtenYRellenaHorario(inicioSemAct);
        });
        
        $("#btnHSiguiente").on("click", function(e) {
            e.preventDefault();
            
            var inicioSemAct = new Date(inSemHorarioActual);
            inicioSemAct.setDate(inicioSemAct.getDate() + 7);
            obtenYRellenaHorario(inicioSemAct);
        });
    }
    
    function obtenYRellenaHorario(inicioSemana){
        var finSemAct = new Date(inicioSemana);
        finSemAct.setDate(finSemAct.getDate() + 6);
        inSemHorarioActual = inicioSemana;       
        
        $.ajax({
            method: "GET",
            url: "/usuarios/horarioSemana/" + formateaFechaPeticion(inicioSemana) + "/" + formateaFechaPeticion(finSemAct),
            beforeSend: function(req) {
                req.setRequestHeader("Authorization",
                "Basic " + cadenaBase64);
            },
            success: function(data, state, jqXHR) {
                $("#tablaHorarios").find("tBody").find("*").remove();
                rellenaHorario(data);              
                $("#semanaHor").text(textoPeriodoHActual(inicioSemana, finSemAct));
            }, 
            error: function (jqXHR, textStatus, errorThrown ) {
                alert("¡Acceso denegado!");
            }
        });  
    }
    
    function formateaFecha(stringDate){
        var fNacimiento = new Date();
        fNacimiento.setDate(Number(stringDate.substring(0,2)));
        fNacimiento.setMonth(Number(stringDate.substring(3,5)) - 1);
        fNacimiento.setFullYear(Number(stringDate.substring(6,10)));

        return fNacimiento;
    }    
    
    function comparaHorarios(a, b) { 
        var horaA = parseInt(a.substring(0,2));
        var minutosA = parseInt(a.substring(3,5));
        var horaB = parseInt(b.substring(0,2));
        var minutosB = parseInt(b.substring(3,5));
        if(horaA === horaB)
            return minutosA - minutosB;
        else
            return horaA-horaB;
    }
    
    function formateaFechaSalida(date){
        var fechaFormateada = ('0' + Number(date.getDate())).slice(-2) + "/" + ('0' + Number(date.getMonth()+1)).slice(-2) + "/" + date.getFullYear();    
        return fechaFormateada;
    }
    
    function formateaFechaPeticion(mySQLDate){
    var fechaFormateada = ('0' + Number(mySQLDate.getDate())).slice(-2) + ('0' + Number(mySQLDate.getMonth()+1)).slice(-2) + mySQLDate.getFullYear();    
    return fechaFormateada;
}
    
    function textoPeriodoHActual(inicioSemana, finSemana){
        var text = formateaFechaSalida(inicioSemana) + " - " + formateaFechaSalida(finSemana);
        
        return text;
    }
    
    return {
        mostrarIdentificarse: mostrarIdentificarse,
        estaInscrito: estaInscrito,
        incribirseEnCurso: incribirseEnCurso
    };
});