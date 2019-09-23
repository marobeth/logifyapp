import $$ from 'dom7';
import Framework7 from 'framework7/framework7.esm.bundle.js';
// Import F7 Styles
import 'framework7/css/framework7.bundle.css';
// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.css';
// Import Cordova APIs
import cordovaApp from './cordova-app.js';
// Import Routes
import routes from './routes.js';

var URL_NEW_WS = "https://logisticus.logify.com.mx/";
//var URL_NEW_WS = "https://desarrollo.logisticus.logify.com.mx/";


/**
 *
 * @param status
 * @returns {string}
 */
function traducirStatus(status) {
    switch (status) {
        case '1':
            //Solicitado
            return 'Solicitado';
        case '2':
            //Recolectado
            return 'Recolectado';
        // break;
        case '3':
            //En ruta
            return 'En Ruta';
        //break;
        case '4':
            //Entregado
            return 'Entregado';
        //break;
        case '5':
            //Incidencia
            return 'Incidencia';
        //break;
        case '6':
            //Devuelto
            return 'Devuelto';
        //break;
        case '7':
            //Ocurre
            return 'Ocurre';
        //break;
        case '8':
            //En almacén
            return 'En almacen';
        //break;
    }
}

/**
 *
 * @param num_guia
 * @returns {string}
 */
function detectarProyecto(num_guia) {
    if (num_guia.includes('BCL1234')) {
        return "Tokens";
    }
    if (num_guia.includes('BCL0001')) {
        return "Chequeras";
    }
    if (num_guia.includes('BCL0002')) {
        return "Tarjetas a domicilio";
    }
    if (num_guia.includes('BCL0003')) {
        return "Archivo Muerto";
    }
    if (num_guia.includes('BCL0004')) {
        return "PPF";
    }
    if (num_guia.includes('BCL0005')) {
        return "Marketing";
    }
    if (num_guia.includes('BCL0006')) {
        return "Tarjetas a sucursal";
    }
    if (num_guia.includes('VTA0001')) {
        return "Vidanta General";
    }
    if (num_guia.includes('ADM0001')) {
        return "Adamantium General";
    }
    if (num_guia.includes('NDR0001')) {
        return "Nadro General";
    }
    if (num_guia.includes('UP0001')) {
        return "UP General";
    }
    if (num_guia.includes('PML0001')) {
        return "Publimetro General";
    }
    if (num_guia.includes('RCH0001')) {
        return "Rich General";
    }
    if (num_guia.includes('DIA0001')) {
        return "Diageo General";
    }
}

/**
 *
 * @param valor
 * @returns {string}
 */
function incidenciaGuia(valor) {
    var incidencia;

    if (valor == 1) {
        incidencia = 'Domicilio abandonado';
    } else if (valor == 2) {
        incidencia = 'Domicilio equivocado';
    } else if (valor == 3) {
        incidencia = 'Destinatario rechaza';
    } else if (valor == 4) {
        incidencia = 'Destinatario cambió de domicilio';
    } else if (valor == 5) {
        incidencia = 'No hay respuesta en el domicilio';
    } else if (valor == 6) {
        incidencia = 'Domicilio inexistente';
    } else if (valor == 7) {
        incidencia = 'Número equivocado';
    } else if (valor == 8) {
        incidencia = 'Destinatario Falleció';
    } else if (valor == 9) {
        incidencia = 'Zona de alto riesgo';
    } else if (valor == 10) {
        incidencia = 'Otro';
    } else {
        incidencia = '';
    }
    return incidencia;
}

/**
 * Cargar desde Camara
 * @param idCanvas
 */
function openCamera(idCanvas) {
    var pictureSource = navigator.camera.PictureSourceType;
    var destinationType = navigator.camera.DestinationType;
    var srcType = pictureSource.CAMERA;
    navigator.device.capture.captureImage(function onSuccess(mediaFiles) {
        $$('#' + idCanvas).show();
        /*var canvas = $$('#' + idCanvas)[0];*/
        var canva = document.getElementById(idCanvas);
        var con = canva.getContext('2d');
        var img = new Image();
        img.onload = function () {
            canva.width = img.width / 6;
            canva.height = img.height / 6;
            con.drawImage(img, 0, 0, img.width, img.height, 0, 0, canva.width, canva.height);
        };
        img.src = mediaFiles[0].fullPath;
        $$('#' + idCanvas).data("foto1", 1);
        navigator.camera.cleanup();
    }, function cameraError(error) {
        console.debug("No se puede obtener una foto: " + error, "app");

    }, {
        limit: 1,
        quality: 50,
        targetWidth: 800,
        targetHeight: 1200,
        destinationType: destinationType.DATA_URL,
        encodingType: navigator.camera.EncodingType.PNG,
        sourceType: srcType
    });
}

/**
 * Cargar desde galeria
 * @param idCanvas
 */
function openFilePicker(idCanvas) {
    var pictureSource = navigator.camera.PictureSourceType;
    var destinationType = navigator.camera.DestinationType;
    var srcType = pictureSource.SAVEDPHOTOALBUM;

    navigator.camera.getPicture(function cameraSuccess(imageURI) {
        $$('#' + idCanvas).show();
        /*var canvas = $$('#' + idCanvas);*/
        var canvass = document.getElementById(idCanvas);
        var context = canvass.getContext('2d');
        var img = new Image();
        img.onload = function () {
            canvass.width = img.width / 2;
            canvass.height = img.height / 2;
            context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvass.width, canvass.height);
        };
        img.src = imageURI;
        $$('#' + idCanvas).data("foto1", 1);
    }, function cameraError(error) {
        console.debug("No se puede obtener una foto: " + error, "app");

    }, {
        quality: 50,
        targetWidth: 800,
        targetHeight: 1200,
        destinationType: destinationType.FILE_URI,
        sourceType: srcType
    });
}

/**
 * Apikey
 * @param correo
 * @param pass
 */
