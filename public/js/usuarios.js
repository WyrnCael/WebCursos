/* 
 * GRUPO 111 - Rubén Casado y Juan José Prieto
 */
"use strict";

define([], function() {
    var cadenaBase64 = null;  
    
    function mostrarIdentificarse(){
        $("#panelCentral").find("*").remove();
        
        var panel = $("<h1>Identificación</h1>" +
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
            login(correo, password);
        });
        
        $("#botonRegistro").on("click", function(e) {
            e.preventDefault();
            mostrarNuevoRegistro();                
        });
    }
    
    function mostrarNuevoRegistro(){
        $("#panelCentral").find("*").remove();
        
        var panel = $("<h1>Nuevo usuario</h1>" +
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
            registrar(usuario);        
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
                    console.log("¡Acceso permitido!");                    
                    
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
                console.log("¡Acceso denegado!");
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
                console.log("¡No registrado!");
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
                    console.log("¡Acceso denegado!");
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
                console.log("¡Incrito!");
                $("#insribirseCurso").remove();
                $(".modal-footer").append("<a href='#' disabled='disabled' class='btn btn-success' id='insritoCurso'>Inscrito con éxito</a>");
            },
            error: function (jqXHR, textStatus, errorThrown ) {
                console.log("¡Error al inscribirse!");
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
            },
            error: function (jqXHR, textStatus, errorThrown ) {
                console.log("¡Acceso denegado!");
            }
                    
        });
    }
    
    return {
        mostrarIdentificarse: mostrarIdentificarse,
        estaInscrito: estaInscrito,
        incribirseEnCurso: incribirseEnCurso
    };
});