import $$ from "dom7";
import config from '../config';

var fnGuiasHijos = {
    validarNG: (app, num_guia_padre) => {
        if (num_guia_padre != '') {
            let url = config.URL_WS + 'consulta/' + num_guia_padre;
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
                url,
                function (data) {
                    if (data.guia.length > 0) {
                        var num_guia_padre = data.guia[0].num_guia;
                        $$('#numGuiapadre').html(num_guia_padre);
                        $$('#infoguiapadre').val(num_guia_padre);
                        $$('#mostrarQRSR').hide();
                        $$('#mostrarQRJR').show();
                    } else {
                        alert("No existe la Guía");
                    }
                },
                'json'
            );
        } else {
            alert("No exite la guía");
        }
    },
    ValidarNGHJ: (app,idoperador,guiapadre,guiasHjs,lanlog) => {
        var resultado='';
        //alert(idoperador+' '+guiapadre+' '+guiasHjs+' '+lanlog);
        if(idoperador !='' && guiasHjs != '' && lanlog != '' && guiapadre !='') {
            app.request.setup({
                headers: {
                    'apikey': localStorage.getItem('apikey')
                },
                beforeSend: function () {
                    app.preloader.show();
                },
                complete: function () {
                    app.preloader.hide();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 401) {
                        localStorage.clear();
                        app.preloader.hide();
                    } else {
                        // app.dialog.alert('Hubo un error, no hay información detallada en tarjetas', 'Error');
                    }
                }
            });
            app.request.postJSON(
                config.URL_WS + 'api/v2/asignar/qrshijos',
                {
                    guiapadre: guiapadre,
                    folioshijos: guiasHjs,
                    idOperador: idoperador,
                    latlong: lanlog
                },
                function (data) {
                    var result = data.data;
                    if (result != '') {
                        $$('#mostrarQRJR').hide();
                        $$('#mostrarResutl').show();
                    }
                    result.forEach(function (val, index) {
                        resultado += '<li>' + val + '</li>';
                    });
                    $$('#resltadoapi').html(resultado);

                    app.preloader.hide();
                }, function (error) {
                    console.log(error);
                },
                'json'
            );
        }else{
            alert("Faltan Campos");
        }
    },
    ValidarNGHJIDV: (app,idoperador,guiasHjs,lanlog, selectStatus ) =>{
        var resultado='';
        if(idoperador !='' && guiasHjs != '' && lanlog != '' && selectStatus != 0){
            app.request.setup({
                headers: {
                    'apikey': localStorage.getItem('apikey')
                },
                beforeSend: function () {
                    app.preloader.show();
                },
                complete: function () {
                    app.preloader.hide();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 401) {
                        localStorage.clear();
                        app.preloader.hide();
                    } else {
                        // app.dialog.alert('Hubo un error, no hay información detallada en tarjetas', 'Error');
                    }
                }
            });
            app.request.postJSON(
                config.URL_WS + 'api/v2/cambiarstatus/qrshijos',
                {
                    folioshijos:guiasHjs,
                    idOperador:idoperador,
                    latlong:lanlog,
                    status:selectStatus
                },
                function (data) {
                    var result= data.data;
                    if(result !=''){
                        $$('#btnmostrarQR').hide();
                        $$('#mostrarResutl').show();
                    }
                    result.forEach(function (val, index) {
                        resultado += '<li>' + val + '</li>';
                    });
                    $$('#resltadoapi').html(resultado);
                    app.preloader.hide();

                }, function (error) {
                    console.log(error);
                },
                'json'
            );
        }else{
            alert('Campos vacios');
        }
    },
    MostrarNGH:(app, CById, Numguia ) =>{
        app.request.setup({
            headers: {
                'apikey': localStorage.getItem('apikey')
            },
            beforeSend: function () {
                app.preloader.show();
            },
            complete: function () {
                app.preloader.hide();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 401) {
                    localStorage.clear();
                    app.preloader.hide();
                } else {
                    // app.dialog.alert('Hubo un error, no hay información detallada en tarjetas', 'Error');
                }
            }
        });
        app.request.get(
            config.URL_WS + 'api/v2/consultar/qrshijos/' + Numguia,
            function (data) {
                if (data.length > 0) {
                    var folio = '<div class="list accordion-list">\n' +
                        '<ul><li class="accordion-item"><a href="#" class="item-content item-link">\n' +
                        '<div class="item-inner"><div class="item-title">Guías asignadas ('+ data.length +')</div></div></a>\n' +
                        '<div class="accordion-item-content"><div class="block"><p>\n' +
                        '<div class="list accordion-list"><ul>\n';
                    data.forEach(function (val, index) {
                        folio += '<li> NGH: ' +  val.folio + '</li>';
                    });
                    folio+='<p></div>\n' +
                        '</div>\n' +
                        '</li>\n' +
                        '</ul>\n' +
                        '</div>\n'+
                        '</ul></div>';
                    $$('#' + CById).html(folio);
                }
            },
            'json'
        );
    },
};

export default fnGuiasHijos;