function ValidateApikey(correo, pass) {
    //console.log('entre');
    app.request.setup({
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    app.request.postJSON(
        URL_NEW_WS + 'api/login',
        {
            'email': correo,
            'pass': pass
        },
        function (data) {
            if (data.activo == 1) {
                app.preloader.hide();
                localStorage.setItem('auth', true);
                localStorage.setItem('apikey', data.apikey);
                localStorage.setItem('token', data.token);
                localStorage.setItem('userid', data.user_id);
                localStorage.setItem('avatar', data.avatar);
                localStorage.setItem('nombre', data.nombre);
                localStorage.setItem('paterno', data.paterno);
                localStorage.setItem('email', data.email);
                app.views.main.router.navigate('/inicio/', {reloadCurrent: false});
            } else {
                app.dialog.alert('Error: Permiso Denegado');
            }
        }, function (data) {
            app.preloader.hide();
            app.dialog.alert('Error: Datos incorrectos');
        }
    );
}

/**
 * DateActual
 * @param iddate
 */
function DateActual(iddate) {
    var fecha = new Date();
    var mes = fecha.getMonth() + 1;
    var dia = fecha.getDate();
    var ano = fecha.getFullYear();
    if (dia < 10) {
        dia = '0' + dia;
    }
    if (mes < 10) {
        mes = '0' + mes;
    }
    document.getElementById(iddate).value = ano + "-" + mes + "-" + dia;
}


/**
 * DateGasto
 * @param DateGasto
 */
function DateGasto(CById, DateGasto) {
    document.getElementById(CById).value = DateGasto;
}

/**
 *
 * @param valor
 * @constructor
 */
function RsltsGastos(valor) {
    var Eselected;
    app.request.setup({
        headers: {
            'Authorization': "bearer " + localStorage.getItem('token')
        }, beforeSend: function () {
            app.preloader.show();
        },
        complete: function () {
            app.preloader.hide();
        }
    });

    app.request.get(
        URL_NEW_WS + 'api/v2/gastos',
        function (data) {
            var gatosConceptos = '';
            gatosConceptos += '<option value="">Seleccionar</option>';
            data.forEach(function (gasto, index) {
                if (gasto.id == valor && gasto.id != '') {
                    Eselected = 'selected';
                } else {
                    Eselected = '';
                }
                gatosConceptos += '<option value="' + gasto.id + '"' + Eselected + '>' + gasto.concepto + '</option>';
            });
            $$('#ConceptoGasto').html(gatosConceptos);
        },
        function (error) {
            console.log(error);
        },
        'json'
    );
}

/**
 *
 * @param CById
 * @param valor
 * @constructor
 */
function NmPrvdr(CById, valor) {
    app.request.setup({
        headers: {
            'Authorization': "bearer " + localStorage.getItem('token')
        },
        beforeSend: function () {
            app.preloader.show();
        },
        complete: function () {
            app.preloader.hide();
        }
    });

    app.request.get(
        URL_NEW_WS + 'api/v2/proveedor-operador-nombre/' + valor,
        function (data) {
            data.forEach(function (val, index) {
                console.log(val);
                document.getElementById(CById).value = val.nombre;
                $$('#' + CById).data('idPrvdr', val.id);
            });
        },
        function (error) {
            console.log(error);
        },
        'json'
    );
}

/**
 *
 * @param valor
 * @constructor
 */
function RsltsPrvdr(valor) {
    var autocompleteProveedor = app.autocomplete.create({
        inputEl: '#OprProve',
        openIn: 'dropdown',
        preloader: true,
        valueProperty: 'nombre',
        textProperty: 'nombre',
        limit: 20,
        typeahead: true,
        dropdownPlaceholderText: 'Buscar Proveedores',
        source: function (query, render) {
            var autocomplete = this;
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            autocomplete.preloaderShow();
            app.request.setup({
                headers: {
                    'Authorization': "bearer " + localStorage.getItem('token')
                },
                beforeSend: function () {
                    app.preloader.show();
                },
                complete: function () {
                    app.preloader.hide();
                }
            });

            app.request({
                url: URL_NEW_WS + 'api/v2/buscar/proveedor-operador/' + query,
                method: 'GET',
                dataType: 'json',
                success: function (data) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].nombre === query) {
                            //console.log(data[i].id + '**' + data[i].nombre);
                            $$('#OprProve').data('idPrvdr', data[i].id);
                        }
                        if (data[i].nombre.toLowerCase().indexOf(query.toLowerCase()) === 0) results.push(data[i]);
                    }
                    autocomplete.preloaderHide();
                    render(results);
                }
            });
        }
    });
}

/**
 * @param CById
 * @param monto
 * @constructor
 */
function RsltsMonto(CById, monto) {
    document.getElementById(CById).value = monto;
}

/**
 *
 * @param CById
 * @param num
 * @constructor
 */
function RsltsNum(CById, num) {
    document.getElementById(CById).value = num;
}

/**
 *
 * @param CById
 * @param observaciones
 * @constructor
 */
function RsltsObservaciones(CById, observaciones) {
    document.getElementById(CById).value = observaciones;
}

/**
 *
 * @param CById
 * @param concepto
 * @param coment
 * @param kminicial
 * @param kmfinal
 * @constructor
 */
function RsltsConcepto(CById, concepto, coment, kminicial, kmfinal) {
    if (concepto == 12) {
        $$("#Gcomentario").show();
        document.getElementById('comentario').value = coment;
    }
    if (concepto == 3) {
        $$("#kmi").show();
        $$("#kmf").show();
        document.getElementById('kminicial').value = kminicial;
        document.getElementById('kmfinal').value = kmfinal;
    }
}

/**
 *
 * @param CById
 * @param valor
 * @constructor
 */
function RsltsTpComprobante(CById, valor) {
    var TpoCmprbnt;
    var Eselected;
    var lista = ['Seleccionar', 'Nota', 'Factura', 'Recibo', 'Ticket'];
    lista.forEach(function (element, index) {
        if (index == valor) {
            Eselected = 'selected';
        } else {
            Eselected = '';
        }
        TpoCmprbnt += '<option value="' + index + '"' + Eselected + '>' + element + '</option>';
    });
    $$('#TpoCmprbnt').html(TpoCmprbnt);
}

/**
 *
 * @param CById
 * @param valor
 * @constructor
 */
function RsltsFotoComprobante(CById, valor) {
    if (valor == undefined || valor == null || valor == '') {
        $$('#' + CById).data("status", 0);
        $$('#' + CById).html('');
    } else {
        $$('#' + CById).data("status", 1);
        $$('#' + CById).html('<img src="' + valor + '"/>');
    }
}

/**
 *
 * @param CById
 * @param valor
 * @constructor
 */
function RsltsPDFComprobante(CById, valor) {
    if (valor == undefined || valor == null || valor == '') {
        $$('#pdfColocar').html('');
        $$('#pdfhrf').hide();
    } else {
        $$('#' + CById).data("status", 1);
        $$('#pdfColocar').data("file", valor);
        var splits = valor.split(['/']);
        splits = splits.pop();
        $$('#pdfColocar').html(splits);
    }
}

/**
 *
 * @param CById
 * @param valor
 * @constructor
 */
function RsltsXMLComprobante(CById, valor) {
    if (valor === undefined || valor === null || valor === '') {
        $$('#xmlColocar').html('');
        $$('#xmlhrf').hide();
    } else {
        $$('#' + CById).data("status", 1);
        $$('#xmlColocar').data("file", valor);
        var splits = valor.split(['/']);
        splits = splits.pop();
        $$('#xmlColocar').html(splits);
    }
}

/**
 *
 * @param CById
 * @param CById2
 * @param type
 */
