import $$ from "dom7";
import config from '../config';
import funcionesCamara from "../funcionesCamara";


var fnGuias = {
    traducirStatus: function (status) {
        var statusResult = '';
        switch (status) {
            case '1':
                //Solicitado
                statusResult = 'Solicitado';
                break;
            case '2':
                //Recolectado
                statusResult = 'Recolectado';
                break;
            case '3':
                //En ruta
                statusResult = 'En Ruta';
                break;
            case '4':
                //Entregado
                statusResult = 'Entregado';
                break;
            case '5':
                //Incidencia
                statusResult = 'Incidencia';
                break;
            case '6':
                //Devuelto
                statusResult = 'Devuelto';
                break;
            case '7':
                //Ocurre
                statusResult = 'Ocurre';
                break;
            case '8':
                //En almacén
                statusResult = 'En almacen';
                break;
            case '12':
                //En ruta
                statusResult = 'Conectado';
                break;
            case '15':
                //En Almacén GDL
                statusResult = '>Almacén GDL';
                break;
            case '16':
                //En Almacén BJ
                statusResult = '>Almacén BJX';
                break;
            case '17':
                //En Almacén MTY
                statusResult = '>Almacén MTY';
                break;
        }
        return statusResult;
    },
    mostrarSttus: (app, idguia, branchnumber, clientcode, CById) => {
        //console.log("engtre mostrarSttus");
        var proyectoStatus;
        var status;
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
            config.URL_WS + 'api/v2/permiso/operador/proyecto/' + clientcode + '/' + branchnumber,
            function (data) {
                if (data.length > 0) {
                    proyectoStatus = '<option value="">Seleccionar</option>';
                    data.forEach((val, index) => {
                        proyectoStatus += '<option value="' + val.idstatus_guia + '">' + val.label + '</option>';
                    });
                    $$('#' + CById).html(proyectoStatus);
                } else {
                    app.request.get(
                        config.URL_WS + 'api/v2/status/default/' + idguia  + '/' + clientcode + '/' + branchnumber,
                        function (datos) {
                           if(datos.length > 0){
                               status = '<option value="">Seleccionar</option>';
                               datos.forEach( (valstaus, index) => {
                                   status += '<option value="' + valstaus.id + '">' + valstaus.nombre + '</option>';
                               });
                               $$('#' + CById).html(status);
                           }

                        },
                        'json'
                    );
                }
            },
            'json'
        );
    },
    mostrarCampos: (app, codCliente, braNumbre, status) => {
        var tipoFimg = codCliente + braNumbre + status;
        //console.log("status:" + status);
        switch (status) {
            case '2':
                //Recolectado
                //console.log("Recolectado");
                $$('.ocultar_campos').hide();
                $$('.mostrar_recolectado').show();
                fnGuias.fnmostrarCampos(app, codCliente, braNumbre, status, tipoFimg);
                break;
            case '3':
                //En ruta
                $$('.ocultar_campos').hide();
                $$('.mostrar_enruta').show();
                break;
            case '4':
                //Entregado
                $$('.ocultar_campos').hide();
                $$('.mostrar_entregado').show();
                fnGuias.fnmostrarCampos(app, codCliente, braNumbre, status, tipoFimg);
                break;
            case '5':
                //Incidencia
                $$('.ocultar_campos').hide();
                $$('.mostrar_incidencia').show();
                fnGuias.fnmostrarCampos(app, codCliente, braNumbre, status, tipoFimg);
                break;
            case '6':
                //Devuelto
                $$('.ocultar_campos').hide();
                $$('.mostrar_devuelto').show();
                break;
            case '7':
                //Ocurre
                $$('.ocultar_campos').hide();
                $$('.mostrar_ocurre').show();
                break;
            case '8':
                //En almacén
                $$('.ocultar_campos').hide();
                $$('.mostrar_enalmacen').show();
                break;
            case '12':
                //En conectado
                $$('.ocultar_campos').hide();
                $$('.mostrar_conectado').show();
                break;
            default:
                $$('.ocultar_campos').hide();
        }
    },
    mostrarImagen: (app, codCliente, braNumbre, status, tipo_aud) => {
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
            config.URL_WS + 'api/v2/permiso/operador/proyecto/' + codCliente + '/' + braNumbre + '/' + status + '/' + tipo_aud,
            function (data) {
                if (data.length > 0) {
                    $$('#descripcion').html('<p>' + data[0].nombre + '</p>');
                    $$('#linkimagen').html('<img class="infoimg" src="' + data[0].urlimgen + '">');
                } else {
                    $$('#descripcion').html('<p>Foto acuse firmado por el gerente <br> de la sucursal.</p>');
                    $$('#linkimagen').html('<img class="infoimg" src="static/fotos/Foto4_Gerente.jpg">');
                }

            },
            'json'
        );
    },
    fnmostrarCampos: (app, codCliente, braNumbre, status, tipoFimg) => {
        $$('#mostarfotos').html('');
        var fotos = '';
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
            config.URL_WS + 'api/v2/permiso/operador/proyecto/' + codCliente + '/' + braNumbre + '/' + status,
            function (data) {
                //console.log(data);
                if (data.length > 0) {
                    data.forEach((val, index) => {
                        fotos = '<li>\n' +
                            '                            <div class="item-content item-input">\n' +
                            '                                <div class="item-inner">\n' +
                            '                                    <div class="item-title item-label"></div>\n' +
                            '                                    <div class="item-input-wrap">\n' +
                            '                                        <table class="tablefoto">\n' +
                            '                                            <tr>\n' +
                            '                                                <td>\n' +
                            '                                                    <button class="button open-foto" data-id="' + (index + 1) + '">' + val.nombre + '</button>\n' +
                            '                                                </td>\n' +
                            '                                                <td>\n' +
                            '                                                    <a href="/fotoacuse/' + tipoFimg +'-'+ val.tipo_aud + '">\n' +
                            '                                                        <i class="material-icons">info</i>\n' +
                            '                                                    </a>\n' +
                            '                                                </td>\n' +
                            '                                            </tr>\n' +
                            '                                        </table>\n' +
                            '                                        <canvas id="myCanvas' + (index + 1) + '" data-foto1="0"></canvas>\n' +
                            '                                    </div>\n' +
                            '                                </div>\n' +
                            '                            </div>\n' +
                            '                        </li>';
                        $$('#mostarfotos').append(fotos);
                    });
                    var nav = navigator;
                    funcionesCamara.fnInput(app, '.open-foto', 'data-id');
                    $$('#totalImg').val(data.length);
                } else {
                    var detAcuse = [{nombre: "Foto Acuse"}, {nombre: "Foto Guía"}, {nombre: "Foto Guía Logify"}, {nombre: "Foto Firma"}, {nombre: "Foto Selfi"},];
                   // console.log('default campos');
                    var val = 5;
                    detAcuse.forEach((val, index) => {
                        fotos = '<li>\n' +
                            '                            <div class="item-content item-input">\n' +
                            '                                <div class="item-inner">\n' +
                            '                                    <div class="item-title item-label"></div>\n' +
                            '                                    <div class="item-input-wrap">\n' +
                            '                                        <table class="tablefoto">\n' +
                            '                                            <tr>\n' +
                            '                                                <td>\n' +
                            '                                                    <button class="button open-foto" data-id="' + (index + 1) + '">' + val.nombre + '</button>\n' +
                            '                                                </td>\n' +
                            '                                                <td>\n' +
                            '                                                    <a href="/fotoacuse/' + tipoFimg + val.tipo_aud + '">\n' +
                            '                                                        <!--<i class="material-icons">info</i>-->\n' +
                            '                                                    </a>\n' +
                            '                                                </td>\n' +
                            '                                            </tr>\n' +
                            '                                        </table>\n' +
                            '                                        <canvas id="myCanvas' + (index + 1) + '" data-foto1="0"></canvas>\n' +
                            '                                    </div>\n' +
                            '                                </div>\n' +
                            '                            </div>\n' +
                            '                        </li>';

                        $$('#mostarfotos').append(fotos);
                    });
                    $$('#totalImg').val(detAcuse.length);
                    funcionesCamara.fnInput(app, '.open-foto', 'data-id');
                    //console.log('#totalImg:' + detAcuse.length);
                }
            },
            'json'
        );
    },
    traducirIncidencia: function (incidencia) {
        var incidenciaResult = '';
        switch (incidencia) {
            case '1':
                //Domicilio abandonado
                incidenciaResult = 'Domicilio abandonado';
                break;
            case '2':
                //Domicilio equivocado
                incidenciaResult = 'Domicilio equivocado';
                break;
            case '3':
                //Destinatario rechaza
                incidenciaResult = 'Destinatario rechaza';
                break;
            case '4':
                //Destinatario cambió de domicilio
                incidenciaResult = 'Destinatario cambió de domicilio';
                break;
            case '5':
                //No hay respuesta en el domicilio
                incidenciaResult = 'No hay respuesta en el domicilio';
                break;
            case '6':
                //Domicilio inexistente
                incidenciaResult = 'Domicilio inexistente';
                break;
            case '7':
                //Ocurre
                incidenciaResult = 'Número equivocado';
                break;
            case '8':
                //En almacén
                incidenciaResult = 'Destinatario Falleció';
                break;
            case '9':
                //En ruta
                incidenciaResult = 'Zona de alto riesgo';
                break;
            case '10':
                //En ruta
                incidenciaResult = 'Otro';
                break;
        }
        return incidenciaResult;
    },
    LogComentarios:(app,idguia)=>{
        if (idguia != '') {
            let url = config.URL_WS + 'api/v2/historial/comentarios/' + idguia;
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
                    var total= data.length;
                    if( total > 0 ){
                        var comentarios = '<div class="list accordion-list">\n' +
                            '<ul><li class="accordion-item"><a href="#" class="item-content item-link">\n' +
                            '<div class="item-inner"><div class="item-title">Comentarios ('+ total +')</div></div></a>\n' +
                            '<div class="accordion-item-content"><div class="block"><p>\n' +
                            '<div class="list accordion-list"><ul>\n';
                        data.forEach(function (val, index) {
                            comentarios += '<li><i class="material-icons">comment</i> ' + val.comentarios +'</li>';
                        });
                        comentarios+='</p></div>\n' +
                            '</div>\n' +
                            '</li>\n' +
                            '</ul>\n' +
                            '</div>\n'+
                            '</ul></div>';
                        $$('#log_comentarios').html(comentarios);
                    }
                },
                'json'
            );
        }

    },
    LogIncidencias:(app,client_code,idguia)=>{
        if (idguia != '' && client_code === 'CVD') {
            let url = config.URL_WS + 'api/v2/historial/incidencias/' + idguia;
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
                    var total= data.length;
                    if( total > 0 ){
                        var comentarios = '<div class="list accordion-list">\n' +
                            '<ul><li class="accordion-item"><a href="#" class="item-content">\n' +
                            '<div class="item-inner"><div class="item-title" style="color: #ff1e0e;">Incidencias ('+ total +')</div></div></a>\n' +
                            '<div class="accordion-item-content"><div class="block"><p>\n' +
                            '<div class="list accordion-list"><ul>\n';
                        comentarios+='</p></div>\n' +
                            '</div>\n' +
                            '</li>\n' +
                            '</ul>\n' +
                            '</div>\n'+
                            '</ul></div>';
                        $$('#log_incidencias').html(comentarios);
                    }

                },
                'json'
            );
        }

    },
    leyendaGuia:(app,idguia,clientCode,braNumbre) => {
        var tipoguia='';
        var guia_referencia='';
        let url = config.URL_WS + 'api/v2/leyenda/'+idguia+'/'+clientCode+'/'+ braNumbre;
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
                tipoguia=data.tipoguia;
                guia_referencia=data.guia_referencia;
                if (guia_referencia === undefined || guia_referencia === null || guia_referencia === '') {
                    guia_referencia='';
                }else{
                    guia_referencia='<span><br>&nbsp;&nbsp;&nbsp;referencia: '+ data.guia_referencia +'</span>';
                }
                if( tipoguia != '' ){
                    var leyenda = '<div class="alert alert-info">' + tipoguia + guia_referencia + '</div>';
                    $$('#leyenda').html(leyenda);
                }
            },
            'json'
        );
    }
};
export default fnGuias;