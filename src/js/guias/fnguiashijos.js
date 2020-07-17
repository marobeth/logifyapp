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
            alert("Campo Vacío");
        }
    },
    ValidarNGHJ: (app,idoperador,guiapadre,guiasHjs,lanlog) => {
        var resultado='';
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
                    if (result !== '') {
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
    ValidarNGHJIDV: (app,idoperador,guiasHjs,lanlog, selectStatus, sucursal ) =>{
        var resultado='';
        if(idoperador !='' && guiasHjs != '' && lanlog != '' && selectStatus != 0 ){
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
                    status:selectStatus,
                    numsucursal:sucursal
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
            alert('Hay campos vacíos');
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
    btnScanHjs:( app,Numguia )=>{
        var Scan='/asignarpadre/'+Numguia;
        var $html='<div class="list" id="mostrarDivHijos" >\n' +
        '                    <ul>\n' +
        '                        <li id="scanHijos">\n' +
        '                            <a href="'+ Scan +'" class="item-link item-content">\n' +
        '                                <div class="item-media"><i class="icon icon-f7"></i></div>\n' +
        '                                <div class="item-inner">\n' +
        '                                    <div class="item-title">\n' +
        '                                        <div class="item-header"></div>\n' +
        '                                        <i class="icon f7-icons">qrcode</i> | Escanear\n' +
        '                                    </div>\n' +
        '                                    <div class="item-after">Guías Hijos</div>\n' +
        '                                </div>\n' +
        '                            </a>\n' +
        '                        </li>\n' +
        '                    </ul>\n' +
        '                </div>';
        $$('#LinkNGHijos').html($html);
    },
    validarSucursalNGHJ:(app,num_sucursal) =>{
        if (num_sucursal != '') {
            let url = config.URL_WS + 'info-sucursal/' + num_sucursal;
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
                    if( data !== null){
                        var infoSucursal ='<p> No. Sucursal: '+data.id +' <strong> "'+data.nombre +'"</strong></p>';
                        $$('#infoSucursal').html(infoSucursal);
                        $$('#btnValdiarS').hide();
                        $$('#btnmostrarQR').show();
                        $$('#mostrarResutl').hide();
                    }else{
                        app.dialog.alert("La sucursal "+ num_sucursal +" no existe");
                    }
                },
                'json'
            );
        } else {
            alert("Campo Vacío");
        }
    }
};

export default fnGuiasHijos;