function convertToBase64(CById, CById2, type) {
    var selectedFile = document.getElementById(CById).files;
    var path = selectedFile[0].name;
    var path_splitted = path.split('.');

    if (path_splitted[1] == type) {
        if (selectedFile.length > 0) {
            var fileToLoad = selectedFile[0];
            var fileReader = new FileReader();
            var base64;
            fileReader.onload = function (fileLoadedEvent) {
                base64 = fileLoadedEvent.target.result;
                $$('#' + CById2).data("file", base64);
                $$('#' + CById2).data("status", 1);
            };
            fileReader.readAsDataURL(fileToLoad);
        }
    } else {
        app.dialog.alert("El formato del archivo no corresponde " + type);
    }
}

/**
 *
 * @param valor
 */
function validateMonto(valor) {
    var RE = /^\d*(\.\d{1})?\d{0,1}$/;
    if (RE.test(valor)) {
    } else {
        app.dialog.alert("El formato del monto no corresponde Ej. 120.00 ó 23.65");
    }
}


var app = new Framework7({
    root: '#app', // App root element
    id: 'com.graphicsandcode.logify', // App bundle ID
    name: 'Logify', // App name
    theme: 'auto', // Automatic theme detection
    // App root data
    data: function () {
        return {
            user: {
                firstName: 'John',
                lastName: 'Doe',
            },

        };
    },
    // App root methods
    methods: {
        helloWorld: function () {
            app.dialog.alert('Hello World!');
        },
    },
    // App routes
    routes: routes,
    // Enable panel left visibility breakpoint
    panel: {
        leftBreakpoint: 960,
    },


    // Input settings
    input: {
        scrollIntoViewOnFocus: Framework7.device.cordova && !Framework7.device.electron,
        scrollIntoViewCentered: Framework7.device.cordova && !Framework7.device.electron,
    },
    // Cordova Statusbar settings
    statusbar: {
        overlay: Framework7.device.cordova && Framework7.device.ios || 'auto',
        iosOverlaysWebView: true,
        androidOverlaysWebView: false,
    },
    on: {
        init: function () {
            var f7 = this;
            if (f7.device.cordova) {
                // Init cordova APIs (see cordova-app.js)
                cordovaApp.init(f7);
            }
        },
    },
});


$$('#btn_iniciar_sesion').on('click', function () {
    //app.preloader.show();
    var username = $$('#input_username').val();
    var password = $$('#input_password').val();

    ValidateApikey(username, password);
});

$$(document).on('page:init', '.page[data-name="inicio"]', function (e) {
    $$('#nombre_usuario').html(localStorage.getItem('nombre') + ' ' + localStorage.getItem('paterno'));
});

$$(document).on('page:init', '.page[data-name="home"]', function (e) {
    $$('#btn_iniciar_sesion').on('click', function () {
        //app.preloader.show();
        var username = $$('#input_username').val();
        var password = $$('#input_password').val();

        ValidateApikey(username, password);
    });

    $$('#btn_olvide').on('click', function () {
        cordova.InAppBrowser.open('https://logisticus.logify.com.mx/restablecer-contrasena', '_blank', 'location=yes');
    });
});

$$(document).on('page:afterin', '.page[data-name="home"]', function (e) {
    if (localStorage.getItem('auth') == 'true') {
        app.views.main.router.navigate('/inicio/', {reloadCurrent: false});
    }
});

$$(document).on('page:init', '.page[data-name="logout"]', function (e) {
    localStorage.clear();
    app.preloader.hide();
    window.location.reload();
});

$$(document).on('page:reinit', '.page[data-name="checkin"]', function (e) {
    $$('#btn_buscar_sucursal').click();
});

$$(document).on('page:init', '.page[data-name="checkin"]', function (e) {
    $$('#btn_buscar_sucursal').on('click', function () {
        if ($$('#input_num_sucursal_checkin').val() == "") {
            app.dialog.alert('Escriba el número de sucursal');
        } else {
            app.request.setup({
                headers: {
                    'Authorization': "bearer " + localStorage.getItem('token')
                },
                beforeSend: function () {
                    app.preloader.show();
                },
                complete: function () {
                    app.preloader.hide();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                    if (jqXHR.status === 404) {
                        localStorage.clear();
                        app.preloader.hide();
                        window.location.reload();
                    }
                }
            });
            app.request.get(
                URL_NEW_WS + 'api/v2/consulta_material_sucursal/' + $$('#input_num_sucursal_checkin').val(),
                function (data) {
                    var data_tienda = data[0][0];
                    var data_billetes = data[1];
                    var data_am = data[2];
                    var data_ts = data[3];
                    var data_mkt = data[4];

                    var output_billetes = '';
                    data_billetes.forEach(function (v, i) {
                        output_billetes += '<li><a href="/cambiarstatus/' + v.num_guia + '">' + v.num_guia + '</a></li>';
                    });
                    $$('#lista_billetes').html(output_billetes);

                    var output_am = '';
                    data_am.forEach(function (v, i) {
                        output_am += '<li><a href="/cambiarstatus/' + v.num_guia + '">' + v.num_guia + '</a></li>';
                    });
                    $$('#lista_am').html(output_am);

                    var output_ts = '';
                    data_ts.forEach(function (v, i) {
                        output_ts += '<li><a href="/cambiarstatus/' + v.num_guia + '">' + v.num_guia + '</a></li>';
                    });
                    $$('#lista_ts').html(output_ts);

                    var output_mkt = '';
                    data_mkt.forEach(function (v, i) {
                        output_mkt += '<li><a href="/cambiarstatus/' + v.num_guia + '">' + v.num_guia + '</a></li>';
                    });
                    $$('#lista_mkt').html(output_mkt);

                    if (data_tienda.nombre != undefined) {
                        $$('#nombre_tienda').html(data_tienda.nombre);
                    }

                    if (data_tienda.nombre != undefined && data_tienda.municipio != undefined) {
                        $$('#edo_mun_tienda').html(data_tienda.estado + ' ' + data_tienda.municipio);
                    }

                    if (data_tienda.colonia != undefined) {
                        $$('#direccion_tienda').html(data_tienda.calle + ' ' + data_tienda.no_ext + ' ' + data_tienda.colonia);
                    } else {
                        $$('#direccion_tienda').html(data_tienda.calle + ' ' + data_tienda.no_ext);

                    }
                    app.preloader.hide();
                },
                function (error) {
                    app.dialog.alert('Hubo un error, inténtelo de nuevo');
                    app.preloader.hide();
                },
                'json'
            );
        }
    });

});

//Cambiar de estatus

