/* 
 * GRUPO 111 - Rubén Casado y Juan José Prieto
 */
"use strict";

define(["usuarios"], function(usuarios) {
    var paginasResultados = [];
    
    function buscar(str, pagina){
        if(pagina === 0) paginasResultados = [];

        // Buscamos todas las paginas
        $.ajax({
                type: "GET",
                url: "/cursos/" + str + "/5/" + (5*pagina),

                success: function (data, textStatus, jqXHR ) {             
                    if(jQuery.parseJSON(data).length !== 0){
                        paginasResultados[pagina] = jQuery.parseJSON(data);
                        buscar(str, pagina+1);
                    }
                    else manejaResultados();
                },

                error: function (jqXHR, textStatus, errorThrown ) {
                    alert( "Se ha producido un error: " + textStatus);
                }
           });
    }

    function manejaResultados(){
        // Mostramos los resultados de la primera pagina    
        mostrarPagina(1);

        // Inicializamos el paginador
        $("#paginador").find("ul").remove();
        var paginador = $("#paginador").append("<ul class='pagination pagination-sm'></ul>").find("ul");
        paginasResultados.forEach(function(pagina, index, array) {
            if(index === 0){
                var paginaInicial = $("<li class='disabled'><span>&laquo;</span></li>" +
                                    "<li class='active'><a href='#' data-num='" + (index+1) + "'>" + (index+1) + "</a></li>");
                paginador.append(paginaInicial);        
            } else {
                var nuevaPagina = $("<li><a href='#' data-num='" + (index+1) + "'>" + (index+1) + "</a></li>");
                paginador.append(nuevaPagina);
            }        
            if(index === array.length - 1){
                var paginaFinal = $("<li class='disabled'><span>&raquo;</span></li>");
                paginador.append(paginaFinal);  
            }
        });    


        // Asignamos los eventos
        $("#paginador a").on("click", function() {
            mostrarPagina(Number($(this).data("num")));
        });
    }

    function mostrarPagina(numeroPagina){
        // Borramos la pagina anterior
        $("#tablaResultados").find("tr").remove();

        if(paginasResultados.length === 0){
            $("#tablaResultados").find("thead").append("<tr><th>No se han encontrado resultados.</th></tr>");
        } else {
            // Titulo tabla
            var titulos = $("<tr><th>Nombre</th>" +
                                "<th>Lugar</th>" +
                                "<th>Inicio</th>" +
                                "<th>Fin</th>" +
                                "<th>Vacantes</th></tr>");
                $("#tablaResultados").find("thead").append(titulos);

            // Resultados
            var resultados = paginasResultados[numeroPagina - 1];
            resultados.forEach(function(p){
                // Insertamos los datos de cada fila
                var nuevaFila = $("<tr data-id='" + p.Id + "' style='cursor: pointer' ><td>" + p.Titulo + "</td>" +
                                "<td>" + p.Localidad + "</td>" +
                                "<td>" + p.FechaInicio + "</td>" +
                                "<td>" + p.FechaFin + "</td>" +
                                "<td id='vacantes'>" + p.Vacantes + "</td></tr>");
                $("#tablaResultados").find("tBody").append(nuevaFila);
                if(p.Vacantes === 1) $("#tablaResultados tr[data-id=" + p.Id + "]").addClass("warning");
                if(p.Vacantes === 0) $("#tablaResultados tr[data-id=" + p.Id + "]").addClass("danger");
            });

            $("#paginador li.active").removeClass("active");        
            $("#paginador").find("a[data-num='" + numeroPagina + "']").parent("li").addClass("active");

            // Asignamos los eventos
            $("#tablaResultados tbody tr").on("click", function() {
                mostrarInfoCurso(Number($(this).data("id")));
            });
        }    
    }

    function mostrarInfoCurso(id){
        $.ajax({
            type: "GET",
            url: "/cursos/" + id,

            success: function (data, textStatus, jqXHR ) {   
                $("#infoCurso .modal-title").text(data.Titulo);
                
                $("#infoCurso div.modal-body").find("*").remove();
                var cuerpo = "<div id='cuerpo'><div id='textoCuerpo'><p>" + data.Descripcion + "</p>" +
                            "<p class='tituloCuerpo'>Lugar de impartición:</p>" +
                            "<p>" + data.Direccion + "</p>" +
                            "<p class='tituloCuerpo'>Ciudad:</p>" + 
                            "<p>" + data.Localidad + "</p>" +
                            "<p class='tituloCuerpo'>Duración:</p>" +
                            "<p>Desde el " + data.FechaInicio + " hasta el " + data.FechaFin + "</p>" +
                            "<p class='tituloCuerpo'>Horario:</p><p>";
                if(data.Horarios !== undefined) 
                    data.Horarios.forEach(function(p, index, array){
                        if(index > 0) cuerpo += ", ";
                        cuerpo += formateaDia(p.Dia) + ": " + p.HoraInicio.substring(0,5) + " - " + p.HoraFin.substring(0,5); 

                    });
                cuerpo += "</p><p class='tituloCuerpo'>Numero de plazas:</p>" + 
                            "<p>" + data.NumPlazas + " (" + data.Vacantes + " vacantes)</p>";
                cuerpo += "</div>";
                cuerpo += "<div id='imagenCurso'></div></div>";
                obtenerImagen(data.Id);
                $("#infoCurso div.modal-body").append(cuerpo); 
                $("#insribirseCurso").remove();   
                $("#insritoCurso").remove();
                $("#insribirSinVacantes").remove();
                
                usuarios.estaInscrito(data.Id, data.Vacantes);
                
                $("#infoCurso").modal("show");   
            },

            error: function (jqXHR, textStatus, errorThrown ) {
                alert( "Se ha producido un error: " + textStatus);
            }
        });
    }

    function obtenerImagen(id){    
        $.ajax({
                type: "GET",
                url: "/cursos/" + id + "/imagen/",

                success: function (data, textStatus, jqXHR ) {   
                    $("#imagenCurso img").remove();
                    // Volvemos a poner la direccion con src y no con los datos devueltos dado
                    // que al no saber el formato (png, jpeg, gif...) no sabemos "encodearlo" en
                    // base64.
                    $("#imagenCurso").append("<img src='/cursos/" + id + "/imagen/' width='128' height='128' />");
                },

                error: function (jqXHR, textStatus, errorThrown ) {
                    $("#imagenCurso img").remove();
                }
           });
    }
    
    function formateaDia(intDia){
        switch(intDia){
            case 1:
                return "Lun";
                break;
            case 2:
                return "Mar";
                break;
            case 3:
                return "Mié";
                break;
            case 4:
                return "Jue";
                break;
            case 5:
                return "Vie";
                break;
            case 6:
                return "Sáb";
                break;
            case 7:
                return "Dom";
                break;
        }
        
        return null;
    }

    return {
        buscar: buscar,
        mostrarInfoCurso: mostrarInfoCurso
    };
});