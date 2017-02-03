/* 
 * GRUPO 111 - Rubén Casado y Juan José Prieto
 */
"use strict";

requirejs.config({
    // Directorio en el que se encuentran los scripts
    baseUrl: "./js",
    paths: {
        jquery: './js/external/jquery-3.1.1',
    }
});

define(["cursos", "usuarios", "jquery"], function(cursos, usuarios, $) {
    $(document).ready(function() {   
        mostrarBuscarCursos();
        
        $("#botonIdentificarse").on("click", function(e) {
            e.preventDefault();        
            usuarios.mostrarIdentificarse();
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
                       "</div>" +
                    "</div>" +
                "</div>" +
            "</div>");
        $("#panelCentral").append(panel);        

        $("#misCursos").removeClass("active");
        $("#buscarCursos").addClass("active");

        $("#botonBuscar").on("click", function(e) {
            e.preventDefault();
            var str = $("#str").val();
            // Validación
            if (str) {      
                $("#inputBusqueda").find(".glyphicon").remove();     
                $("#inputBusqueda").parent("div").removeClass("has-feedback has-error");
                cursos.buscar(str, 0);            
            } else {
                $("#inputBusqueda").append("<span class='glyphicon glyphicon-remove form-control-feedback'></span>");     
                $("#inputBusqueda").parent("div").addClass("has-feedback has-error");
            }       
        });
    }
    
    return {
        mostrarBuscarCursos: mostrarBuscarCursos
    };
});