$$(document).on('page:init', '.page[data-name="cambiarstatus"]', function (e) {
    var num_guias = app.view.main.router.currentRoute.params.numGuia;
    //alert(num_guias);
    num_guias = num_guias.split("|");
    if (num_guias.length == 1) {
        $$('#num_gias').val(num_guias);
        app.request.setup({
            headers: {
                'Authorization': "bearer " + localStorage.getItem('token')
            },
            beforeSend: function () {
                app.preloader.show();
            },
            complete: function () {
                app.preloader.hide();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 404) {
                    localStorage.clear();
                    app.preloader.hide();
                    window.location.reload();
                }
            }
        });

        app.request.get(
            URL_NEW_WS + 'api/v2/consulta/' + num_guias[0],
            function (data) {
                //console.log(data['guia'][0].num_guia);
                $$('#num_guia').html(data['guia'][0].num_guia);
                if (data['guia'][0].proyecto == '0004') {
                    var ouput_parsear_billetes = '';
                    var parsear_billetes = data['guia'][0].contenido_paquete.split("|");
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
                }
                if (data['guia'][0].proyecto == '0003' || data['guia'][0].proyecto == '0006') {
                    $$('#cont_paquete').html(data['guia'][0].contenido_paquete);
                    $$('#cont_paquete').append('<br>');
                    //$$('#cont_paquete').append(data['guia'][0].ids_tokens);
                }
                app.preloader.hide();
            },
            'json'
        );
    } else {
        var new_num_guias = '';
        num_guias.forEach(function (v, i) {
            $$('#lista_multiples_guias').append('<li>' + v + '</li>');
            new_num_guias += v + '|';
        });
        var new_num_guias = new_num_guias.substr(0, new_num_guias.length - 1);
        $$('#num_gias').val(new_num_guias);
    }
    // Vertical Buttons
    $$('.open-foto-1').on('click', function () {
        app.dialog.create({
            title: 'Foto 1',
            text: 'Elegir opción:',
            buttons: [
                {
                    text: 'Camara',
                    cssClass: 'id_camara'
                },
                {
                    text: 'Galeria',
                    cssClass: 'id_galeria'
                },
                {
                    text: 'Cancelar',
                    cssClass: 'id_cancelar'
                },
            ],
            verticalButtons: true,
        }).open();
        $$('.id_camara').on('click', function (e) {
            var permissions = cordova.plugins.permissions;
            permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, success, error);

            function error() {
                app.dialog.alert('Necesitas permiso de: WRITE_EXTERNAL_STORAGE ');
            }

            function success(status) {
                if (!status.hasPermission) {
                    error();
                } else {
                    openCamera('myCanvas');
                }
            }
        });

        $$('.id_cancelar').on('click', function (e) {
            app.dialog.close();
        });

        $$('.id_galeria').on('click', function (e) {
            var permissions = cordova.plugins.permissions;
            permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, success, error);

            function error() {
                app.dialog.alert('Necesitas permiso de: WRITE_EXTERNAL_STORAGE ');
            }

            function success(status) {
                if (!status.hasPermission) {
                    error();
                } else {
                    openFilePicker('myCanvas');
                }
            }
        });
    });

    $$('.open-foto-2').on('click', function () {
        app.dialog.create({
            title: 'Foto 2',
            text: 'Elegir opción:',
            buttons: [
                {
                    text: 'Camara',
                    cssClass: 'id_camara_2'
                },
                {
                    text: 'Galeria',
                    cssClass: 'id_galeria_2'
                },
                {
                    text: 'Cancelar',
                    cssClass: 'id_cancelar_2'
                },
            ],
            verticalButtons: true,
        }).open();
        $$('.id_camara_2').on('click', function (e) {
            var permissions = cordova.plugins.permissions;
            permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, success, error);

            function error() {
                app.dialog.alert('Necesitas permiso de: WRITE_EXTERNAL_STORAGE ');
            }

            function success(status) {
                if (!status.hasPermission) {
                    error();
                } else {
                    openCamera('myCanvas2');
                }
            }
        });

        $$('.id_cancelar_2').on('click', function (e) {
            app.dialog.close();
        });

        $$('.id_galeria_2').on('click', function (e) {
            var permissions = cordova.plugins.permissions;
            permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, success, error);

            function error() {
                app.dialog.alert('Necesitas permiso de: WRITE_EXTERNAL_STORAGE ');
            }

            function success(status) {
                if (!status.hasPermission) {
                    error();
                } else {
                    openFilePicker('myCanvas2');
                }
            }
        });
    });

    $$('#status').on('change', function (e) {
        var status = $$(this).val();
        switch (status) {
            case '2':
                //Recolectado
                $$('.ocultar_campos').hide();
                $$('.mostrar_recolectado').show();
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
                break;
            case '5':
                //Incidencia
                $$('.ocultar_campos').hide();
                $$('.mostrar_incidencia').show();
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
        }
    });

    $$('#btn_cambiar_status').on('click', function (e) {
        var idoperador = localStorage.getItem('userid');
        var latitud = $$('#latitud').val();
        var longitud = $$('#longitud').val();
        var status = $$('#status').val();
        var validado = false;
        switch (status) {
            case 'Seleccione':
                app.dialog.alert('Seleccione un status');
                break;
            case '2':
                //Recolectado
                var statusFoto = $$('#myCanvas').data("foto1");
                var statusFoto2 = $$('#myCanvas2').data("foto1");
                var persona_recibe = $$('#persona_recibe').val();

                if (statusFoto != 0) {
                    var canvas1 = $$('#myCanvas')[0];
                    var foto1 = canvas1.toDataURL();
                } else {
                    var foto1 = '';
                }
                if (statusFoto2 != 0) {
                    var canvas2 = $$('#myCanvas2')[0];
                    var foto2 = canvas2.toDataURL();
                } else {
                    var foto2 = '';
                }

                if (foto1 == "" || foto2 == "" || persona_recibe == "") {
                    app.dialog.alert('La foto 1, la foto 2 y la persona que recibe / entrega son obligatorios');
                } else {
                    validado = true;
                }
                break;
            case '3':
                validado = true
                break;
            case '4':
                //Entregado
                var statusFoto = $$('#myCanvas').data("foto1");
                var statusFoto2 = $$('#myCanvas2').data("foto1");
                var persona_recibe = $$('#persona_recibe').val();

                if (statusFoto != 0) {
                    var canvas1 = $$('#myCanvas')[0];
                    var foto1 = canvas1.toDataURL();
                } else {
                    var foto1 = '';
                }
                if (statusFoto2 != 0) {
                    var canvas2 = $$('#myCanvas2')[0];
                    var foto2 = canvas2.toDataURL();
                } else {
                    var foto2 = '';
                }

                if (foto1 == "" || foto2 == "" || persona_recibe == "") {
                    app.dialog.alert('La foto 1, la foto 2 y la persona que recibe / entrega son obligatorios');
                } else {
                    validado = true;
                }
                break;
            case '5':
                //Incidencia
                var statusFoto = $$('#myCanvas').data("foto1");
                var statusFoto2 = $$('#myCanvas2').data("foto1");
                var incidencia = $$('#incidencia').val();
                incidencia = incidenciaGuia(incidencia);

                if (statusFoto != 0) {
                    var canvas1 = $$('#myCanvas')[0];
                    var foto1 = canvas1.toDataURL();
                } else {
                    foto1 = '';
                }
                if (statusFoto2 != 0) {
                    var canvas2 = $$('#myCanvas2')[0];
                    var foto2 = canvas2.toDataURL();
                } else {
                    var foto2 = '';
                }

                if (foto1 == "" || foto2 == "" || incidencia == "") {
                    app.dialog.alert('La foto 1, la foto 2 y la incidencia son obligatorios');
                } else {
                    validado = true;
                }
                break;
            case '6':
                //Devuelto
                validado = true;
                break;
            case '7':
                //Ocurre
                validado = true;
                break;
            case '8':
                //En almacén
                validado = true;
                break;
        }
        if (validado == true) {
            var canvas1 = $$('#myCanvas')[0];
            var foto1 = canvas1.toDataURL();
            var canvas2 = $$('#myCanvas2')[0];
            var foto2 = canvas2.toDataURL();
            var persona_recibe = $$('#persona_recibe').val();
            var incidencia = $$('#incidencia').val();
            incidencia = incidenciaGuia(incidencia);
            var comentarios = $$('#comentarios').val();
            if (incidencia != '' && comentarios == '') {
                comentarios = incidencia;
            } else if (incidencia != '' && comentarios != '') {
                comentarios = incidencia + ' ' + comentarios;
            }
            app.request.setup({
                headers: {
                    'Authorization': "bearer " + localStorage.getItem('token')
                },
                beforeSend: function () {
                    app.preloader.show();
                },
                complete: function () {
                    app.preloader.hide();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 404) {
                        localStorage.clear();
                        app.preloader.hide();
                        window.location.reload();
                    }
                }
            });
            app.request.postJSON(
                URL_NEW_WS + 'api/v2/changestatus/' + $$('#num_gias').val(),
                {
                    status: status,
                    //latlong: latitud + ',' + longitud,
                    foto1: foto1,
                    foto2: foto2,
                    persona_recibe: persona_recibe,
                    comentarios: comentarios,
                    idoperador: idoperador
                },
                function (data) {
                    app.preloader.hide();
                    app.dialog.alert("Datos guardados correctamente", function () {
                        $$('#btn_buscar_sucursal').click();
                    });
                    app.views.main.router.back();
                }, function (error) {
                    app.preloader.hide();
                },
                'json'
            );
        }
    });
});

