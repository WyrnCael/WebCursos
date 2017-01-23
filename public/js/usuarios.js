/* 
 * GRUPO 111 - Rubén Casado y Juan José Prieto
 */
"use strict";

define([], function() {
    var cadenaBase64 = null;
    
    
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
                }
            },
            error: function (jqXHR, textStatus, errorThrown ) {
                console.log("¡Acceso denegado!");
            }
                    
        });

    }
    
    return {
        login: login
    }
});