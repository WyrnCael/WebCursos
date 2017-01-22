/* 
 * GRUPO 111 - Rubén Casado y Juan José Prieto
 */

$(document).ready(function() {   
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
});

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
        } else if(index === array.length - 1) {
            var paginaFinal = $("<li><a href='#' data-num='" + (index+1) + "'>" + (index+1) + "</a></li>" + 
                    "<li class='disabled'><span>&raquo;</span></li>");
            paginador.append(paginaFinal);
        } else {
            var nuevaPagina = $("<li><a href='#' data-num='" + (index+1) + "'>" + (index+1) + "</a></li>");
            paginador.append(nuevaPagina);
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
                            "<th>Vacantes</th>");
            $("#tablaResultados").find("thead").append(titulos);

        // Resultados
        var resultados = paginasResultados[numeroPagina - 1];
        resultados.forEach(function(p){
            // Insertamos los datos de cada fila
            var nuevaFila = $("<tr data-id='" + p.Id + "'><td>" + p.Titulo + "</td>" +
                            "<td>" + p.Localidad + "</td>" +
                            "<td>" + formateaFecha(p.FechaInicio) + "</td>" +
                            "<td>" + formateaFecha(p.FechaFin) + "</td>" +
                            "<td>3</td></tr>");
            $("#tablaResultados").find("tBody").append(nuevaFila);
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
            console.log(data);
            $("#infoCurso div.modal-body").find("*").remove();
            var cuerpo = $("<div id='cuerpo'><p>" + data.Descripcion + "</p>" +
                        "<p class='tituloCuerpo'>Lugar de impartición:</p>" +
                        "<p>" + data.Direccion + "</p>" +
                        "<p class='tituloCuerpo'>Ciudad:</p>" + 
                        "<p>" + data.Localidad + "</p>" +
                        "<p class='tituloCuerpo'>Duración:</p>" +
                        "<p>Desde el " + formateaFecha(data.FechaInicio) + " hasta el " + formateaFecha(data.FechaFin) + "</p>" +
                        "<p class='tituloCuerpo'>Horario:</p>" );
            var horarios = "";
            data.Horarios.forEach(function(p, index, array){
                if(index > 0) horarios += ", ";
                horarios += p.Dia + ": " + p.HoraInicio.substring(0,5) + " - " + p.HoraFin.substring(0,5); 
                
            });
            cuerpo.append("<p>" + horarios + "</p>");
            cuerpo.append("<p class='tituloCuerpo'>Numero de plazas:</p>" + 
                        "<p>" + data.NumPlazas + " (X vacantes)</p>");
            cuerpo.append("</div>");
            $("#infoCurso div.modal-body").append(cuerpo);
            
            $("#infoCurso").modal("show");   
        },

        error: function (jqXHR, textStatus, errorThrown ) {
            alert( "Se ha producido un error: " + textStatus);
        }
    });
}

function formateaFecha(mySQLDate){
    var dateParts = mySQLDate.split("-");
    var fecha = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0,2));
    var fechaFormateada = ('0' + Number(fecha.getDate()+1)).slice(-2) + "/" + ('0' + Number(fecha.getMonth()+1)).slice(-2) + "/" + fecha.getFullYear();    
    return fechaFormateada;
}