$$(document).on('page:init', '.page[data-name="escanear"]', function (e) {
    $$('#btn_escanear').on('click', function () {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                if (!result.cancelled) {
                    var num_guia = result.text;
                    if (num_guia.length != 18) {
                        app.dialog.alert("Guía no válida: Las guías logify tienen 18 caracteres");
                    } else {
                        //Váido
                        //Revisar si ya está agregada esa guía:
                        var guias_actuales = $$('#hidden_guias_scan').val();
                        if (guias_actuales.includes(num_guia)) {
                            app.dialog.alert("Ya habías agregado esta guía");
                        } else {
                            var cantidad_guias = parseInt($$('#total_guias_escaneadas').html());
                            cantidad_guias++;
                            $$('#total_guias_escaneadas').html(cantidad_guias);
                            $$('#total_guias_escaneadas').html();
                            $$('#lista_guias_scan').append('<li>' + num_guia + ' - ' + detectarProyecto(num_guia) + '</li>');
                            $$('#hidden_guias_scan').val(num_guia + '|' + $$('#hidden_guias_scan').val());
                            var guias = $$('#hidden_guias_scan').val().substr(0, $$('#hidden_guias_scan').val().length - 1);
                            $$('#btn_ir_cambiar_status').attr('href', '/cambiarstatus/' + guias);
                        }
                        $$('#btn_ir_cambiar_status').show();
                    }
                } else {
                    app.dialog.alert('El scan fue cancelado');
                }
            }, function (error) {
                app.dialog.alert("El scan falló: " + error);
            },
            {
                showTorchButton: true, // iOS and Android
                torchOn: false, // Android, launch with the torch switched on (if available)
                saveHistory: true, // Android, save scan history (default false)
                prompt: "Ponga el código QR dentro del área de escaneo" // Android
            }
        );
    });
});

$$(document).on('page:init', '.page[data-name="consultar"]', function (e) {
    $$('#btn_escanear_consulta').on('click', function () {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                if (!result.cancelled) {
                    var num_guia = result.text;
                    $$('#num_guia_consulta').html(num_guia);
                    app.request.setup({
                        headers: {
                            'Authorization': "bearer " + localStorage.getItem('token')
                        },
                        beforeSend: function () {
                            app.preloader.show();
                        },
                        complete: function () {
                            app.preloader.hide();
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            if (jqXHR.status === 404) {
                                localStorage.clear();
                                app.preloader.hide();
                                window.location.reload();
                            }
                        }
                    });
                    app.request.get(
                        URL_NEW_WS + 'api/v2/guideinfo/' + num_guia,
                        function (data) {
                            $$('#status_guia_consulta').html(traducirStatus(data[0].status));
                            $$('#espacio_proyecto').html(detectarProyecto(num_guia));
                            $$('#espacio_destinatario').html(data[0].nombre_dest + ' ' + data[0].estado_dest + ' ' + data[0].municipio_dest + ' ' + data[0].colonia_dest);
                            $$('#testigoreal1').attr('src', data[0].foto1);
                            $$('#testigoreal2').attr('src', data[0].foto2);
                            if (detectarProyecto(num_guia) == 'PPF') {
                                var ouput_parsear_billetes = '';
                                var parsear_billetes = data[0].contenido_paquete.split("|");
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
                                $$('#cont_paquete').html(data[0].contenido_paquete);
                                $$('#cont_paquete').append('<br>');
                                $$('#cont_paquete').append('Lote/id/etc: ' + data[0].lote);
                            }

                        },
                        function (error) {
                            console.log(error);
                        },
                        'json'
                    );
                } else {
                    app.dialog.alert('El scan fue cancelado');
                }
            }, function (error) {
                app.dialog.alert("El scan falló: " + error);
            },
            {
                showTorchButton: true, // iOS and Android
                torchOn: false, // Android, launch with the torch switched on (if available)
                saveHistory: true, // Android, save scan history (default false)
                prompt: "Ponga el código QR dentro del área de escaneo" // Android
            }
        );
    });
});

/**
 ** Control Gastos
 **/
