/* 
 * GRUPO 111 - Rubén Casado y Juan José Prieto
 */
"use strict";

requirejs.config({
    // Directorio en el que se encuentran los scripts
    baseUrl: "./js",
    paths: {
        jquery: './js/external/jquery-3.1.1'
    }
});

define(["cursos", "usuarios", "jquery"], function(buscar, usuarios, $) {
    $(document).ready(function() {   
        mostrarBuscarCursos();
        
        $("#botonIdentificarse").on("click", function(e) {
            e.preventDefault();        
            mostrarIdentificarse();
        });

         $("#buscarCursos").on("click", function(e) {
            e.preventDefault();        
            mostrarBuscarCursos();
        });
    });

    function mostrarBuscarCursos(){
        $("#panelCentral").find("*").remove();

        var panel = $("<h1>Búsqueda de cursos</h1>" +
            "<form class='form-inline' role='form'>" +
                "<div class='form-group'>" +
                    "<label for='str'>" +
                    "Búsqueda por nombre:&nbsp;&nbsp;</label>" +
                    "<div class='input-group' id='inputBusqueda'>" +
                        "<input class='form-control'" +
                            "id='str'" +
                            "placeholder='Curso a buscar'" +
                            "type='text'>" +
                    "</div></div>" +
                "<div class='form-group'>" +
                    "<button class='btn btn-primary' id='botonBuscar'>" +
                    "<span class='glyphicon glyphicon-search' aria-hidden='true'></span> Buscar</button>               " +
                "</div></form>" +
            "<div id='tablaResultados' class='table-responsive'>" +
                "<table class='table  table-hover'>" +
                "<thead>" +
                "</thead>" +
                "<tbody>               " +
                "</tbody>" +
                "</table>" +
            "</div>" +
            "<div id='paginador' class='text-center'>" +
            "</div>" +
            "<div class='modal fade' id='infoCurso' tabindex='-1' role='dialog' aria-labelledby='cursoModal' aria-hidden='true'>" +
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
                           "<a href='#' class='btn btn-primary'>Inscribirse</a>" +
                       "</div>" +
                    "</div>" +
                "</div>" +
            "</div>");
        $("#panelCentral").append(panel);

        $("#botonBuscar").on("click", function(e) {
            e.preventDefault();
            var str = $("#str").val();
            // Validación
            if (str) {      
                $("#inputBusqueda").find(".glyphicon").remove();     
                $("#inputBusqueda").parent("div").removeClass("has-feedback has-error");
                buscar(str, 0);            
            } else {
                $("#inputBusqueda").append("<span class='glyphicon glyphicon-remove form-control-feedback'></span>");     
                $("#inputBusqueda").parent("div").addClass("has-feedback has-error");
            }       
        });
    }

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
        
        $("#botonLogin").on("click", function(e) {
            e.preventDefault();
            var correo = $("#correo").val();
            var password = $("#password").val();
            usuarios.login(correo, password);
        });
        
        $("#botonRegistro").on("click", function(e) {
            e.preventDefault();
            mostrarNuevoRegistro();                
        });
    }
    
    function mostrarNuevoRegistro(){
        $("#panelCentral").find("*").remove();
        
        var panel = $("<h1>Nuevo usuario</h1>" +
            "<form class='form-horizontal' role='form'>" +
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
                            "<input type='radio' id='sexo' name='optradio'>Hombre" +
                        "</label>" +
                        "<label class='radio-inline'>" +
                            "<input type='radio' id='sexo' name='optradio'>Mujer" +
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
    }
    
    return;
});