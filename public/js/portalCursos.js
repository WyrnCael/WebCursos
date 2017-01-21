/* 
 * GRUPO 111 - Rubén Casado y Juan José Prieto
 */
$(document).ready(function() {
    $("#paginador").find("a").on("click", function() {
        $("#resultado").text($(this).data("num"));
    });
    
    $("#botonBuscar").on("click", function(e) {
        e.preventDefault();
        var str = $("#str").val();
        buscar(str, 0);
    });
});

var paginasResultados = [];
var paginaActual = 1;

function buscar(str, pagina){
    if(pagina === 0) paginasResultados = [];
    
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
                console.log("2");
                alert( "Se ha producido un error: " + textStatus);
            }
       });
}

function manejaResultados(){
    // Mostramos los resultados de la primera pagina    
    $("#tablaResultado").text(paginasResultados[0][0].Titulo);
    
    // Inicializamos el paginador
    $("#paginador").find("ul").remove();
    var paginador = $("#paginador").append("<ul class='pagination pagination-sm'></ul>").find("ul");
    paginasResultados.forEach(function(pagina, index, array) {
        console.log(pagina);
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
}