$$(document).on('page:init', '.page[data-name="hojagastos"]', function (e) {
    DateActual('calendardefault');
    var id_operador = localStorage.getItem('userid');
    var periodo = $$('#calendardefault').val();

    app.request.setup({
        headers: {
            'Authorization': "bearer " + localStorage.getItem('token')
        }, beforeSend: function () {
            app.preloader.show();
        },
        complete: function () {
            app.preloader.hide();
        }
    });

    app.request.get(
        URL_NEW_WS + 'api/v2/consultar/gastos-operador/' + id_operador + '/' + periodo + '/' + periodo,
        function (data) {
            var gatosConsulta = '';
            if (data != '') {
                data.forEach(function (cslt_gsto_opr, index) {
                    var fotoExit = cslt_gsto_opr.foto_comprobante;
                    var pdfExit = cslt_gsto_opr.pdf_comprobante;
                    var xmlExit = cslt_gsto_opr.xml_comprobante;
                    if (fotoExit === undefined || fotoExit === null || fotoExit === '') {
                        var colorFoto = '';
                    } else {
                        var colorFoto = ' color-verde';
                    }
                    if (pdfExit === undefined || pdfExit === null || pdfExit === '') {
                        var colorPDF = '';
                    } else {
                        var colorPDF = ' color-verde';
                    }
                    if (xmlExit === undefined || xmlExit === null || xmlExit === '') {
                        var colorXML = ' color-gray';
                    } else {
                        var colorXML = ' color-verde';
                    }
                    gatosConsulta += '<tr><td class="label-cell">' + cslt_gsto_opr.concepto + '</td><td class="numeric-cell">' + cslt_gsto_opr.monto + '</td><td class="actions-cell"><a href="/editgastos/' + cslt_gsto_opr.id + '" class="link icon-only" id="btn_edit_gastos"><i class="icon f7-icons color-azul">compose</i></a><a href="/deletegastos/' + cslt_gsto_opr.id + '" class="link icon-only" id="btn_delete_gastos"><i class="icon f7-icons color-azul">trash</i></a><a href="#" class="link icon-only" id="viewLinkIMG"><i class="material-icons' + colorFoto + '">photo</i></a><a href="#" class="link icon-only" id="viewLinkPDF"><i class="material-icons ' + colorPDF + '">picture_as_pdf</i></a><a href="#" class="link icon-only" id="viewLinkXML"><i class="icon f7-icons ' + colorXML + '">document_fill</i></a></td></tr>';
                });
            } else {
                gatosConsulta += '<tr><td class="label-cell"></td><td class="label-cell colors" colspan="3">No hay Información</td></tr>';
            }
            $$('#tbcoperadores').html(gatosConsulta);
        },
        function (error) {
            console.log(error);
        },
        'json'
    );

    $$('#btn_add_gastos').on('click', function (e) {
        app.views.main.router.navigate('/addgastos/', {reloadCurrent: false});
    });

    $$('#btn_delete_gastos').on('click', function (e) {
        app.views.main.router.navigate('/deletegastos/', {reloadCurrent: false});
    });
});

$$(document).on('page:init', '.page[data-name="addgastos"]', function (e) {
    $$("#Gcomentario").hide();
    $$("#kmi").hide();
    $$("#kmf").hide();
    DateActual('fgasto');
    RsltsGastos('');
    RsltsPrvdr('');

    $$('#openFotoGasto').on('click', function () {
        app.dialog.create({
            title: 'Comprobate',
            text: 'Elegir opción:',
            buttons: [
                {
                    text: 'Camara',
                    cssClass: 'id_cmpbnt_camara'
                },
                {
                    text: 'Galeria',
                    cssClass: 'id_cmpbnt_galeria'
                },
                {
                    text: 'Cancelar',
                    cssClass: 'id_cmpbnt_cancelar'
                },
            ],
            verticalButtons: true,
        }).open();
        $$('.id_cmpbnt_camara').on('click', function (e) {
            var permissions = cordova.plugins.permissions;
            permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, success, error);

            function error() {
                app.dialog.alert('Necesitas permiso de: WRITE_EXTERNAL_STORAGE ');
            }

            function success(status) {
                if (!status.hasPermission) {
                    error();
                } else {
                    openCamera('myCanvasGastos');
                }
            }
        });

        $$('.id_cmpbnt_cancelar').on('click', function (e) {
            app.dialog.close();
        });

        $$('.id_cmpbnt_galeria').on('click', function (e) {
            var permissions = cordova.plugins.permissions;
            permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, success, error);

            function error() {
                app.dialog.alert('Necesitas permiso de: WRITE_EXTERNAL_STORAGE ');
            }

            function success(status) {
                if (!status.hasPermission) {
                    error();
                } else {
                    openFilePicker('myCanvasGastos');
                }
            }
        });
    });

    $$('#ConceptoGasto').on('change', function () {
        var ConceptoGasto = $$('#ConceptoGasto').val();
        if (ConceptoGasto == 3) {
            $$("#kmi").show();
            $$("#kmf").show();
        } else {
            $$("#kmi").hide();
            $$("#kmf").hide();
        }
        if (ConceptoGasto == 12) {
            $$("#Gcomentario").show();
        } else {
            $$("#Gcomentario").hide();
        }
    });

    $$('#PFDGastos').on('change', function () {
        convertToBase64('PFDGastos', 'pdfColocar', 'pdf');
    });

    $$('#XMLGastos').on('change', function () {
        convertToBase64('XMLGastos', 'xmlColocar', 'xml');
    });

    $$('#btn_form_add_gastos').on('click', function (e) {
        var id_operador = localStorage.getItem('userid');
        var fgasto = $$('#fgasto').val();
        var ConceptoGasto = $$('#ConceptoGasto').val();
        var concepto = $$('#comentario').val();
        var OprProve = $$('#OprProve').data("idPrvdr");
        var monto = $$('#monto').val();
        var TpoCmprbnt = $$('#TpoCmprbnt').val();
        var numticket = $$('#numticket').val();
        var FotoStatus = $$('#myCanvasGastos').data("foto1");
        var PDFStatus = $$('#pdfColocar').data("status");
        var XMLStatus = $$('#xmlColocar').data("status");
        var kminicial = $$('#kminicial').val();
        var kmfinal = $$('#kmfinal').val();
        var observaciones = $$('#observaciones').val();
        var comentario = $$('#comentario').val();

        validateMonto(monto);

        if (FotoStatus == 0) {
            var FotoGastos = '';
        } else {
            var cnvsGasto = $$('#myCanvasGastos')[0];
            var FotoGastos = cnvsGasto.toDataURL();
        }

        if (PDFStatus == 0) {
            var PFDGastos = '';
        } else {
            var PFDGastos = $$('#pdfColocar').data("file");
        }

        if (XMLStatus == 0) {
            var XMLGastos = '';
        } else {
            var XMLGastos = $$('#xmlColocar').data("file");
        }

        if (fgasto == "") {
            app.dialog.alert("El campo de Fecha esta vácio");
        } else if (id_operador == '') {
            app.dialog.alert("Operador no existe");
        } else if (ConceptoGasto == '') {
            app.dialog.alert("El campo de Concepto esta vácio");
        } else if (ConceptoGasto == 12 && comentario == '') {
            app.dialog.alert("Explicar en el campo concepto que tipo de concepto");
        } else if (ConceptoGasto == 3 && kminicial == '') {
            app.dialog.alert("El campo de kminicial esta vácio");
        } else if (ConceptoGasto == 3 && kmfinal == '') {
            app.dialog.alert("El campo de kmfinal esta vácio");
        } else if (OprProve == '') {
            app.dialog.alert("El campo de Proveedor esta vácio");
        } else if (monto == '') {
            app.dialog.alert("El campo de Monto esta vácio");
        } else if (numticket == '') {
            app.dialog.alert("El campo de No.Ticket o Folio esta vácio");
        } else if (TpoCmprbnt == '' || TpoCmprbnt == 0) {
            app.dialog.alert("El campo de Tipo de Comprobante esta vácio");
        } else if (FotoStatus == 0) {
            app.dialog.alert("El campo Foto del Comprobante esta vácio");
        } else if (observaciones == "" && PDFStatus == 0) {
            app.dialog.alert("¿Explicar bravemente porque no el archivo no se agrego PDF");
        } else if (observaciones == "" && XMLStatus == 0) {
            app.dialog.alert("¿Explicar bravemente porque no el archivo no se agrego XML");
        } else {
            console.log(FotoGastos+'**'+PFDGastos+'**'+XMLGastos+'**');
            app.request.setup({
                headers: {
                    'Authorization': "bearer " + localStorage.getItem('token')
                },
                beforeSend: function () {
                    app.preloader.show();
                },
                complete: function () {
                    app.preloader.hide();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 404) {
                        localStorage.clear();
                        app.preloader.hide();
                        window.location.reload();
                    }
                }
            });


            app.request.postJSON(
                URL_NEW_WS + 'api/v2/gastos-operador/' + id_operador,
                {
                    id_operador: id_operador,
                    id_concepto: ConceptoGasto,
                    comentarios: concepto,
                    id_proveedor: OprProve,
                    monto: monto,
                    num_comprobante: numticket,
                    tipo_comprobante: TpoCmprbnt,
                    fecha_gasto: fgasto,
                    foto_comprobante: FotoGastos,
                    pdf_comprobante: PFDGastos,
                    xml_comprobante: XMLGastos,
                    observaciones: observaciones,
                    kminicial: kminicial,
                    kmfinal: kmfinal
                },
                function (data) {
                    app.dialog.alert("El gasto se agrego correctamente");
                    app.views.main.router.navigate('/hojagastos/', {reloadCurrent: false});
                }, function (error) {
                    console.log(error);
                },
                'json'
            );
        }
    });

});

