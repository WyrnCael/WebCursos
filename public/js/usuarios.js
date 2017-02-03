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
                //console.log(data.DatosCurso);
                mostrarHorariosUsuario(data);
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
    
    function mostrarHorariosUsuario(curso){
        console.log(curso);

         var panelHorarios = $("<h1>Horarios</h1>" +
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
                        
                        "<tr><th>00:00-12:00</th>" +
                        "<td id = 'L0012'></td>" +
                        "<td id = 'M0012'></td>" +
                        "<td id = 'X0012'></td>" +
                        "<td id = 'J0012'></td>" +
                        "<td id = 'V0012'></td>" +
                        "<td id = 'S0012'></td>" +
                        "<td id = 'D0012'></td></th>" +
                        
                        "<tr><th>12:00-12:15</th>" +
                        "<td id = 'L121215'></td>" +
                        "<td id = 'M121215'></td>" +
                        "<td id = 'X121215'></td>" +
                        "<td id = 'J121215'></td>" +
                        "<td id = 'V121215'></td>" +
                        "<td id = 'S121215'></td>" +
                        "<td id = 'D121215'></td></th>" +
                        
                        "<tr><th>12:15-13:00</th>" +
                        "<td id = 'L121513'></td>" +
                        "<td id = 'M121513'></td>" +
                        "<td id = 'X121513'></td>" +
                        "<td id = 'J121513'></td>" +
                        "<td id = 'V121513'></td>" +
                        "<td id = 'S121513'></td>" +
                        "<td id = 'D121513'></td></th>" +
                        
                        "<tr><th>13:00-14:00</th>" +
                        "<td id = 'L1314'></td>" +
                        "<td id = 'M1314'></td>" +
                        "<td id = 'X1314'></td>" +
                        "<td id = 'J1314'></td>" +
                        "<td id = 'V1314'></td>" +
                        "<td id = 'S1314'></td>" +
                        "<td id = 'D1314'></td></th>" +
                        
                        "<tr><th>14:00-18:00</th>" +
                        "<td id = 'L1418'></td>" +
                        "<td id = 'M1418'></td>" +
                        "<td id = 'X1418'></td>" +
                        "<td id = 'J1418'></td>" +
                        "<td id = 'V1418'></td>" +
                        "<td id = 'S1418'></td>" +
                        "<td id = 'D1418'></td></th>" +
                        
                        "<tr><th>18:00-19:00</th>" +
                        "<td id = 'L1819'></td>" +
                        "<td id = 'M1819'></td>" +
                        "<td id = 'X1819'></td>" +
                        "<td id = 'J1819'></td>" +
                        "<td id = 'V1819'></td>" +
                        "<td id = 'S1819'></td>" +
                        "<td id = 'D1819'></td></th>" +
                        
                        "<tr><th>19:00-24:00</th>" +
                        "<td id = 'L1924'></td>" +
                        "<td id = 'M1924'></td>" +
                        "<td id = 'X1924'></td>" +
                        "<td id = 'J1924'></td>" +
                        "<td id = 'V1924'></td>" +
                        "<td id = 'S1924'></td>" +
                        "<td id = 'D1924'></td></th>" +
                        
                        
                "</thead>" +
                "<tbody>               " +
                "</tbody>" +
                "</table>" +
            "</div>");
        $("#panelCentral").append(panelHorarios); 
        $("th").addClass('active');
        
        /*var tag = "#L1924";
        $(tag).append("hjvjhv<br>");
        $(tag).empty();
         $(tag).append("hjvjhv<br>");
         $(tag).append("gggg<br>");*/
        //$("#L1924").append("hjvjhv");
        //$("#V1314").append("hjvjhv");
/*
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

*/      //lunes de la semana qe estamos buscando
        var fecha = new Date(2017,2,3);
        
        var FechaInicio, FechaFin;
        
        console.log("kjksjd");
        $.each(curso, function(index, c){
            FechaInicio = new Date(Number(curso.DatosCurso.FechaInicio.substring(6,10)), Number(curso.DatosCurso.FechaInicio.substring(3,5)) - 1, Number(curso.DatosCurso.FechaInicio.substring(0,2)));
            FechaFin = new Date(Number(curso.DatosCurso.FechaFin.substring(6,10)), Number(curso.DatosCurso.FechaFin.substring(3,5)) - 1, Number(curso.DatosCurso.FechaFin.substring(0,2)));
            if(FechaInicio <= fecha){
                añadeHoraCurso(c.DatosCurso);
            }
        });
        buscarYMostrarHorarios();
    }
    /*
    //el objeto semana sera un date() que coincida con el lunes de esa semana. (se buscaran horarios de semana - semana+6)
    function buscarYMostrarHorarios(semana){ 
        $.ajax({
            method: "POST",
            url: "/usuarios/horarios",
            contentType: "application/json",
            beforeSend: function(req) {
                req.setRequestHeader("Authorization",
                "Basic " + cadenaBase64);
            },
            data: JSON.stringify({Fecha : semana}),
            success: function(data, state, jqXHR) {
                
                $.each(data, function(index, datosHorario){
                    añadeHoraCurso(datosHorario);
                });
                
                
                /*
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
    */
    function añadeHoraCurso(datos){
        var final = false;
        var tag = "#";
        
        if(!final && datos.Horarios.HoraInicio <= "00:00"){
            var n = tag + datos.Dia + "0012" + "<br>";
            $(n).append(datos.Titulo).addClass('success');
            
            if(datos.Horarios.HoraFin <= "12:00")
                final = true;
        }
        if(!final && datos.Horarios.HoraInicio <= "12:00"){
            var n = tag + datos.Dia + "121215" + "<br>";
            $(n).append(datos.Titulo).addClass('success');
            
            if(datos.Horarios.HoraFin <= "12:15")
                final = true;
        }
        if(!final && datos.Horarios.HoraInicio <= "12:15"){
            var n = tag + datos.Dia + "121513" + "<br>";
            $(n).append(datos.Titulo).addClass('success');
            
            if(datos.Horarios.HoraFin <= "13:00")
                final = true;
        }
        if(!final && datos.Horarios.HoraInicio <= "13:00"){
            var n = tag + datos.Dia + "1314" + "<br>";
            $(n).append(datos.Titulo).addClass('success');
            
            if(datos.Horarios.HoraFin <= "14:00")
                final = true;
        }
        if(!final && datos.Horarios.HoraInicio <= "14:00"){
            var n = tag + datos.Dia + "1418" + "<br>";
            $(n).append(datos.Titulo).addClass('success');
            
            if(datos.Horarios.HoraFin <= "18:00")
                final = true;
        }
        if(!final && datos.Horarios.HoraInicio <= "18:00"){
            var n = tag + datos.Dia + "1819" + "<br>";
            $(n).append(datos.Titulo).addClass('success');
            
            if(datos.Horarios.HoraFin <= "19:00")
                final = true;
        }
        if(!final && datos.Horarios.HoraInicio <= "19:00"){
            var n = tag + datos.Dia + "1924" + "<br>";
            $(n).append(datos.Titulo).addClass('success');
            
            if(datos.Horarios.HoraFin <= "24:00")
                final = true;
        }
    }
    
    
    return {
        mostrarIdentificarse: mostrarIdentificarse,
        estaInscrito: estaInscrito,
        incribirseEnCurso: incribirseEnCurso
    };
});