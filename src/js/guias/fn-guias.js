import $$ from "dom7";
import config from '../config';
import funcionesCamara from "../funcionesCamara";


var fnGuias = {
    soloStatus: '',
    traducirStatus: (app,idstatus,CById)=>{
        var mostrarLabel='';
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
            config.URL_WS + 'api/v2/status/' + idstatus,
            function (datos) {
                if(datos.label !=''){
                    mostrarLabel=datos.label;
                    $$('#'+ CById).html(mostrarLabel);
                }
            },
            'json'
        );
    },
    mostrarSttus: (app, idguia, branchnumber, clientcode, CById) => {
        //console.log("engtre mostrarSttus");
        if(fnGuias.soloStatus != '')
        {
            fnGuias.mostrarSoloStatus(app,CById);
        }
        else
        {
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
                config.URL_WS + 'api/v2/status/default/' + idguia + '/' + clientcode + '/' + branchnumber,
                function (datos) {
                    if (datos.length > 0) {
                        status = '<option value="">Seleccionar</option>';
                        datos.forEach((valstaus, index) => {
                            status += '<option value="' + valstaus.id + '">' + valstaus.nombre + '</option>';
                        });
                        $$('#' + CById).html(status);
                    } else {
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
                                        config.URL_WS + 'api/v2/status/default',
                                        function (datos) {
                                            if (datos.length > 0) {
                                                status = '<option value="">Seleccionar</option>';
                                                datos.forEach((valstaus, index) => {
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
                    }
                },
                'json'
            );
        }
    },
    mostrarSoloStatus: (app, CById) => {
        if(fnGuias.soloStatus != '')
        {
            status = '<option value="">Seleccionar</option>';
            status += '<option value="4">Entregado</option>';
            $$('#' + CById).html(status);
        }
    },
    mostrarSttusdefaut: (app,  CById) => {
        //console.log("engtre mostrarSttus");
        if(fnGuias.soloStatus != '')
        {
            fnGuias.mostrarSoloStatus(app,CById);
        }
        else
        {
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
                config.URL_WS + 'api/v2/status/default',
                function (datos) {
                    if (datos.length > 0) {
                        status = '<option value="">Seleccionar</option>';
                        datos.forEach((valstaus, index) => {
                            status += '<option value="' + valstaus.id + '">' + valstaus.nombre + '</option>';
                        });
                        $$('#' + CById).html(status);
                    }
                },
                'json'
            );
        }
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
                 if(fnGuias.soloStatus != '')
                {
                    $$('#persona_recibe').hide();
                }
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
                            '                                                    <a href="/fotoacuse/' + tipoFimg + '-' + val.tipo_aud + '">\n' +
                            '                                                        <i class="material-icons">info</i>\n' +
                            '                                                    </a>\n' +
                            '                                                </td>\n' +
                            '                                            </tr>\n' +
                            '                                        </table>\n' +
                            '                                        <canvas id="myCanvas' + (index + 1) + '" data-foto1="0"  data-requerido="'+ val.required +'"></canvas>\n' +
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
                            '                                        <canvas id="myCanvas' + (index + 1) + '" data-foto1="0"  data-requerido="1"></canvas>\n' +
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
    LogComentarios: (app, idguia) => {
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
                    var total = data.length;
                    if (total > 0) {
                        var comentarios = '<div class="list accordion-list">\n' +
                            '<ul><li class="accordion-item"><a href="#" class="item-content item-link">\n' +
                            '<div class="item-inner"><div class="item-title">Comentarios (' + total + ')</div></div></a>\n' +
                            '<div class="accordion-item-content"><div class="block"><p>\n' +
                            '<div class="list accordion-list"><ul>\n';
                        data.forEach(function (val, index) {
                            comentarios += '<li><i class="material-icons">comment</i> ' + val.comentarios + '</li>';
                        });
                        comentarios += '</p></div>\n' +
                            '</div>\n' +
                            '</li>\n' +
                            '</ul>\n' +
                            '</div>\n' +
                            '</ul></div>';
                        $$('#log_comentarios').html(comentarios);
                    }
                },
                'json'
            );
        }

    },
    LogIncidencias: (app, client_code, idguia) => {
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
                    var total = data.length;
                    if (total > 0) {
                        var comentarios = '<div class="list accordion-list">\n' +
                            '<ul><li class="accordion-item"><a href="#" class="item-content">\n' +
                            '<div class="item-inner"><div class="item-title" style="color: #ff1e0e;">Incidencias (' + total + ')</div></div></a>\n' +
                            '<div class="accordion-item-content"><div class="block"><p>\n' +
                            '<div class="list accordion-list"><ul>\n';
                        comentarios += '</p></div>\n' +
                            '</div>\n' +
                            '</li>\n' +
                            '</ul>\n' +
                            '</div>\n' +
                            '</ul></div>';
                        $$('#log_incidencias').html(comentarios);
                    }

                },
                'json'
            );
        }

    },
    leyendaGuia: (app, idguia, clientCode, braNumbre) => {
        var tipoguia = '';
        var guia_referencia = '';
        var leyenda='';

        let url = config.URL_WS + 'api/v2/leyenda/' + idguia + '/' + clientCode + '/' + braNumbre;
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
                tipoguia = data.tipoguia;
                guia_referencia = data.guia_referencia;
                if (guia_referencia === undefined || guia_referencia === null || guia_referencia === '') {
                    guia_referencia = '';
                } else {
                    guia_referencia = '<span><br>Referencia: ' + data.guia_referencia + '</span>';
                }
                if (tipoguia != '') {
                    if(tipoguia =='Guía de Devolución'){
                        leyenda += '<div class="alert alert-info"> ' + tipoguia + guia_referencia + '</div>';
                    }else{
                        leyenda += '<div class="alert alert-danger"> ' + tipoguia + guia_referencia + '</div>';
                    }
                    $$('#leyenda').html(leyenda);
                }
            },
            'json'
        );
    },
    mostrarListadoOcurre: (app, id_guia) => {
        var proveedor_ocurre = '';
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
            config.URL_WS + 'api/v2/listado/proveedor',
            function (data) {
                proveedor_ocurre += ' <option value="0">Seleccionar</option>';
                data.forEach(function (value, index) {
                    proveedor_ocurre += '<option value="' + value.nomenclatura + '">' + value.nombre + '</option>';
                    $$('#proveedor_ocurre').html(proveedor_ocurre);
                });
            },
            'json'
        );
    },
    mostrarOcurre: (app, numguia) => {
        var ocurre = '';
        var proveedor_ocurre = '';
        var num_guia_ocurre = '';
        var dias = '';
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
            config.URL_WS + 'api/v2/ocurre/proveedor/' + numguia,
            function (datos) {
                proveedor_ocurre = datos[0].ocurre_proveedor;
                num_guia_ocurre = datos[0].num_guia_ocurre;
                dias = datos[0].dias;
                if (proveedor_ocurre != '') {
                    ocurre += '<strong>Proveedor Ocurreo:</strong> ' + proveedor_ocurre + '<br>';
                }
                if (num_guia_ocurre != '') {
                    ocurre += '<strong>No. Guía Ocurre:</strong> ' + num_guia_ocurre + '<br>';
                }
                if (dias != '') {
                    ocurre += '<strong>Días en este STATUS: </strong>' + dias + '<br>';
                }
                $$('#ocurre').html(ocurre);
            },
            'json'
        );
    },
    mostrarinfoGuia: (app, numguia, proyecto) => {
        $$('#status_guia_consulta').html("");
        $$('#espacio_proyecto').html("");
        $$('#espacio_destinatario').html("");
        $$('#cont_paquete').html("");
        $$('#testigoreal1').attr('src', '');
        $$('#testigoreal2').attr('src', '');
        $$('#ocurre').html("");
        var tel_dest = '';
        var info_comp_dest = '';
        var dir2_dest = '';
        app.request.get(
            config.URL_WS + 'guideinfo/' + numguia,
            function (data) {
                var total = data.length;
                if ( total > 0) {
                    if (data[0].tel_dest != '' && !!data[0].tel_dest) {
                        tel_dest = 'Tel.: ' + data[0].tel_dest + '<br>';
                    }
                    if (data[0].info_comp_dest != '' && !!data[0].info_comp_dest) {
                        info_comp_dest = 'Referencias: ' + data[0].info_comp_dest + '<br>';
                    }

                    if (data[0].dir2_dest != '' && !!data[0].dir2_dest) {
                        dir2_dest = 'Dirección alternativa: ' + data[0].dir2_dest + '<br>';
                    }
                    fnGuias.traducirStatus(app,data[0].status,'status_guia_consulta');
                    $$('#espacio_proyecto').html(proyecto);
                    fnGuias.leyendaGuia(app, data[0].id, data[0].client_code, data[0].branch_number);
                    $$('#espacio_destinatario').html(
                        data[0].nombre_dest + ' ' +
                        data[0].paterno_dest + ' ' +
                        data[0].materno_dest + '<br>' +
                        data[0].dir1_dest + '<br>' +
                        data[0].asent_dest + '<br>' +
                        data[0].mun_dest + ', ' +
                        data[0].edo_dest + ', ' +
                        data[0].cp_dest + '<br>' +
                        tel_dest + info_comp_dest + dir2_dest
                    );
                    fnGuias.LogComentarios(app, data[0].id);
                    fnGuias.LogIncidencias(app, data[0].client_code, data[0].id);
                    if (data[0].foto1 !== null) {
                        $$('#testigoreal1').attr('src', config.URL_WS + data[0].foto1);
                    }

                    if (data[0].foto2 !== null) {
                        $$('#testigoreal2').attr('src', config.URL_WS + data[0].foto2);
                    }

                    if (proyecto == 'PPF') {
                        var ouput_parsear_billetes = '';
                        var parsear_billetes = data[0].cont_paquete.split("|");
                        parsear_billetes.forEach(function (v, i) {
                            var parsear_billetes2 = v.split(': ');
                            if (parsear_billetes2[1] > 0) {
                                ouput_parsear_billetes += v + '<br>';
                            } else {
                                if (v.includes("Reportó")) {
                                    ouput_parsear_billetes += v + '<br>';
                                }
                            }
                        });
                        $$('#cont_paquete').html(ouput_parsear_billetes);
                    } else {
                        $$('#cont_paquete').html(data[0].cont_paquete);
                        $$('#cont_paquete').append('<br>');
                        $$('#cont_paquete').append('Lote/id/etc: ' + data[0].ids_tokens);
                    }
                    if (data[0].status == 7) {
                        fnGuias.mostrarOcurre(app, data[0].id);
                    }
                } else {
                    app.dialog.alert('No existe la guía');
                }
            },
            'json'
        );
    },
    ColocarDatosFirma : (app, numguia, proyecto) =>
    {
        $$("#no_pedido").val('');
        $$("#nombre").val("");
        $$("#direccion").val("");
        $$("#estado").val("");
        $$("#municipio").val("");
        $$("#colonia").val("");
        $$("#cp").val("");
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
            config.URL_WS + 'guideinfo/' + numguia,
            function (data) {
                var total = data.length;
                
                if ( total > 0) {
                    //app.dialog.alert("Guia Encontrada");
                    if (data[0].tel_dest != '' && !!data[0].tel_dest) {
                        $$("#telefono").html(data[0].tel_dest);
                    }
                    $$("#no_pedido").val(data[0].num_order_guia);
                    $$("#nombre").val(data[0].nombre_dest+' '+data[0].paterno_dest);
                    $$("#direccion").val(data[0].dir1_dest+' '+data[0].dir2_dest);
                    $$("#estado").val(data[0].edo_dest);
                    $$("#municipio").val(data[0].mun_dest);
                    $$("#colonia").val(data[0].asent_dest);
                    $$("#cp").val(data[0].cp_dest);
                    

                    //$$("#created_at").val(fecha);
                }
                else
                {
                    app.dialog.alert("No existe la guía");
                }
            },
            'json'
        );
    }
};
export default fnGuias;