$$(document).on('page:init', '.page[data-name="editgastos"]', function (e) {
    $$("#Gcomentario").hide();
    $$("#kmi").hide();
    $$("#kmf").hide();
    RsltsPrvdr('');
    var idGasto = app.view.main.router.currentRoute.params.idGasto;

    $$('#ConceptoGasto').on('change', function () {
        var ConceptoGasto = $$('#ConceptoGasto').val();
        if (ConceptoGasto == 3) {
            $$("#kmi").show();
            $$("#kmf").show();
        } else {
            $$("#kmi").hide();
            $$("#kmf").hide();
        }
        if (ConceptoGasto == 12) {
            $$("#Gcomentario").show();
        } else {
            $$("#Gcomentario").hide();
        }
    });

    $$('#openFotoGasto').on('click', function () {
        app.dialog.create({
            title: 'Comprobate',
            text: 'Elegir opción:',
            buttons: [
                {
                    text: 'Camara',
                    cssClass: 'id_cmpbnt_camara'
                },
                {
                    text: 'Galeria',
                    cssClass: 'id_cmpbnt_galeria'
                },
                {
                    text: 'Cancelar',
                    cssClass: 'id_cmpbnt_cancelar'
                },
            ],
            verticalButtons: true,
        }).open();

        $$('.id_cmpbnt_camara').on('click', function (e) {
            var permissions = cordova.plugins.permissions;
            permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, success, error);

            function error() {
                app.dialog.alert('Necesitas permiso de: WRITE_EXTERNAL_STORAGE ');
            }

            function success(status) {
                if (!status.hasPermission) {
                    error();
                } else {
                    openCamera('myCanvasGastos');
                }
            }
        });

        $$('.id_cmpbnt_cancelar').on('click', function (e) {
            app.dialog.close();
        });

        $$('.id_cmpbnt_galeria').on('click', function (e) {
            var permissions = cordova.plugins.permissions;
            permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, success, error);

            function error() {
                app.dialog.alert('Necesitas permiso de: WRITE_EXTERNAL_STORAGE ');
            }

            function success(status) {
                if (!status.hasPermission) {
                    error();
                } else {
                    openFilePicker('myCanvasGastos');
                }
            }
        });

    });

    $$('#PFDGastos').on('change', function () {
        convertToBase64('PFDGastos', 'pdfColocar', 'pdf');
    });
    $$('#pdfColocar').on('click', function () {
        var PDFStatus = $$('#pdfColocar').data("file");
        cordova.InAppBrowser.open(PDFStatus, '_system', 'location=yes');
    });
    $$('#XMLGastos').on('change', function () {
        convertToBase64('XMLGastos', 'xmlColocar', 'xml');
    });
    $$('#xmlColocar').on('click', function () {
        var XMLStatus = $$('#xmlColocar').data("file");
        cordova.InAppBrowser.open(XMLStatus, '_blank', 'location=yes');
    });
    app.request.setup({
        headers: {
            'Authorization': "bearer " + localStorage.getItem('token')
        },
        beforeSend: function () {
            app.preloader.show();
        },
        complete: function () {
            app.preloader.hide();
        },
    });
    app.request.get(
        URL_NEW_WS + 'api/v2/consultar-gasto/' + idGasto,
        function (data) {
            data.forEach(function (Oprgasto, index) {
                DateGasto('fgasto', Oprgasto.fecha_gasto);
                RsltsGastos(Oprgasto.id_concepto);
                NmPrvdr('OprProve', Oprgasto.id_proveedor);
                RsltsConcepto('comentario', Oprgasto.id_concepto, Oprgasto.comentarios, Oprgasto.incil_klmtrj, Oprgasto.final_klmtrj);
                RsltsMonto('monto', Oprgasto.monto);
                RsltsNum('numticket', Oprgasto.num_comprobante);
                RsltsTpComprobante('TpoCmprbnt', Oprgasto.tipo_comprobante);
                RsltsFotoComprobante('mediaColocar', Oprgasto.foto_comprobante);
                RsltsPDFComprobante('PFDGastos', Oprgasto.pdf_comprobante);
                RsltsXMLComprobante('XMLGastos', Oprgasto.xml_comprobante);
                RsltsObservaciones('observaciones', Oprgasto.observaciones);
            });
        },
        function (error) {
            console.log(error);
        },
        'json'
    );

    $$('#btn_form_add_gastos').on('click', function (e) {
        //console.log("btn_form_add_gastos");
        var id_operador = localStorage.getItem('userid');
        var fgasto = $$('#fgasto').val();
        var ConceptoGasto = $$('#ConceptoGasto').val();
        var concepto = $$('#comentario').val();
        var OprProve = $$('#OprProve').data("idPrvdr");
        var monto = $$('#monto').val();
        var numticket = $$('#numticket').val();
        var TpoCmprbnt = $$('#TpoCmprbnt').val();
        var FotoStatus = $$('#myCanvasGastos').data("foto1");
        //console.log(FotoStatus);
        var FotoStatusBD = $$('#mediaColocar').data("status");
        //console.log(FotoStatusBD);
        var PDFStatus = $$('#pdfColocar').data("status");
        //console.log(PDFStatus);
        var PDFStatusBD = $$('#PFDGastos').data("status");
        //console.log(PDFStatusBD);
        var XMLStatus = $$('#xmlColocar').data("status");
        //console.log(XMLStatus);
        var XMLStatusBD = $$('#XMLGastos').data("status");
        //console.log(XMLStatusBD);
        var kminicial = $$('#kminicial').val();
        var kmfinal = $$('#kmfinal').val();
        var observaciones = $$('#observaciones').val();

        validateMonto(monto);

        if (FotoStatus == 0 && FotoStatusBD == 1) {
            var FotoGastos = '';
        } else {
            var cnvsGasto = $$('#myCanvasGastos')[0];
            var FotoGastos = cnvsGasto.toDataURL();
        }

        if (PDFStatus == 0) {
            var PFDGastos = '';
        } else {
            var PFDGastos = $$('#pdfColocar').data("file");
        }

        if (XMLStatus == 0) {
            var XMLGastos = '';
        } else {
            var XMLGastos = $$('#xmlColocar').data("file");
        }

        if (fgasto == "") {
            app.dialog.alert("El campo de Fecha esta vácio");
        } else if (id_operador == '') {
            app.dialog.alert("Operador no existe");
        } else if (ConceptoGasto == '') {
            app.dialog.alert("El campo de Concepto esta vácio");
        } else if (ConceptoGasto == 12 && comentario == '') {
            app.dialog.alert("Explicar en el campo concepto que tipo de concepto");
        } else if (ConceptoGasto == 3 && kminicial == '') {
            app.dialog.alert("El campo de kminicial esta vácio");
        } else if (ConceptoGasto == 3 && kmfinal == '') {
            app.dialog.alert("El campo de kmfinal esta vácio");
        } else if (OprProve == '') {
            app.dialog.alert("El campo de Proveedor esta vácio");
        } else if (monto == '') {
            app.dialog.alert("El campo de Monto esta vácio");
        } else if (TpoCmprbnt == '' || TpoCmprbnt == 0) {
            app.dialog.alert("El campo de Tipo de Comprobante esta vácio");
        } else if (numticket == '') {
            app.dialog.alert("El campo de No.Tickeet o Folio esta vácio");
        } else if (FotoStatus == 0 && FotoStatusBD == 0) {
            app.dialog.alert("El campo Foto del Comprobante esta vácio");
        } else if (observaciones == "" && PDFStatus == 0 && PDFStatusBD == 0) {
            app.dialog.alert("¿Explicar bravemente porque no el archivo no se agrego PDF");
        } else if (observaciones == "" && XMLStatus == 0 && XMLStatusBD == 0) {
            app.dialog.alert("¿Explicar bravemente porque no el archivo no se agrego XML");
        } else {
            if (ConceptoGasto != 12) {
                concepto = '';
            }
            app.request.setup({
                headers: {
                    'Authorization': "bearer " + localStorage.getItem('token')
                },
                beforeSend: function () {
                    app.preloader.show();
                },
                complete: function () {
                    app.preloader.hide();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 404) {
                        localStorage.clear();
                        app.preloader.hide();
                        window.location.reload();
                    }
                }
            });

            app.request.postJSON(
                URL_NEW_WS + 'api/v2/editar/gastos-operador/' + idGasto,
                {
                    id_operador: id_operador,
                    id_concepto: ConceptoGasto,
                    comentarios: concepto,
                    id_proveedor: OprProve,
                    monto: monto,
                    num_comprobante: numticket,
                    tipo_comprobante: TpoCmprbnt,
                    fecha_gasto: fgasto,
                    foto_comprobante: FotoGastos,
                    pdf_comprobante: PFDGastos,
                    xml_comprobante: XMLGastos,
                    observaciones: observaciones,
                    kminicial: kminicial,
                    kmfinal: kmfinal
                },
                function (data) {
                    app.dialog.alert("El gasto se actualizo correctamente");
                    app.views.main.router.navigate('/hojagastos/', {reloadCurrent: false});
                }, function (error) {
                    console.log(error);
                },
                'json'
            );

        }
    });
});

