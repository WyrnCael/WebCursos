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
                        mostrarCursosUsuario();
                        $("#buscarCursos").removeClass("active");
                        $("#misCursos").addClass("active");
                    });
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
                console.log("¡Registrado!");
            },
            error: function (jqXHR, textStatus, errorThrown ) {
                console.log("¡No registrado!");
            }
                    
        });
    }
    
    function estaConectado(){
        if(cadenaBase64){
            return true;
        } else {
            return false;
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
                if (data.permitido) {
                    console.log("¡Acceso permitido!");                    
                    
                    console.log(data);
                }
            },
            error: function (jqXHR, textStatus, errorThrown ) {
                console.log("¡Acceso denegado!");
            }
                    
        });
    }
    
    return {
        mostrarIdentificarse: mostrarIdentificarse,
        estaConectado: estaConectado,
        incribirseEnCurso: incribirseEnCurso
    };
});