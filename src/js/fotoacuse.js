import fnGuias from "./guias/fn-guias";
import $$ from "dom7";
import config from "./config";

var fotoacuse = {
    index:(app,numGuia)=>{
        var imgnumguia= numGuia.split("-");
        //console.log(imgnumguia);
        var codCliente = imgnumguia[0];
        var braNumbre = imgnumguia[1];
        var status = imgnumguia[2];
        var tipo_aud = imgnumguia[3];
        fotoacuse.mostrarImagen(app,codCliente,braNumbre,status,tipo_aud);
    },
    mostrarImagen:(app,codCliente,braNumbre,status,tipo_aud)=>{
        $$('#descripcion').html('');
        $$('#linkimagen').html('');
        app.request.setup({
            headers: {
                'apikey': localStorage.getItem('apikey')
            },
            beforeSend: function () {
                app.preloader.show();
            },
            complete: function () {
                app.preloader.hide();
            }
        });
        app.request.get(
            config.URL_WS + 'api/v2/permiso/operador/proyecto/' + codCliente+'/'+braNumbre+'/'+status+'/'+tipo_aud,
            function (data) {
                if (data.length > 0) {
                    $$('#descripcion').html('<p>'+ data[0].nombre +'</p>');
                    $$('#linkimagen').html('<img class="infoimg" src="'+ data[0].urlimgen +'">');
                }else{
                   /* $$('#descripcion').html('<p>Foto acuse firmado por el gerente <br> de la sucursal.</p>');
                    $$('#linkimagen').html('<img class="infoimg" src="static/fotos/Foto4_Gerente.jpg">');*/
                }

            },
            'json'
        );
    },
};
export default fotoacuse;