$$(document).on('page:init', '.page[data-name="addproveedor"]', function (e) {
    $$('#btn_add_proveedor').on('click', function (e) {
        var name_proveedor = $$('#nameprvdr').val();
        if (name_proveedor != '') {
            name_proveedor = name_proveedor.toUpperCase();
            app.request.setup({
                headers: {
                    'Authorization': "bearer " + localStorage.getItem('token')
                },
                beforeSend: function () {
                    app.preloader.show();
                },
                complete: function () {
                    app.preloader.hide();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 404) {
                        localStorage.clear();
                        app.preloader.hide();
                        window.location.reload();
                    }
                }
            });

            app.request.postJSON(
                URL_NEW_WS + 'api/v2/proveedor-operador/nuevo',
                {
                    nombre: name_proveedor
                },
                function (data) {
                    app.dialog.alert("El proveedor  se  agrego correctamente");
                    app.views.main.router.navigate('/addgastos/', {reloadCurrent: false});
                }, function (error) {
                    console.log(error);
                },
                'json'
            );
        } else {
            app.dialog.alert("El campo del proveedor esta vacío");
        }
    });
});

$$(document).on('page:init', '.page[data-name="deletegastos"]', function (e) {
    var idGasto = app.view.main.router.currentRoute.params.idGasto;
    app.request.setup({
        headers: {
            'Authorization': "bearer " + localStorage.getItem('token')
        },
        beforeSend: function () {
            app.preloader.show();
        },
        complete: function () {
            app.preloader.hide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 404) {
                localStorage.clear();
                app.preloader.hide();
                window.location.reload();
            }
        }
    });

    app.request.get(
        URL_NEW_WS + 'api/v2/delete/gastos-operador/' + idGasto,
        function (data) {
            app.views.main.router.navigate('/hojagastos/', {reloadCurrent: false});
            app.dialog.alert("El Gasto se elimino correctamente");
        }, function (error) {
            console.log(error);
        },
        'json'
    );
});